import React, { useState } from 'react';
import SectionTitle from '../../components/common/SectionTitle';
import MenuPicker from '../../components/tables/MenuPicker';
import TakeawayCart from '../../components/takeaway/TakeawayCart';
import TokenList from '../../components/takeaway/TokenList';
import Card from '../../components/common/Card';

import { useKotContext } from '../../context/KotContext';
import { useTakeawayContext } from '../../context/TakeawayContext';
import { useBillingContext } from '../../context/BillingContext';

import { T, FONT_BODY } from '../../constants/theme';
import { ORDER_TYPE, KOT_STATUS } from '../../constants/constants';

import { getNextKotNumber, getNextTokenNumber } from '../../data/counters';
import { groupByStation } from '../../utils/helpers';

import useDraftOrder from '../../hooks/useDraftOrder';
import useTaxCalculation from '../../hooks/useTaxCalculation';

export default function TakeawayPage() {
  const { kots, pushKot } = useKotContext();

  const {
    addTakeaway,
    handOver,
    activeTokens,
  } = useTakeawayContext();

  const { addSale } = useBillingContext();

  const {
    draftLines,
    draftTotal,
    addToDraft,
    changeDraft,
    removeLine,
    clearDraft,
  } = useDraftOrder();

  const tax = useTaxCalculation(draftTotal);

  const [confirmed, setConfirmed] = useState(null);

  const payAndSend = async (method) => {
    if (!draftLines.length) return;

    const token = getNextTokenNumber();
    const number = getNextKotNumber();

    const byStation = groupByStation(draftLines);

    for (const [station, lines] of Object.entries(byStation)) {
      await pushKot({
        id: `k${number}-${station}`,
        number,
        orderType: ORDER_TYPE.TAKEAWAY,
        refId: token,
        station,
        items: lines.map((item) => ({
          menuItemId: item.menuItemId,
          name: item.name,
          price: item.price,
          qty: item.qty,
          station: item.station,
          category: item.category,
          isVeg: item.isVeg,
          done: false,
        })),
        status: KOT_STATUS.ACTIVE,
        createdAt: Date.now(),
      });
    }

    addSale(tax.total);

    addTakeaway({
      token,
      items: draftLines,
      total: tax.total,
      method,
      createdAt: Date.now(),
      handedOver: false,
    });

    setConfirmed({
      token,
      total: tax.total,
      method,
    });

    clearDraft();
  };

  // IMPORTANT: this must look at the *full* `kots` list, not
  // `activeKots` (which is pre-filtered to only status === ACTIVE).
  // Once the kitchen bumps a KOT, its status flips to SERVED and it
  // drops out of activeKots by definition — so checking only activeKots
  // meant a bumped ticket looked identical to "no ticket exists yet",
  // and statusFor kept reporting 'cooking' forever. Using `kots` lets us
  // see the ticket in its SERVED state and correctly report 'ready'.
  const statusFor = (token) => {
    const related = kots.filter(
      (kot) =>
        kot.orderType === ORDER_TYPE.TAKEAWAY &&
        kot.refId === String(token)
    );

    if (related.length === 0) {
      return 'cooking';
    }

    return related.every(
      (kot) => kot.status === KOT_STATUS.SERVED
    )
      ? 'ready'
      : 'cooking';
  };

  return (
    <div style={{ padding: '36px 44px' }}>
      <SectionTitle
        eyebrow="Takeaway Counter"
        title="Takeaway — pay first, then cook"
        right={
          <div
            style={{
              fontSize: 12,
              color: T.inkSoft,
              fontFamily: FONT_BODY,
            }}
          >
            Takeaway is always prepaid — the KOT fires only after payment is
            taken.
          </div>
        }
      />

      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: '1fr 340px',
        }}
      >
        <Card style={{ padding: 16 }}>
          <MenuPicker onAddItem={addToDraft} />

          <TokenList
            tokens={activeTokens}
            onHandOver={handOver}
            statusFor={statusFor}
          />
        </Card>

        <TakeawayCart
          confirmed={confirmed}
          onNewOrder={() => setConfirmed(null)}
          draftLines={draftLines}
          draftTotal={draftTotal}
          onChangeDraft={changeDraft}
          onRemoveLine={removeLine}
          tax={tax}
          onPay={payAndSend}
        />
      </div>
    </div>
  );
}