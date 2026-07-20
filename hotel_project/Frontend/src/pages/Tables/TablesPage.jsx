import React, { useState } from 'react';
import SectionTitle from '../../components/common/SectionTitle';
import Card from '../../components/common/Card';
import TableGrid from '../../components/tables/TableGrid';
import AddTableDialog from '../../components/tables/AddTableDialog';
import MenuPicker from '../../components/tables/MenuPicker';
import OrderPanel from '../../components/tables/OrderPanel';
import { useTableContext } from '../../context/TableContext';
import { useOrderContext } from '../../context/OrderContext';
import { useKotContext } from '../../context/KotContext';
import { T, FONT_BODY } from '../../constants/theme';
import { TABLE_STATUS, ORDER_TYPE, KOT_STATUS } from '../../constants/constants';
import { getNextKotNumber } from '../../data/counters';
import { groupByStation } from '../../utils/helpers';
import useDraftOrder from '../../hooks/useDraftOrder';

export default function TablesPage() {
  const { tables, updateTableStatus, createTable, deleteTable } = useTableContext();
  const { addToOrder, getOrderForTable } = useOrderContext();
  const { pushKot } = useKotContext();
  const { draftLines, draftTotal, addToDraft, changeDraft, removeLine, clearDraft } = useDraftOrder();

  const [selected, setSelected] = useState(null);
  const [justSent, setJustSent] = useState(null);
  const [showAddTable, setShowAddTable] = useState(false);

  const openTable = (t) => {
    setSelected(t.id);
    clearDraft();
    setJustSent(null);
  };

  // 1. Make the function async
  const sendKOT = async () => {
    if (!draftLines.length) return;
    const number = getNextKotNumber();
    const byStation = groupByStation(draftLines);

    // 2. Use a for...of loop to properly await the database push
    for (const [station, lines] of Object.entries(byStation)) {
      await pushKot({
        id: `k${number}-${station}`,
        number,
        orderType: ORDER_TYPE.DINE_IN,
        refId: selected,
        station,
        items: lines.map((l) => ({
          menuItemId: l.menuItemId,
          name: l.name,
          price: l.price,
          qty: l.qty,
          station: l.station,
          category: l.category,
          isVeg: l.isVeg,
          done: false,
        })),
        status: KOT_STATUS.ACTIVE,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    addToOrder(selected, draftLines);

    // 3. Await the table status update to the database
    await updateTableStatus(selected, TABLE_STATUS.OCCUPIED);

    setJustSent({ number, count: draftLines.length });
    clearDraft();
  };

  const handleDeleteTable = async (tableId) => {
    if (!window.confirm(`Delete table ${tableId}?`)) return;
    try {
      await deleteTable(tableId);
      if (selected === tableId) setSelected(null);
    } catch {
      // error toast already surfaced by TableContext
    }
  };

  const table = tables.find((t) => t.id === selected);
  const currentOrder = getOrderForTable(selected);
  const orderTotal = currentOrder.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * item.qty,
    0
  );

  return (
    <div style={{ padding: '36px 44px' }}>
      <SectionTitle
        eyebrow="Cashier Station"
        title="Tables & captain order"
        right={
          <div style={{ fontSize: 12, color: T.inkSoft, fontFamily: FONT_BODY }}>
            Orders punched here raise a KOT straight to the kitchen — no paper, no relay.
          </div>
        }
      />

      <div className="grid gap-6" style={{ gridTemplateColumns: '260px 1fr 340px' }}>
        <TableGrid
          tables={tables}
          selectedId={selected}
          onSelect={openTable}
          onAddTable={() => setShowAddTable(true)}
          onDeleteTable={handleDeleteTable}
        />

        {!selected ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: T.inkSoft,
              fontSize: 13,
              padding: 40,
              textAlign: 'center',
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 14,
            }}
          >
            Select a table to start punching an order.
          </div>
        ) : (
          <Card style={{ padding: 16 }}>
            <MenuPicker onAddItem={addToDraft} />
          </Card>
        )}

        <OrderPanel
          selectedId={selected}
          table={table}
          currentOrder={currentOrder}
          orderTotal={orderTotal}
          draftLines={draftLines}
          draftTotal={draftTotal}
          onChangeDraft={changeDraft}
          onRemoveLine={removeLine}
          onSendKOT={sendKOT}
          justSent={justSent}
        />
      </div>

      {showAddTable && (
        <AddTableDialog
          onClose={() => setShowAddTable(false)}
          onCreate={(id, seats) => createTable(id, seats)}
        />
      )}
    </div>
  );
}