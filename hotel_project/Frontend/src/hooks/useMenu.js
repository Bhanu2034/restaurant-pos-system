import { useCallback, useEffect, useMemo, useState } from "react";
import menuService from "../services/menuService";

export default function useMenu() {

    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadMenu = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            const data = await menuService.getAll();

            setMenuItems(Array.isArray(data) ? data : []);

        } catch (err) {

            console.error(err);

            setError("Unable to load menu.");

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {

        loadMenu();

    }, [loadMenu]);

    const categories = useMemo(() => {

        const values = menuItems.map(item => item.category);

        return [...new Set(values)].sort();

    }, [menuItems]);

    const createMenuItem = async (menuItem) => {

        await menuService.create(menuItem);

        await loadMenu();

    };

    const updateMenuItem = async (id, menuItem) => {

        await menuService.update(id, menuItem);

        await loadMenu();

    };

    const deleteMenuItem = async (id) => {

        await menuService.delete(id);

        await loadMenu();

    };

    return {

        menuItems,

        categories,

        loading,

        error,

        reload: loadMenu,

        createMenuItem,

        updateMenuItem,

        deleteMenuItem

    };

}