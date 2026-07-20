import React, { useState, useMemo } from "react";

import SectionTitle from "../../components/common/SectionTitle";
import Card from "../../components/common/Card";
import KDSFilter from "../../components/kitchen/KDSFilter";
import KotCard from "../../components/kitchen/KotCard";

import { useKotContext } from "../../context/KotContext";
import { useNotificationContext } from "../../context/NotificationContext";

import { ORDER_TYPE } from "../../constants/constants";
import { T } from "../../constants/theme";

export default function KitchenDisplayPage() {
  const {
    activeKots,
    bumpKot,
    getKotById,
  } = useKotContext();

  const { pushAlert } = useNotificationContext();

  const [filter, setFilter] = useState("all");

  // The WebSocket/STOMP connection that keeps `activeKots` live now lives in
  // KotProvider (see context/KotContext.jsx) so it's an app-wide singleton
  // that stays connected — and keeps every page in sync — regardless of
  // whether this screen is mounted. No per-page socket setup needed here.

  // -----------------------------
  // Filters
  // -----------------------------
  const dineInKots = useMemo(
    () =>
      activeKots.filter(
        (k) => k.orderType === ORDER_TYPE.DINE_IN
      ),
    [activeKots]
  );

  const takeawayKots = useMemo(
    () =>
      activeKots.filter(
        (k) => k.orderType === ORDER_TYPE.TAKEAWAY
      ),
    [activeKots]
  );

  const visibleKots = useMemo(() => {
    switch (filter) {
      case "dine-in":
        return dineInKots;

      case "takeaway":
        return takeawayKots;

      default:
        return activeKots;
    }
  }, [filter, activeKots, dineInKots, takeawayKots]);

  // -----------------------------
  // Bump KOT
  // -----------------------------
  const bump = async (kotId) => {
    const kot = getKotById(kotId);

    await bumpKot(kotId);

    if (kot) {
      pushAlert({
        orderType: kot.orderType,
        refId: kot.refId,
        station: kot.station,
        message:
          kot.orderType === ORDER_TYPE.TAKEAWAY
            ? `Token ${kot.refId} Ready`
            : `Table ${kot.refId} Ready`,
      });
    }
  };

  const filters = [
    {
      id: "all",
      label: "All Orders",
      count: activeKots.length,
    },
    {
      id: "dine-in",
      label: "Tables",
      count: dineInKots.length,
    },
    {
      id: "takeaway",
      label: "Takeaway",
      count: takeawayKots.length,
    },
  ];

  return (
    <div style={{ padding: "36px 44px" }}>
      <SectionTitle
        eyebrow="Kitchen Display System"
        title="Live Order Board"
        right={
          <div
            style={{
              fontSize: 13,
              color: T.inkSoft,
            }}
          >
            Fire KOT → Kitchen prepares → Bump when complete
          </div>
        }
      />

      <KDSFilter
        filters={filters}
        activeFilter={filter}
        onSelect={setFilter}
      />

      {visibleKots.length === 0 ? (
        <Card
          style={{
            marginTop: 24,
            padding: 40,
            textAlign: "center",
            color: T.inkSoft,
            fontSize: 14,
          }}
        >
          No active kitchen orders.
        </Card>
      ) : (
        <div
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(360px,1fr))",
            gap: 20,
          }}
        >
          {visibleKots.map((kot) => (
            <KotCard
              key={kot.id}
              kot={kot}
              onBump={bump}
            />
          ))}
        </div>
      )}
    </div>
  );
}