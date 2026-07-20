import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import apiClient from '../api/apiClient';
import { KOT_STATUS } from '../constants/constants';

const KotContext = createContext(null);

export function KotProvider({ children }) {
  const [kots, setKots] = useState([]);
  const clientRef = useRef(null);

  const loadActiveKots = useCallback(async () => {
    try {
      const response = await apiClient.get('/kots/active');
      setKots(response.data);
    } catch (error) {
      console.error('Failed to load active KOTs:', error);
    }
  }, []);

  useEffect(() => {
    loadActiveKots();
  }, [loadActiveKots]);

  const upsertKot = useCallback((incomingKot) => {
    setKots((previous) => {
      const index = previous.findIndex((k) => k.id === incomingKot.id);

      if (index === -1) {
        return [...previous, incomingKot];
      }

      const updated = [...previous];
      updated[index] = incomingKot;
      return updated;
    });
  }, []);

  // -----------------------------------------------------------------------
  // WebSocket / STOMP connection.
  //
  // This used to live inside KitchenDisplayPage's own useEffect, which meant
  // it only existed while the KDS screen happened to be mounted. Any other
  // screen subscribed to this context (e.g. TakeawayPage, sidebar badge
  // counts) never received live "kot updated" events unless KDS was also
  // open in the same browser tab — so bumping an order in the kitchen would
  // never be reflected on the Takeaway counter in real time.
  //
  // Establishing the connection here, at the provider that owns `kots`,
  // makes it a true app-wide singleton: it connects once when the app boots
  // and keeps every consumer of useKotContext() in sync for as long as the
  // app is open, independent of which route is currently rendered.
  // -----------------------------------------------------------------------
  useEffect(() => {
    const isDevelopment = import.meta.env.DEV;

    const socketUrl = isDevelopment
      ? 'http://localhost:8080/ws-pos'
      : '/ws-pos';

    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        // Resync with the server the moment we (re)connect — the socket
        // only delivers *future* events, so without this, any ticket
        // fired or bumped while disconnected would be missed entirely.
        loadActiveKots();

        client.subscribe('/topic/kots', ({ body }) => {
          upsertKot(JSON.parse(body));
        });

        client.subscribe('/topic/kots/update', ({ body }) => {
          upsertKot(JSON.parse(body));
        });
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
    // Intentionally run once for the lifetime of the app — this is a
    // singleton connection, not something that should reconnect on every
    // render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pushKot = async (kot) => {
    const response = await apiClient.post('/kots', kot);
    // Optimistically apply the response locally too. The server also
    // broadcasts this over /topic/kots, but updating state here means a
    // ticket fired from Tables/Takeaway shows up immediately for the tab
    // that fired it even in the (small) window before the socket echo
    // arrives.
    upsertKot(response.data);
    return response.data;
  };

  const bumpKot = async (kotId) => {
    try {
      const response = await apiClient.put(`/kots/${kotId}/status`, {
        status: KOT_STATUS.SERVED,
      });

      // Apply the server's response (source of truth) immediately so the
      // tab that clicked "Bump" doesn't have to wait for its own socket
      // echo. Every other tab/page picks this same change up via the
      // /topic/kots/update broadcast above.
      upsertKot(response.data);
    } catch (error) {
      console.error('Failed to bump KOT status:', error);
    }
  };

  const markItem = (kotId, itemIndex) => {
    setKots((ks) =>
      ks.map((k) => {
        if (k.id !== kotId) return k;
        const items = k.items.map((it, i) =>
          i === itemIndex ? { ...it, done: !it.done } : it
        );
        return { ...k, items };
      })
    );
  };

  const getKotById = (kotId) => kots.find((k) => k.id === kotId);
  const activeKots = kots.filter((k) => k.status === KOT_STATUS.ACTIVE);

  // Every KOT ever fired for a table lives in `kots` under refId === tableId
  // (dine-in orders use the table id as the KOT's refId — see TablesPage).
  // This is kept live by the same websocket subscription this provider
  // already holds, so Billing gets an instantly up-to-date view of the
  // kitchen without any extra network calls or polling.
  const getPendingKotsForTable = (tableId) =>
    kots.filter((k) => k.refId === tableId && k.status !== KOT_STATUS.SERVED);

  const isTableClearToBill = (tableId) =>
    getPendingKotsForTable(tableId).length === 0;

  const value = {
    kots,
    setKots,
    pushKot,
    upsertKot,
    markItem,
    bumpKot,
    getKotById,
    activeKots,
    getPendingKotsForTable,
    isTableClearToBill,
    reload: loadActiveKots,
  };

  return <KotContext.Provider value={value}>{children}</KotContext.Provider>;
}

export function useKotContext() {
  const ctx = useContext(KotContext);
  if (!ctx) throw new Error('useKotContext must be used within KotProvider');
  return ctx;
}
