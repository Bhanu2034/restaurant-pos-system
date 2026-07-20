import React from 'react';
import SectionTitle from '../../components/common/SectionTitle';
import AddIngredientForm from '../../components/inventory/AddIngredientForm';
import InventoryTable from '../../components/inventory/InventoryTable';
import { useInventoryContext } from '../../context/InventoryContext';
import { T, FONT_BODY } from '../../constants/theme';

export default function InventoryPage() {
  const { inventory, restock, addItem, editItem, deleteItem } = useInventoryContext();

  return (
    <div style={{ padding: '36px 44px' }}>
      <SectionTitle
        eyebrow="Back of house"
        title="Inventory management"
        right={
          <div style={{ fontSize: 12, color: T.inkSoft, fontFamily: FONT_BODY }}>
            Add new stock items, update quantities, or remove items you no longer track.
          </div>
        }
      />
      <AddIngredientForm onAdd={addItem} />
      <InventoryTable
        inventory={inventory}
        onRestock={restock}
        onEdit={editItem}
        onDelete={deleteItem}
      />
    </div>
  );
}
