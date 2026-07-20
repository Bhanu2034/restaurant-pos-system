import React, { useEffect, useMemo, useState } from "react";
import CategoryFilter from "../common/CategoryFilter";
import MenuItemCard from "../common/MenuItemCard";
import useMenu from "../../hooks/useMenu";
import { useInventoryContext } from "../../context/InventoryContext";

export default function MenuPicker({ onAddItem }) {

  const {

    menuItems,

    categories,

    loading,

    error,

  } = useMenu();

  const { inventory } = useInventoryContext();

  // A dish is orderable only if every ingredient in its recipe currently has
  // enough stock for at least one more order. Dishes with no recipe linked
  // are always considered available (nothing to block on).
  const isAvailable = (item) => {
    if (!item.recipe || item.recipe.length === 0) return true;
    return item.recipe.every((line) => {
      const live = inventory.find((i) => i.id === line.inventoryItemId);
      return live && live.stock >= line.qtyPerOrder;
    });
  };

  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {

    if (!activeCategory && categories.length) {

      setActiveCategory(categories[0]);

    }

  }, [categories, activeCategory]);

  const filteredItems = useMemo(() => {

    if (!activeCategory) {

      return menuItems;

    }

    return menuItems.filter(item =>

      item.category === activeCategory

    );

  }, [menuItems, activeCategory]);

  if (loading) {

    return <p>Loading Menu...</p>;

  }

  if (error) {

    return <p>{error}</p>;

  }

  return (

    <>

      <CategoryFilter

        categories={categories}

        activeCategory={activeCategory}

        onSelect={setActiveCategory}

      />

      <div className="grid grid-cols-2 gap-2">

        {filteredItems.map(item => (

          <MenuItemCard

            key={item.id}

            item={item}

            onAdd={onAddItem}

            available={isAvailable(item)}

          />

        ))}

      </div>

    </>

  );

}