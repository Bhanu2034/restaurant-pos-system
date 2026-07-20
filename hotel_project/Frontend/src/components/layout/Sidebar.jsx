import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutGrid, UtensilsCrossed, ClipboardList, ChefHat,
  Receipt, Package, Bike, Bell, LogOut
} from 'lucide-react';
import { T, FONT_MONO, FONT_DISPLAY, FONT_BODY } from '../../constants/theme';
import { ROUTES } from '../../constants/constants';
import useSidebarCounts from '../../hooks/useSidebarCounts';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  {
    path: ROUTES.DASHBOARD,
    label: 'Dashboard',
    permission: 'dashboard',
    icon: LayoutGrid,
    countKey: null,
  },
  {
    path: ROUTES.TABLES,
    label: 'Tables & Captain Order',
    permission: 'tables',
    icon: ClipboardList,
    countKey: 'occupied',
  },
  {
    path: ROUTES.TAKEAWAY,
    label: 'Takeaway (Prepaid)',
    permission: 'takeaway',
    icon: Bike,
    countKey: 'takeaway',
  },
  {
    path: ROUTES.KITCHEN,
    label: 'Kitchen Display',
    permission: 'kitchen',
    icon: ChefHat,
    countKey: 'activeKots',
  },
  {
    path: ROUTES.BILLING,
    label: 'Billing / POS',
    permission: 'billing',
    icon: Receipt,
    countKey: 'billing',
  },
  {
    path: ROUTES.INVENTORY,
    label: 'Inventory',
    permission: 'inventory',
    icon: Package,
    countKey: 'lowStock',
  },
  {
    path: ROUTES.MENU,
    label: 'Digital Menu',
    permission: 'menu',
    icon: UtensilsCrossed,
    countKey: null,
  },
];

/**
 * Sidebar navigation — uses React Router for page transitions.
 */
export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const counts = useSidebarCounts();
  const {
    logout,
    hasPermission,
    user,
  } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div
      className="flex flex-col sidebar-container"
      style={{
        width: 236,
        background: T.primaryDeep,
        minHeight: '100vh',
        flexShrink: 0,
        color: '#fff',
      }}
    >
      {/* Brand header */}
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center justify-between">
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 10,
              letterSpacing: 2,
              color: T.gold,
              fontWeight: 700,
            }}
          >
            THALI &amp; CO.
          </div>
          {!!counts.unreadAlerts && (
            <div
              className="flex items-center gap-1"
              style={{ color: T.gold, fontSize: 11, fontFamily: FONT_MONO, fontWeight: 700 }}
            >
              <Bell size={13} /> {counts.unreadAlerts}
            </div>
          )}
        </div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 21, fontWeight: 600, marginTop: 2 }}>
          Kitchen Console
        </div>
      </div>

      {/* Navigation items */}
      <div className="flex flex-col gap-1" style={{ padding: 14 }}>
        {NAV_ITEMS
          .filter((item) => hasPermission(item.permission))
          .map((it) => {
            const Icon = it.icon;
            const active = location.pathname === it.path;
            const badge = it.countKey ? counts[it.countKey] : 0;

            return (
              <button
                key={it.path}
                onClick={() => navigate(it.path)}
                className="flex items-center gap-3"
                style={{
                  background: active ? T.primaryLight : 'transparent',
                  border: 'none',
                  borderRadius: 10,
                  padding: '10px 12px',
                  color: active ? '#fff' : 'rgba(255,255,255,0.75)',
                  fontFamily: FONT_BODY,
                  fontSize: 13.5,
                  fontWeight: active ? 600 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <Icon size={17} strokeWidth={2} />
                <span style={{ flex: 1 }}>{it.label}</span>
                {!!badge && (
                  <span
                    style={{
                      background: T.gold,
                      color: T.primaryDeep,
                      fontFamily: FONT_MONO,
                      fontWeight: 700,
                      fontSize: 10.5,
                      borderRadius: 999,
                      minWidth: 18,
                      textAlign: 'center',
                      padding: '1px 5px',
                    }}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 'auto', padding: 14 }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3"
          style={{
            background: 'transparent',
            border: 'none',
            borderRadius: 10,
            padding: '10px 12px',
            color: 'rgba(255,255,255,0.75)',
            fontFamily: FONT_BODY,
            fontSize: 13.5,
            fontWeight: 500,
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
            marginBottom: '10px'
          }}
        >

          <div
            style={{
              padding: '0 12px',
              marginBottom: 12,
              color: 'rgba(255,255,255,0.7)',
              fontSize: 12,
              fontFamily: FONT_BODY,
            }}
          >
            Logged in as
            <br />
            <strong>{user?.role}</strong>
          </div>
          <LogOut size={17} strokeWidth={2} />
          <span style={{ flex: 1 }}>Logout</span>
        </button>
        <div
          style={{
            padding: '0 6px',
            fontSize: 11,
            color: 'rgba(255,255,255,0.4)',
            fontFamily: FONT_MONO,
          }}
        >
          v1.0 &middot; SOUTH INDIAN DINE-IN
        </div>
      </div>
    </div>
  );
}
