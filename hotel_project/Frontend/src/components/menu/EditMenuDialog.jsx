import React, { useEffect, useState } from "react";
import RecipeEditor from "./RecipeEditor";

export default function EditMenuDialog({

    open,

    menuItem,

    onClose,

    onUpdate,

}) {

    const [form, setForm] = useState(menuItem);
    const [recipe, setRecipe] = useState([]);

    useEffect(() => {

        setForm(menuItem);

        setRecipe(
            (menuItem?.recipe || []).map((line) => ({
                inventoryItemId: line.inventoryItemId,
                qtyPerOrder: line.qtyPerOrder,
            }))
        );

    }, [menuItem]);

    if (!open || !form) return null;

    const updateField = (key, value) => {

        setForm(prev => ({

            ...prev,

            [key]: value,

        }));

    };

    const save = () => {

        onUpdate({

            ...form,

            price: Number(form.price),

            recipe,

        });

    };

    return (

        <div className="dialog-overlay">

            <div className="dialog">

                <h2>Edit Menu Item</h2>

                <input

                    value={form.name}

                    onChange={(e) => updateField("name", e.target.value)}

                />

                <input

                    value={form.category}

                    onChange={(e) => updateField("category", e.target.value)}

                />

                <input

                    value={form.station}

                    onChange={(e) => updateField("station", e.target.value)}

                />

                <input

                    type="number"

                    value={form.price}

                    onChange={(e) => updateField("price", e.target.value)}

                />

                <label>

                    <input

                        type="checkbox"

                        checked={form.isVeg}

                        onChange={(e) => updateField("isVeg", e.target.checked)}

                    />

                    Veg Item

                </label>

                <RecipeEditor value={recipe} onChange={setRecipe} />

                <div className="dialog-actions">

                    <button onClick={onClose}>

                        Cancel

                    </button>

                    <button onClick={save}>

                        Update

                    </button>

                </div>

            </div>

        </div>

    );

}