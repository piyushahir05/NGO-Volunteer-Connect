import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { api } from '../lib/api';
import {
  Building2, CalendarDays, Users, ArrowRight, Plus,
  ClipboardList, MessageSquare, BarChart3, ChevronRight,
  Briefcase, Loader2, Sparkles, TrendingUp,
} from 'lucide-react';

// --- Animation Variants (same as Home/Login/Register) ---
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeIn = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// --- Bar chart colors aligned to site palette ---
const BAR_COLORS = [
  'bg-primary-500', 'bg-emerald-500', 'bg-teal-500',
  'bg-primary-400', 'bg-emerald-400', 'bg-teal-400',
  'bg-primary-600', 'bg-emerald-600',
];

const QUICK_ACTIONS = [
  { label: 'Create Event',        icon: Plus,          to: '/ngo/events',  desc: 'Launch a new volunteering opportunity' },
  { label: 'Review Applications', icon: ClipboardList, to: '/ngo/events',  desc: 'Screen and approve pending requests' },
  { label: 'Message Volunteers',  icon: MessageSquare, to: '/ngo/events',  desc: 'Coordinate with your active team' },
];

// KPI accent config — warm/light palette matching #F9F6F0 site
const KPI_ACCENTS = {
  emerald: {
    wrap: 'bg-emerald-50 border-emerald-100',
    icon: 'bg-emerald-100 text-emerald-600',
    val:  'text-emerald-700',
    lbl:  'text-emerald-600',
  },
  blue: {
    wrap: 'bg-teal-50 border-teal-100',
    icon: 'bg-teal-100 text-teal-600',
    val:  'text-teal-700',
    lbl:  'text-teal-600',
  },
  amber: {
    wrap: 'bg-primary-50 border-primary-100',
    icon: 'bg-primary-100 text-primary-600',
    val:  'text-primary-700',
    lbl:  'text-primary-600',
  },
};

// --- Ambient background blobs ---
function FloatingOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-200/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-200/20 rounded-full blur-[100px]" />
    </div>
  );
}

export default function NGODashboard() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    let cancelled = false;
    async function fetchStats() {
      try {
        const { data } = await api.get('/ngo/dashboard-stats');
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load dashboard stats');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchStats();
    return () => { cancelled = true; };
  }, []);

  const kpiCards = useMemo(() => stats
    ? [
        { label: 'Active Events',        value: String(stats.activeEvents),        icon: CalendarDays,  accent: 'emerald' },
        { label: 'Total Volunteers',      value: String(stats.totalVolunteers),      icon: Users,         accent: 'blue' },
        { label: 'Pending Applications',  value: String(stats.pendingApplications),  icon: ClipboardList, accent: 'amber' },
      ]
    : [], [stats]);

  const events = stats?.events || [];
  const maxApplicants = useMemo(() => Math.max(1, ...events.map((e) => e.totalApplicants)), [events]);

  return (
    <div className="min-h-screen bg-[#F9F6F0] font-sans text-slate-800 antialiased selection:bg-primary-200 selection:text-primary-900 relative">

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-primary-600 origin-left z-[100]"
        style={{ scaleX }}
      />

      <FloatingOrbs />

      {/* ── HEADER ── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-[#F9F6F0]/80 backdrop-blur-md border-b border-[#E8E3D9]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <img
              src="/logo.png"
              alt="VolunteerConnect"
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <span className="font-display text-lg sm:text-xl text-slate-900 font-bold tracking-tight">
              VolunteerConnect
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/ngo/profile"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E8E3D9] text-slate-700 text-sm font-bold hover:border-primary-300 hover:text-primary-700 hover:shadow-md transition-all duration-300"
            >
              <Building2 size={14} /> Profile
            </Link>
            <Link
              to="/ngo/events"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <Plus size={14} /> New Event
            </Link>
          </div>
        </div>
      </motion.header>

      {/* ── PAGE BODY ── */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 space-y-10">

        {/* ── Page Title ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-[#E8E3D9] shadow-sm text-primary-700 text-xs font-bold tracking-wide backdrop-blur-sm mb-3">
              <Sparkles size={12} className="text-primary-500" />
              Organization Command Center
            </span>
            <h1 className="font-display text-4xl md:text-5xl leading-[1.1] tracking-tight text-slate-900">
              Your <span className="text-primary-600 italic">impact</span> at a glance.
            </h1>
            <p className="text-base text-slate-500 mt-2 font-medium">
              Real-time overview of your events, team, and operations.
            </p>
          </motion.div>
        </motion.div>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={28} className="animate-spin text-primary-400" />
            <span className="ml-3 text-sm text-slate-500 font-medium">Loading dashboard…</span>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium"
          >
            {error}
          </motion.div>
        )}

        {stats && (
          <>
            {/* ── KPI Cards ── */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {kpiCards.map((k) => {
                const a = KPI_ACCENTS[k.accent];
                return (
                  <motion.div
                    key={k.label}
                    variants={fadeUp}
                    className={`relative rounded-2xl border p-6 overflow-hidden group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ${a.wrap}`}
                  >
                    {/* Subtle background glow */}
                    <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/40 blur-2xl pointer-events-none" />
                    <div className="relative z-10 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${a.icon}`}>
                        <k.icon size={22} />
                      </div>
                      <div>
                        <div className={`text-3xl font-bold leading-none font-display ${a.val}`}>
                          {k.value}
                        </div>
                        <div className={`text-xs font-semibold mt-1 uppercase tracking-widest ${a.lbl}`}>
                          {k.label}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* ── Charts Row ── */}
            {events.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={staggerContainer}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Applicants per Event */}
                <motion.div
                  variants={fadeIn}
                  className="bg-white rounded-[2rem] border border-[#E8E3D9] p-7 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
                      <BarChart3 size={16} className="text-primary-600" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-800 tracking-tight">Applicants per Event</h2>
                      <p className="text-xs text-slate-400 font-medium">Total applicants across events</p>
                    </div>
                  </div>
                  <div className="space-y-3.5">
                    {events.map((ev, idx) => (
                      <div key={ev._id} className="flex items-center gap-3">
                        <span className="w-28 text-xs font-semibold text-slate-500 text-right truncate shrink-0" title={ev.title}>
                          {ev.title}
                        </span>
                        <div className="flex-1 h-5 bg-[#F9F6F0] rounded-full overflow-hidden border border-[#E8E3D9]">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(ev.totalApplicants / maxApplicants) * 100}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                            className={`h-full rounded-full ${BAR_COLORS[idx % BAR_COLORS.length]}`}
                          />
                        </div>
                        <span className="w-7 text-xs font-bold text-slate-700 text-right shrink-0">
                          {ev.totalApplicants}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Acceptance Rate */}
                <motion.div
                  variants={fadeIn}
                  className="bg-white rounded-[2rem] border border-[#E8E3D9] p-7 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                      <TrendingUp size={16} className="text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-800 tracking-tight">Event Acceptance Rate</h2>
                      <p className="text-xs text-slate-400 font-medium">Accepted vs total applicants</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {events.map((ev, idx) => (
                      <div key={ev._id}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-slate-700 font-semibold truncate" title={ev.title}>
                            {ev.title}
                          </span>
                          <span className="text-xs font-bold text-slate-400 ml-2 shrink-0">
                            {ev.fillRate}% ({ev.accepted}/{ev.totalApplicants})
                          </span>
                        </div>
                        <div className="h-2 bg-[#F9F6F0] rounded-full overflow-hidden border border-[#E8E3D9]">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${ev.fillRate}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                            className={`h-full rounded-full ${BAR_COLORS[idx % BAR_COLORS.length]}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Empty state */}
            {events.length === 0 && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="bg-white rounded-[2rem] border border-[#E8E3D9] p-12 text-center shadow-sm"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center mx-auto mb-4">
                  <CalendarDays size={28} className="text-primary-400" />
                </div>
                <p className="text-sm font-semibold text-slate-500">No events yet.</p>
                <p className="text-xs text-slate-400 mt-1">Create your first event to see stats here.</p>
                <Link
                  to="/ngo/events"
                  className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition-colors"
                >
                  <Plus size={14} /> Create Event
                </Link>
              </motion.div>
            )}
          </>
        )}

        {/* ── Quick Actions ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Quick Actions</span>
            <div className="flex-1 h-px bg-[#E8E3D9]" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {QUICK_ACTIONS.map((qa) => (
              <motion.div key={qa.label} variants={fadeUp}>
                <Link
                  to={qa.to}
                  className="group bg-white border border-[#E8E3D9] rounded-2xl p-5 flex items-start gap-4 no-underline hover:border-primary-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 block"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600 group-hover:border-primary-600 transition-all duration-300">
                    <qa.icon size={18} className="text-primary-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-800 flex items-center gap-1">
                      {qa.label}
                      <ChevronRight
                        size={14}
                        className="text-slate-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{qa.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Footer Nav Cards ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {[
            {
              to: '/ngo/profile',
              Icon: Building2,
              iconBg: 'bg-primary-600',
              title: 'Organization Profile',
              desc: 'Update credentials, description, and public details.',
              arrowHover: 'group-hover:text-primary-600',
            },
            {
              to: '/ngo/events',
              Icon: CalendarDays,
              iconBg: 'bg-emerald-600',
              title: 'Manage Events',
              desc: 'Create, edit, and track all volunteering opportunities.',
              arrowHover: 'group-hover:text-emerald-600',
            },
          ].map((card) => (
            <motion.div key={card.title} variants={fadeUp}>
              <Link
                to={card.to}
                className="group bg-white border border-[#E8E3D9] rounded-2xl p-6 flex items-center gap-4 no-underline hover:border-primary-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 block"
              >
                <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <card.Icon size={22} className="text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-base font-bold text-slate-900">{card.title}</div>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">{card.desc}</p>
                </div>
                <ArrowRight
                  size={18}
                  className={`text-slate-300 ${card.arrowHover} group-hover:translate-x-1 transition-all duration-300 flex-shrink-0`}
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </main>
    </div>
  );
}