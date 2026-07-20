import React from 'react';
import Card from '../common/Card';
import { Pencil, Trash2 } from 'lucide-react';
import { T, FONT_BODY } from '../../constants/theme';
import { useInventoryContext } from '../../context/InventoryContext';

export default function MenuTable({
    menuItems,
    loading,
    error,
    onEdit,
    onDelete,
}) {
    const { inventory } = useInventoryContext();

    // Cross-reference each recipe line against live inventory stock so a
    // dish that's missing an ingredient (or is below its reorder threshold)
    // is visible right on the Menu screen, not just buried in Inventory.
    const stockStatus = (recipeLine) => {
        const live = inventory.find((i) => i.id === recipeLine.inventoryItemId);
        if (!live) return 'missing';
        if (live.stock <= 0) return 'out';
        if (live.stock <= live.threshold) return 'low';
        return 'ok';
    };

    if (loading) {
        return (
            <Card style={{ padding: 30, textAlign: 'center' }}>
                Loading menu...
            </Card>
        );
    }

    if (error) {
        return (
            <Card style={{ padding: 30, textAlign: 'center', color: T.kumkum }}>
                {error}
            </Card>
        );
    }

    if (!menuItems.length) {
        return (
            <Card style={{ padding: 30, textAlign: 'center' }}>
                No Menu Items Found
            </Card>
        );
    }

    return (
        <Card style={{ padding: 0, overflowX: 'auto' }}>
            <table
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontFamily: FONT_BODY,
                }}
            >
                <thead>
                    <tr
                        style={{
                            background: T.primarySoft,
                        }}
                    >
                        <th style={styles.header}>ID</th>
                        <th style={styles.header}>Name</th>
                        <th style={styles.header}>Category</th>
                        <th style={styles.header}>Price</th>
                        <th style={styles.header}>Veg</th>
                        <th style={styles.header}>Station</th>
                        <th style={styles.header}>Ingredients</th>
                        <th style={styles.header}>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {menuItems.map(item => (

                        <tr
                            key={item.id}
                            style={{
                                borderBottom: `1px solid ${T.border}`,
                            }}
                        >

                            <td style={styles.cell}>{item.id}</td>

                            <td style={styles.cell}>{item.name}</td>

                            <td style={styles.cell}>{item.category}</td>

                            <td style={styles.cell}>
                                ₹{Number(item.price).toFixed(2)}
                            </td>

                            <td style={styles.cell}>
                                {item.isVeg ? "🟢 Veg" : "🔴 Non-Veg"}
                            </td>

                            <td style={styles.cell}>
                                {item.station}
                            </td>

                            <td style={{ ...styles.cell, minWidth: 180 }}>
                                {!item.recipe || item.recipe.length === 0 ? (
                                    <span style={{ color: T.inkSoft, fontSize: 12 }}>
                                        Not linked
                                    </span>
                                ) : (
                                    <div className="flex flex-col gap-1">
                                        {item.recipe.map((line) => {
                                            const status = stockStatus(line);
                                            const color =
                                                status === 'out' || status === 'missing'
                                                    ? '#d32f2f'
                                                    : status === 'low'
                                                    ? '#b8860b'
                                                    : T.inkSoft;
                                            return (
                                                <span
                                                    key={line.id ?? line.inventoryItemId}
                                                    style={{ fontSize: 12, color }}
                                                >
                                                    {line.inventoryItemName} × {line.qtyPerOrder} {line.unit}
                                                    {status === 'low' && ' (low stock)'}
                                                    {status === 'out' && ' (out of stock)'}
                                                    {status === 'missing' && ' (item removed)'}
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}
                            </td>

                            <td style={styles.cell}>

                                <button
                                    onClick={() => onEdit(item)}
                                    style={styles.iconButton}
                                >
                                    <Pencil size={18} />
                                </button>

                                <button
                                    onClick={() => onDelete(item)}
                                    style={{
                                        ...styles.iconButton,
                                        color: "#d32f2f",
                                    }}
                                >
                                    <Trash2 size={18} />
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </Card>
    );

}

const styles = {

    header: {

        padding: "14px",

        textAlign: "left",

        fontWeight: 700,

    },

    cell: {

        padding: "14px",

    },

    iconButton: {

        background: "transparent",

        border: "none",

        cursor: "pointer",

        marginRight: 10,

    }

};