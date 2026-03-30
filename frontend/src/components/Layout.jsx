import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationPanel from './NotificationPanel';
import {
  LayoutDashboard, User, Briefcase, FileText,
  Building2, CalendarDays, Bell, Menu, X, LogOut,
  ChevronRight
} from 'lucide-react';

const volunteerNav = [
  { to: '/volunteer', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/volunteer/profile', label: 'My Profile', icon: User },
  { to: '/volunteer/opportunities', label: 'Opportunities', icon: Briefcase },
  { to: '/volunteer/applications', label: 'My Applications', icon: FileText },
];

const ngoNav = [
  { to: '/ngo', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/ngo/profile', label: 'Organization', icon: Building2 },
  { to: '/ngo/events', label: 'My Events', icon: CalendarDays },
];

const sidebarVariants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
};

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const nav = user?.role === 'Volunteer' ? volunteerNav : ngoNav;
  const initials = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  // ✅ Keep HEAD feature (page title)
  const currentPage = nav.find(item => item.to === location.pathname) || { label: 'Overview' };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

  // ✅ Keep second branch improvement
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

    const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* Brand */}
      <div className="p-6 border-b border-white/50 bg-white/60 backdrop-blur-xl">
        <Link to={user?.role === 'NGO' ? '/ngo' : '/volunteer'} className="flex items-center gap-3">
          <img src="/logo.png" className="w-10 h-10" />
          <span className="text-lg font-bold text-slate-800">
            Volunteer<span className="text-emerald-600">Connect</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {nav.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${
                active
                  ? 'bg-emerald-100 text-emerald-700 font-bold'
                  : 'text-slate-500 hover:bg-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
              {active && <ChevronRight size={16} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button onClick={handleLogout} className="flex gap-2 text-red-500">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F9F6F0]">

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed left-0 top-0 w-64 h-full bg-white z-50"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-white border-b">

          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu />
            </button>

            <h1 className="font-bold text-xl">
              {currentPage.label}
            </h1>
          </div>

          <div className="flex items-center gap-4">

            {/* Notifications */}
            <button onClick={() => setNotifOpen(!notifOpen)} className="relative">
              <Bell />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 text-xs bg-green-500 text-white px-1 rounded">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <div className="font-bold">{initials}</div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}