import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationPanel from './NotificationPanel';
import {
  LayoutDashboard, User, Briefcase, FileText,
  Building2, CalendarDays, Bell, Menu, LogOut,
  ChevronRight, MessageSquare 
} from 'lucide-react';

const volunteerNav = [
  { to: '/volunteer', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/volunteer/profile', label: 'My Profile', icon: User },
  { to: '/volunteer/opportunities', label: 'Opportunities', icon: Briefcase },
  { to: '/volunteer/applications', label: 'My Applications', icon: FileText },
  { to: '/volunteer/messages', label: 'Messages', icon: MessageSquare },
];

const ngoNav = [
  { to: '/ngo', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/ngo/profile', label: 'Organization', icon: Building2 },
  { to: '/ngo/events', label: 'My Events', icon: CalendarDays },
  { to: '/ngo/messages', label: 'Messages', icon: MessageSquare },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);

  const nav = user?.role === 'Volunteer' ? volunteerNav : ngoNav;
  
  const isFemale = user?.gender?.toLowerCase() === 'female';
  const profileImgSrc = isFemale ? '/p2.jpg' : '/p1.jpg';

  const currentPage = nav.find(item => item.to === location.pathname) || { label: 'Overview' };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setNotifOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen w-full flex bg-[#F9F6F0] overflow-hidden">

      <aside 
        className={`transition-all duration-300 ease-in-out flex flex-col h-full bg-[#FFFBF0] backdrop-blur-xl border-r border-slate-200 z-40 shrink-0 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className={`p-4 border-b border-slate-200 min-h-[72px] flex items-center transition-all duration-300 ${isSidebarOpen ? 'justify-start px-6' : 'justify-center px-0'}`}>
          <Link to={user?.role === 'NGO' ? '/ngo' : '/volunteer'} className="flex items-center gap-3 overflow-hidden" title="Home">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 shrink-0" />
            {isSidebarOpen && (
              <span className="text-lg font-bold text-slate-800 whitespace-nowrap">
                Volunteer<span className="text-emerald-600">Connect</span>
              </span>
            )}
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {nav.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                title={!isSidebarOpen ? item.label : ''} 
                className={`flex items-center gap-3 py-3 rounded-xl text-sm transition-all duration-200 ${
                  isSidebarOpen ? 'px-4 justify-start' : 'px-0 justify-center'
                } ${
                  active
                    ? 'bg-emerald-100 text-emerald-700 font-bold'
                    : 'text-slate-500 hover:bg-amber-50 hover:text-slate-800'
                }`}
              >
                <item.icon size={22} className="shrink-0" />
                {isSidebarOpen && (
                  <>
                    <span className="whitespace-nowrap">{item.label}</span>
                    {active && <ChevronRight size={16} className="ml-auto shrink-0" />}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-200 shrink-0">
          <button 
            onClick={handleLogout} 
            title={!isSidebarOpen ? "Logout" : ""}
            className={`flex items-center gap-3 w-full py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 ${
              isSidebarOpen ? 'px-4 justify-start' : 'px-0 justify-center'
            }`}
          >
            <LogOut size={22} className="shrink-0" />
            {isSidebarOpen && <span className="font-semibold whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        <header className="flex justify-between items-center p-4 min-h-[72px] bg-[#FFFBF0] border-b border-slate-200 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-amber-100 transition-colors"
              aria-label="Toggle Sidebar"
            >
              <Menu size={24} />
            </button>
            <h1 className="font-bold text-xl text-slate-800 truncate">
              {currentPage.label}
            </h1>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative">
              <button 
                onClick={() => setNotifOpen(!notifOpen)} 
                className="relative p-2 text-slate-600 hover:bg-amber-100 rounded-full transition-colors"
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full border-2 border-[#FFFBF0]">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 z-50">
                  <NotificationPanel onClose={() => setNotifOpen(false)} />
                </div>
              )}
            </div>

            <Link 
              to={user?.role === 'NGO' ? '/ngo/profile' : '/volunteer/profile'}
              className="w-10 h-10 rounded-full border-2 border-emerald-500 shadow-sm overflow-hidden cursor-pointer select-none bg-white block transition-transform hover:scale-105"
            >
              <img src={profileImgSrc} alt="User Avatar" className="w-full h-full object-cover" />
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-[#F9F6F0]">
          <div className="max-w-7xl mx-auto w-full pb-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}