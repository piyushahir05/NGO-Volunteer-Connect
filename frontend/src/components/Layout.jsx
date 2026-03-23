import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationPanel from './NotificationPanel';
import {
  LayoutDashboard, User, Briefcase, FileText,
  Building2, CalendarDays, Bell, Menu, X, LogOut,
  ChevronRight
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

  // Determine current page title for the header
  const currentPage = nav.find(item => item.to === location.pathname) || { label: 'Overview' };

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
    <div className="min-h-screen bg-[#F9F6F0] flex font-sans selection:bg-emerald-200 selection:text-emerald-900 relative overflow-hidden">
      
      {/* ── Sidebar (Premium Glassmorphism) ── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-white/70 to-emerald-50/40 backdrop-blur-2xl border-r border-white/60 transform transition-transform duration-300 ease-in-out lg:transform-none shadow-[4px_0_24px_rgba(5,150,105,0.03)] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          
          {/* Brand Header */}
          <div className="p-6 border-b border-white/50 relative">
            {/* Subtle glow behind logo */}
            <div className="absolute top-1/2 left-8 -translate-y-1/2 w-12 h-12 bg-emerald-400/20 blur-xl rounded-full pointer-events-none" />
            
            <Link to={user?.role === 'NGO' ? '/ngo' : '/volunteer'} className="flex items-center gap-3 group relative z-10">
              <img 
                src="/logo.png" 
                alt="VolunteerConnect Logo" 
                className="w-10 h-10 object-contain drop-shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 ease-out" 
              />
              <span className="text-xl font-display font-extrabold text-slate-800 tracking-tight">
                Volunteer<span className="text-emerald-600">Connect</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <p className="px-3 text-[10px] font-bold text-emerald-700/50 uppercase tracking-widest mb-3 mt-2">Main Menu</p>
            {nav.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 group ${
                    active
                      ? 'bg-white/80 border border-white shadow-sm text-emerald-700 font-bold backdrop-blur-md'
                      : 'text-slate-500 hover:bg-white/40 hover:text-slate-800 font-medium hover:border-white/40 border border-transparent'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-colors duration-300 ${active ? 'bg-emerald-100/50 text-emerald-600' : 'text-slate-400 group-hover:text-emerald-500 group-hover:bg-white/60'}`}>
                    <item.icon size={18} strokeWidth={active ? 2.5 : 2} />
                  </div>
                  {item.label}
                  {active && <ChevronRight size={16} className="ml-auto text-emerald-600 opacity-60" />}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer (Logout) */}
          <div className="p-4 border-t border-white/50 bg-white/20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-rose-50/80 hover:text-rose-600 hover:border-rose-100 border border-transparent transition-all duration-300 group backdrop-blur-sm"
            >
              <div className="p-1.5 rounded-lg group-hover:bg-rose-100/50 transition-colors">
                <LogOut size={18} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
              </div>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Layout Wrapper ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10">
        
        {/* ── Top Navigation Header ── */}
        <header className="sticky top-0 z-30 bg-white/40 backdrop-blur-2xl border-b border-white/60 px-4 lg:px-8 py-4 flex items-center justify-between shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all">
          
          {/* Left: Mobile Toggle & Page Title */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Toggle menu"
              className="lg:hidden p-2.5 rounded-xl bg-white/60 border border-white/80 text-slate-500 shadow-sm hover:text-emerald-600 hover:border-emerald-200 transition-all backdrop-blur-md"
              onClick={() => setSidebarOpen((o) => !o)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                {user?.role} Portal
              </p>
              <h1 className="font-display text-2xl font-extrabold text-slate-800 tracking-tight leading-none drop-shadow-sm">
                {currentPage.label}
              </h1>
            </div>
          </div>

          {/* Right: User Profile & Notifications */}
          <div className="flex items-center gap-4">
            
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                aria-label="Notifications"
                className="p-2.5 rounded-xl bg-white/60 backdrop-blur-md border border-white/80 shadow-sm hover:border-emerald-200 hover:bg-white hover:text-emerald-600 transition-all relative group"
                onClick={() => setNotifOpen((o) => !o)}
              >
                <Bell className="w-5 h-5 text-slate-500 group-hover:text-emerald-600 transition-colors" />
                {unreadCount > 0 && (
                  <>
                    <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-bold shadow-md shadow-emerald-500/40 border-2 border-white z-10">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                    <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
                  </>
                )}
              </button>
              
              {/* Notification Dropdown Panel */}
              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white/90 backdrop-blur-2xl border border-white shadow-[0_12px_48px_rgba(0,0,0,0.08)] rounded-2xl overflow-hidden z-50">
                  <NotificationPanel onClose={() => setNotifOpen(false)} />
                </div>
              )}
            </div>

            <div className="w-px h-8 bg-slate-200/60 hidden sm:block"></div>

            {/* Premium User Profile Widget */}
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md pl-1 pr-4 py-1 rounded-full border border-white/80 shadow-sm cursor-default hover:bg-white/80 transition-colors">
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 p-[2px] shadow-sm flex-shrink-0">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center relative overflow-hidden">
                  <span className="text-emerald-700 font-extrabold text-sm">{initials}</span>
                </div>
              </div>
              <div className="hidden md:flex flex-col">
                <p className="text-sm font-extrabold text-slate-800 leading-none mb-1">{user?.name}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* ── Main Content Area ── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto relative z-10">
          {children}
        </main>
      </div>

      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}
    </div>
  );
}