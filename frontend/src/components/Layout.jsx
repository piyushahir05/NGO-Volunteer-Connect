import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationPanel from './NotificationPanel';
import {
  LayoutDashboard, User, Briefcase, FileText,
  Building2, CalendarDays, Bell, Menu, X, LogOut,
  ChevronRight,
} from 'lucide-react';

const volunteerNav = [
  { to: '/volunteer',               label: 'Dashboard',       icon: LayoutDashboard },
  { to: '/volunteer/profile',       label: 'My Profile',      icon: User },
  { to: '/volunteer/opportunities', label: 'Opportunities',   icon: Briefcase },
  { to: '/volunteer/applications',  label: 'My Applications', icon: FileText },
];

const ngoNav = [
  { to: '/ngo',         label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/ngo/profile', label: 'Organization', icon: Building2 },
  { to: '/ngo/events',  label: 'My Events',   icon: CalendarDays },
];

// Sidebar animation variants
const sidebarVariants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit:   { x: '-100%', opacity: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
};

const overlayVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
};

const navItemVariants = {
  hidden:  { opacity: 0, x: -16 },
  visible: (i) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Layout({ children }) {
  const { user, logout }        = useAuth();
  const { unreadCount }         = useNotifications();
  const navigate                = useNavigate();
  const location                = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);

  const nav      = user?.role === 'Volunteer' ? volunteerNav : ngoNav;
  const initials = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  const handleLogout = () => { logout(); navigate('/login'); };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') { setSidebarOpen(false); setNotifOpen(false); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* Brand + User */}
      <div className="px-5 pt-6 pb-5 border-b border-[#E8E3D9] bg-white">
        <Link
          to={user?.role === 'NGO' ? '/ngo' : '/volunteer'}
          className="flex items-center gap-2.5 no-underline mb-5 group"
        >
          <img
            src="/logo.png"
            alt="VolunteerConnect"
            className="w-8 h-8 object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <span className="font-display text-base font-bold text-slate-900 tracking-tight">
            VolunteerConnect
          </span>
        </Link>

        {/* Avatar card */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#E8E3D9] shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate leading-tight">{user?.name}</p>
            <p className="text-xs text-slate-400 font-semibold truncate mt-0.5">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase px-3 mb-2">
          Navigation
        </p>
        {nav.map((item, i) => {
          const active = location.pathname === item.to;
          return (
            <motion.div
              key={item.to}
              custom={i}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
            >
              <Link
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                  active
                    ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/20'
                    : 'text-slate-600 hover:bg-[#F9F6F0] hover:text-slate-900 hover:border hover:border-[#E8E3D9]'
                }`}
              >
                <item.icon
                  size={16}
                  className={active ? 'text-white' : 'text-slate-400 group-hover:text-primary-600 transition-colors'}
                />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight size={13} className="text-white/60" />}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 pb-5 border-t border-[#E8E3D9] pt-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
        >
          <LogOut size={16} className="text-slate-400 group-hover:text-red-500 transition-colors" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F6F0] flex font-sans antialiased selection:bg-primary-200 selection:text-primary-900">

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r-2 border-[#E8E3D9] sticky top-0 h-screen overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* ── MOBILE SIDEBAR (animated) ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="overlay"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden
            />
            {/* Drawer */}
            <motion.aside
              key="sidebar"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r-2 border-[#E8E3D9] shadow-2xl lg:hidden overflow-y-auto"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="sticky top-0 z-30 bg-[#F9F6F0]/90 backdrop-blur-md border-b border-[#E8E3D9] px-4 lg:px-6 py-3 flex items-center justify-between"
        >
          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label="Toggle menu"
            className="lg:hidden p-2 rounded-xl hover:bg-white hover:border hover:border-[#E8E3D9] hover:shadow-sm transition-all duration-200"
            onClick={() => setSidebarOpen((o) => !o)}
          >
            <AnimatePresence mode="wait" initial={false}>
              {sidebarOpen
                ? <motion.span key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X    className="w-5 h-5 text-slate-600" /></motion.span>
                : <motion.span key="menu" initial={{ rotate:  90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate:-90, opacity: 0 }} transition={{ duration: 0.2 }}><Menu className="w-5 h-5 text-slate-600" /></motion.span>
              }
            </AnimatePresence>
          </button>

          {/* User pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E8E3D9] shadow-sm">
            <div className="w-6 h-6 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-xs">
              {initials}
            </div>
            <span className="text-sm font-semibold text-slate-700">{user?.name}</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-slate-400">{user?.role}</span>
          </div>

          {/* Notifications */}
          <div className="relative ml-auto lg:ml-0">
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => setNotifOpen((o) => !o)}
              className="relative p-2 rounded-xl hover:bg-white hover:border hover:border-[#E8E3D9] hover:shadow-sm transition-all duration-200"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary-600 text-white text-[10px] flex items-center justify-center font-bold shadow-sm"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
          </div>
        </motion.header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}