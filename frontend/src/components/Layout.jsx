import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationPanel from './NotificationPanel';
import {
  LayoutDashboard, User, Briefcase, FileText,
  Building2, CalendarDays, Bell, Menu, X, LogOut
} from 'lucide-react';

const volunteerNav = [
  { to: '/volunteer',               label: 'Dashboard',        icon: LayoutDashboard },
  { to: '/volunteer/profile',       label: 'My Profile',       icon: User },
  { to: '/volunteer/opportunities', label: 'Opportunities',    icon: Briefcase },
  { to: '/volunteer/applications',  label: 'My Applications',  icon: FileText },
];

const ngoNav = [
  { to: '/ngo',         label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/ngo/profile', label: 'Organization', icon: Building2 },
  { to: '/ngo/events',  label: 'My Events',    icon: CalendarDays },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const nav = user?.role === 'Volunteer' ? volunteerNav : ngoNav;
  const initials = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close sidebar/notifications on Escape key
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header with avatar */}
          <div className="p-4 border-b border-slate-200">
            <Link to={user?.role === 'NGO' ? '/ngo' : '/volunteer'} className="flex items-center gap-2 mb-3">
              <span className="text-xl font-display font-bold text-primary-600">NGO Match</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.role}</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-3 space-y-0.5">
            {nav.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition border-l-[3px] ${
                    active
                      ? 'bg-primary-50 text-primary-700 border-primary-600'
                      : 'text-slate-600 hover:bg-slate-100 border-transparent'
                  }`}
                >
                  <item.icon size={16} className={active ? 'text-primary-600' : 'text-slate-400'} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 border-l-[3px] border-transparent"
            >
              <LogOut size={16} className="text-slate-400" />
              Sign out
            </button>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 lg:px-6 py-3 flex items-center justify-between">
          <button
            type="button"
            aria-label="Toggle menu"
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            onClick={() => setSidebarOpen((o) => !o)}
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <p className="text-slate-600 truncate">
            {user?.name} <span className="text-slate-400">·</span> {user?.role}
          </p>
          <div className="relative">
            <button
              type="button"
              aria-label="Notifications"
              className="p-2 rounded-lg hover:bg-slate-100 relative"
              onClick={() => setNotifOpen((o) => !o)}
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-medium">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <NotificationPanel onClose={() => setNotifOpen(false)} />
            )}
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}
    </div>
  );
}
