import React from "react";
import Card from "../common/Card";
import { ORDER_TYPE } from "../../constants/constants";
import { T } from "../../constants/theme";

export default function KotCard({ kot, onBump }) {
    return (
        <Card
            style={{
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 16,
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                <div>
                    <h3
                        style={{
                            margin: 0,
                            fontSize: 22,
                            color: T.ink,
                        }}
                    >
                        KOT #{kot.number}
                    </h3>

                    <div
                        style={{
                            color: T.inkSoft,
                            marginTop: 6,
                            fontSize: 14,
                        }}
                    >
                        {kot.orderType === ORDER_TYPE.DINE_IN
                            ? `Table ${kot.refId}`
                            : `Token ${kot.refId}`}
                    </div>
                </div>

                <div
                    style={{
                        background: "#FFF4DD",
                        color: "#B45309",
                        padding: "6px 12px",
                        borderRadius: 20,
                        fontWeight: 600,
                        fontSize: 13,
                    }}
                >
                    {kot.station}
                </div>
            </div>

            <hr />

            {/* Items */}

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                }}
            >
                {kot.items.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <span
                            style={{
                                fontSize: 17,
                                color: T.ink,
                            }}
                        >
                            {item.name}
                        </span>

                        <strong
                            style={{
                                fontSize: 18,
                            }}
                        >
                            × {item.qty}
                        </strong>
                    </div>
                ))}
            </div>

            <button
                onClick={() => onBump(kot.id)}
                style={{
                    marginTop: 10,
                    width: "100%",
                    padding: "14px",
                    border: "none",
                    borderRadius: 12,
                    cursor: "pointer",
                    background: T.primary,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 16,
                }}
            >
                ✓ BUMP ORDER
            </button>
        </Card>
    );
}