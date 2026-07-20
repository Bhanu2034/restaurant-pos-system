export const PERMISSIONS = {

    ADMIN: [
        "dashboard",
        "tables",
        "takeaway",
        "kitchen",
        "billing",
        "inventory",
        "menu",
        "users"
    ],

    CASHIER: [
        "dashboard",
        "takeaway",
        "kitchen",      // As requested
        "billing",
        "inventory"
    ],

    KITCHEN: [
        "dashboard",
        "kitchen",
        "inventory"
    ],

    CAPTAIN: [
        "dashboard",
        "tables",
        "inventory"
    ]

};

export function hasPermission(user, permission) {

    if (!user || !user.role) {
        return false;
    }

    const role = user.role?.toUpperCase();
    const permissions = PERMISSIONS[role];

    if (!permissions) {
        return false;
    }

    return permissions.includes(permission);
}