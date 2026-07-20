import React, { useMemo, useState } from "react";
import SectionTitle from "../../components/common/SectionTitle";
import Card from "../../components/common/Card";

import MenuToolbar from "../../components/menu/MenuToolbar";
import MenuTable from "../../components/menu/MenuTable";

import AddMenuDialog from "../../components/menu/AddMenuDialog";
import EditMenuDialog from "../../components/menu/EditMenuDialog";
import DeleteConfirmationDialog from "../../components/menu/DeleteConfirmationDialog";

import useMenu from "../../hooks/useMenu";

export default function MenuPage() {

    const {

        menuItems,

        loading,

        error,

        createMenuItem,

        updateMenuItem,

        deleteMenuItem,

    } = useMenu();

    const [search, setSearch] = useState("");

    const [showAddDialog, setShowAddDialog] = useState(false);

    const [showEditDialog, setShowEditDialog] = useState(false);

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const [selectedItem, setSelectedItem] = useState(null);

    const filteredMenu = useMemo(() => {

        if (!search.trim()) {

            return menuItems;

        }

        const keyword = search.toLowerCase();

        return menuItems.filter(item =>

            item.name.toLowerCase().includes(keyword) ||

            item.category.toLowerCase().includes(keyword) ||

            item.station.toLowerCase().includes(keyword)

        );

    }, [menuItems, search]);

    const openEditDialog = (item) => {

        setSelectedItem(item);

        setShowEditDialog(true);

    };

    const openDeleteDialog = (item) => {

        setSelectedItem(item);

        setShowDeleteDialog(true);

    };

    const handleCreate = async (menuItem) => {

        try {

            await createMenuItem(menuItem);

            setShowAddDialog(false);

        } catch (err) {

            console.error(err);

            alert("Unable to save menu item.");

        }

    };

    const handleUpdate = async (menuItem) => {

        try {

            await updateMenuItem(menuItem.id, menuItem);

            setShowEditDialog(false);

            setSelectedItem(null);

        } catch (err) {

            console.error(err);

            alert("Unable to update menu item.");

        }

    };

    const handleDelete = async (id) => {

        try {

            await deleteMenuItem(id);

            setShowDeleteDialog(false);

            setSelectedItem(null);

        } catch (err) {

            console.error(err);

            alert("Unable to delete menu item.");

        }

    };

    return (

        <div style={{ padding: "36px 44px" }}>

            <SectionTitle

                eyebrow="Administration"

                title="Menu Management"

            />

            <Card style={{ padding: 24 }}>

                <MenuToolbar

                    search={search}

                    onSearchChange={setSearch}

                    onAddClick={() => setShowAddDialog(true)}

                />

                <MenuTable

                    menuItems={filteredMenu}

                    loading={loading}

                    error={error}

                    onEdit={openEditDialog}

                    onDelete={openDeleteDialog}

                />

            </Card>

            <AddMenuDialog

                open={showAddDialog}

                onClose={() => setShowAddDialog(false)}

                onSave={handleCreate}

            />

            <EditMenuDialog

                open={showEditDialog}

                menuItem={selectedItem}

                onClose={() => {

                    setShowEditDialog(false);

                    setSelectedItem(null);

                }}

                onUpdate={handleUpdate}

            />

            <DeleteConfirmationDialog

                open={showDeleteDialog}

                menuItem={selectedItem}

                onClose={() => {

                    setShowDeleteDialog(false);

                    setSelectedItem(null);

                }}

                onDelete={handleDelete}

            />

        </div>

    );

}