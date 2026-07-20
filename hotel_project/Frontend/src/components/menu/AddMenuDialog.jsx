import React, { useEffect, useState } from "react";
import RecipeEditor from "./RecipeEditor";

const EMPTY_FORM = {
    name: "",
    category: "",
    price: "",
    isVeg: true,
    station: "",
};

export default function AddMenuDialog({
    open,
    onClose,
    onSave,
}) {

    const [form, setForm] = useState(EMPTY_FORM);
    const [recipe, setRecipe] = useState([]);

    useEffect(() => {
        if (open) {
            setForm(EMPTY_FORM);
            setRecipe([]);
        }
    }, [open]);

    if (!open) return null;

    const updateField = (key, value) => {
        setForm(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const submit = () => {

        if (!form.name.trim()) {
            alert("Item Name is required");
            return;
        }

        if (!form.category.trim()) {
            alert("Category is required");
            return;
        }

        if (!form.station.trim()) {
            alert("Station is required");
            return;
        }

        if (!form.price || Number(form.price) <= 0) {
            alert("Enter valid price");
            return;
        }

        onSave({
            ...form,
            price: Number(form.price),
            recipe,
        });

    };

    return (
        <div className="dialog-overlay">

            <div className="dialog">

                <h2>Add Menu Item</h2>

                <input
                    placeholder="Item Name"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                />

                <input
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                />

                <input
                    placeholder="Station"
                    value={form.station}
                    onChange={(e) => updateField("station", e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Price"
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

                    <button onClick={submit}>
                        Save
                    </button>

                </div>

            </div>

        </div>
    );

}