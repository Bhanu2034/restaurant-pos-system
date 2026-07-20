import React from "react";

export default function DeleteConfirmationDialog({

    open,

    menuItem,

    onClose,

    onDelete,

}) {

    if (!open || !menuItem) return null;

    return (

        <div className="dialog-overlay">

            <div className="dialog">

                <h2>

                    Delete Menu Item

                </h2>

                <p>

                    Delete

                    <strong>

                        {" "}

                        {menuItem.name}

                    </strong>

                    ?

                </p>

                <div className="dialog-actions">

                    <button onClick={onClose}>

                        Cancel

                    </button>

                    <button

                        style={{

                            background: "#d32f2f",

                            color: "#fff",

                        }}

                        onClick={() => onDelete(menuItem.id)}

                    >

                        Delete

                    </button>

                </div>

            </div>

        </div>

    );

}