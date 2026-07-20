import React from 'react';
import { Plus, Search } from 'lucide-react';
import { T, FONT_BODY } from '../../constants/theme';

export default function MenuToolbar({
    search,
    onSearchChange,
    onAddClick,
}) {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
                gap: 16,
                flexWrap: 'wrap',
            }}
        >
            <div
                style={{
                    position: 'relative',
                    width: 320,
                    maxWidth: '100%',
                }}
            >
                <Search
                    size={18}
                    style={{
                        position: 'absolute',
                        left: 14,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: T.inkSoft,
                    }}
                />

                <input
                    type="text"
                    placeholder="Search menu item..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px 12px 12px 42px',
                        borderRadius: 10,
                        border: `1px solid ${T.border}`,
                        outline: 'none',
                        fontFamily: FONT_BODY,
                        fontSize: 14,
                    }}
                />
            </div>

            <button
                onClick={onAddClick}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: T.primary,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    cursor: 'pointer',
                    padding: '12px 18px',
                    fontWeight: 600,
                }}
            >
                <Plus size={18} />
                Add Menu Item
            </button>
        </div>
    );
}