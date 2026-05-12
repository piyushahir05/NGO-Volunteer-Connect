import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import {
  Building2, CalendarDays, Users, ArrowRight, Plus,
  ClipboardList, MessageSquare, BarChart3, ChevronRight,
  Loader2, Sparkles, TrendingUp, Brain, MapPin, Clock,
  ChevronDown, Star, Zap, X, Send, CheckCircle2,
} from 'lucide-react';

// ─── Animation variants ───────────────────────────────────────────────────────
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

// ─── Constants ────────────────────────────────────────────────────────────────
const BAR_COLORS = [
  'bg-primary-500', 'bg-emerald-500', 'bg-teal-500',
  'bg-primary-400', 'bg-emerald-400', 'bg-teal-400',
  'bg-primary-600', 'bg-emerald-600',
];

const QUICK_ACTIONS = [
  { label: 'Create Event',          icon: Plus,          to: '/ngo/events',   desc: 'Launch a new volunteering opportunity' },
  { label: 'Review Applications',   icon: ClipboardList, to: '/ngo/events',   desc: 'Screen and approve pending requests' },
  { label: 'Message Volunteers',    icon: MessageSquare, to: '/ngo/messages', desc: 'Coordinate with your active team' },
];

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

// ─── Helpers ──────────────────────────────────────────────────────────────────
function scoreInfo(score) {
  if (score >= 0.70) return { label: 'Strong',  ring: 'ring-emerald-400', bar: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50'  };
  if (score >= 0.40) return { label: 'Partial', ring: 'ring-amber-400',   bar: 'bg-amber-400',   text: 'text-amber-700',  bg: 'bg-amber-50'   };
  return               { label: 'Low',     ring: 'ring-red-300',    bar: 'bg-red-400',     text: 'text-red-700',    bg: 'bg-red-50'     };
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function FloatingOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-200/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-200/20 rounded-full blur-[100px]" />
    </div>
  );
}

function SkillChip({ children, highlight }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[0.68rem] font-semibold mr-1 mb-1
      ${highlight
        ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300'
        : 'bg-slate-100 text-slate-500'}`}>
      {children}
    </span>
  );
}

// ─── Invite Button ────────────────────────────────────────────────────────────
// Manages its own per-volunteer invite state so the rest of the card is unaffected
function InviteButton({ vol, selectedEvent }) {
  // 'idle' | 'loading' | 'sent' | 'duplicate' | 'error'
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleInvite() {
    if (!selectedEvent) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      await api.post('/notifications/invite', {
        volunteerId: vol.volunteerId,   // the volunteer's User _id (returned by the ML endpoint)
        opportunityId: selectedEvent._id,
        opportunityTitle: selectedEvent.title,
      });
      setStatus('sent');
    } catch (err) {
      if (err.message?.toLowerCase().includes('already')) {
        setStatus('duplicate');
      } else {
        setStatus('error');
        setErrorMsg(err.message || 'Failed to send invite');
      }
    }
  }

  if (status === 'sent') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-[0.72rem] font-bold">
        <CheckCircle2 size={13} /> Invited
      </span>
    );
  }

  if (status === 'duplicate') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-[0.72rem] font-bold">
        <CheckCircle2 size={13} /> Already invited
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleInvite}
        disabled={status === 'loading' || !selectedEvent}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[0.72rem] font-bold transition-all
          ${status === 'loading' || !selectedEvent
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-indigo-300'
          }`}
      >
        {status === 'loading'
          ? <><Loader2 size={12} className="animate-spin" /> Sending…</>
          : <><Send size={12} /> Invite</>
        }
      </button>
      {status === 'error' && (
        <span className="text-[0.65rem] text-red-500 font-medium">{errorMsg}</span>
      )}
    </div>
  );
}

// ─── ML Recommendations Panel ─────────────────────────────────────────────────
function MLRecommendationsPanel({ events }) {
  const [selectedEventId, setSelectedEventId] = useState('');
  const [volunteers, setVolunteers]           = useState([]);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState('');
  const [fetched, setFetched]                 = useState(false);
  const [dropdownOpen, setDropdownOpen]       = useState(false);

  const selectedEvent = useMemo(
    () => events.find((e) => e._id === selectedEventId),
    [events, selectedEventId]
  );

  async function fetchRecommendations() {
    if (!selectedEventId) return;
    setLoading(true);
    setError('');
    setVolunteers([]);
    try {
      const { data } = await api.get(`/opportunities/${selectedEventId}/recommended-volunteers`);
      setVolunteers(data);
      setFetched(true);
    } catch (err) {
      setError(err.message || 'Failed to fetch recommendations.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={fadeUp}
      className="bg-white rounded-[2rem] border border-[#E8E3D9] shadow-sm overflow-hidden"
    >
      {/* ── Panel header ── */}
      <div className="px-7 pt-7 pb-5 border-b border-[#F0EBE3]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200 flex-shrink-0">
              <Brain size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                ML Volunteer Finder
                <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[0.65rem] font-bold tracking-wide uppercase">
                  AI-Powered
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                TF-IDF cosine similarity · ranked by skill match
              </p>
            </div>
          </div>
        </div>

        {/* ── Event selector + trigger ── */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          {/* Custom dropdown */}
          <div className="relative flex-1">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border border-[#E8E3D9] bg-[#F9F6F0] text-sm font-medium text-slate-700 hover:border-violet-300 hover:bg-violet-50/40 transition-all"
            >
              <span className={selectedEvent ? 'text-slate-800' : 'text-slate-400'}>
                {selectedEvent ? selectedEvent.title : 'Select an event…'}
              </span>
              <ChevronDown size={15} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#E8E3D9] rounded-2xl shadow-xl shadow-slate-200/60 z-30 overflow-hidden"
                >
                  {events.length === 0 ? (
                    <p className="px-4 py-3 text-xs text-slate-400">No events found.</p>
                  ) : (
                    events.map((ev) => (
                      <button
                        key={ev._id}
                        onClick={() => { setSelectedEventId(ev._id); setDropdownOpen(false); setFetched(false); setVolunteers([]); }}
                        className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-violet-50 transition-colors border-b border-[#F0EBE3] last:border-0
                          ${selectedEventId === ev._id ? 'text-violet-700 bg-violet-50/60' : 'text-slate-700'}`}
                      >
                        <span className="block truncate">{ev.title}</span>
                        {ev.requiredSkills?.length > 0 && (
                          <span className="text-[0.68rem] text-slate-400 font-normal">
                            {ev.requiredSkills.slice(0, 3).join(' · ')}
                            {ev.requiredSkills.length > 3 && ` +${ev.requiredSkills.length - 3}`}
                          </span>
                        )}
                      </button>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={fetchRecommendations}
            disabled={!selectedEventId || loading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all
              ${!selectedEventId || loading
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-300'}`}
          >
            {loading
              ? <><Loader2 size={15} className="animate-spin" /> Analyzing…</>
              : <><Zap size={15} /> {fetched ? 'Re-run' : 'Find Volunteers'}</>}
          </button>
        </div>

        {/* Required skills preview */}
        {selectedEvent?.requiredSkills?.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1">
            <span className="text-[0.7rem] text-slate-400 font-semibold mr-1">Matching:</span>
            {selectedEvent.requiredSkills.map((s) => (
              <span key={s} className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[0.68rem] font-semibold ring-1 ring-indigo-200">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Results body ── */}
      <div className="px-7 py-5">

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium mb-4">
            <X size={16} className="flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state — pre-fetch */}
        {!loading && !fetched && !error && (
          <div className="py-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-3">
              <Brain size={24} className="text-indigo-400" />
            </div>
            <p className="text-sm font-semibold text-slate-500">Select an event and run the ML engine</p>
            <p className="text-xs text-slate-400 mt-1">to see your best-matched volunteers.</p>
          </div>
        )}

        {/* Empty state — post-fetch, no results */}
        {!loading && fetched && volunteers.length === 0 && !error && (
          <div className="py-10 text-center">
            <p className="text-sm font-semibold text-slate-500">No volunteers with matching skills found.</p>
            <p className="text-xs text-slate-400 mt-1">Try an event with different required skills.</p>
          </div>
        )}

        {/* ── Volunteer cards ── */}
        {!loading && volunteers.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-3"
          >
            {/* Results summary */}
            <motion.div variants={fadeUp} className="flex items-center gap-2 mb-1">
              <Star size={13} className="text-violet-500" />
              <span className="text-xs font-bold text-slate-500">
                {volunteers.length} volunteer{volunteers.length !== 1 ? 's' : ''} ranked by match score
              </span>
            </motion.div>

            {volunteers.map((vol, i) => {
              const si = scoreInfo(vol.matchScore);
              const pct = Math.round(vol.matchScore * 100);
              const reqSet = new Set((selectedEvent?.requiredSkills || []).map((s) => s.toLowerCase()));

              return (
                <motion.div
                  key={vol.profileId}
                  variants={fadeIn}
                  className={`relative rounded-2xl border p-4 hover:shadow-md transition-all duration-200 overflow-hidden
                    ${i === 0 ? 'border-emerald-200 bg-emerald-50/30' : 'border-[#E8E3D9] bg-white'}`}
                >
                  {/* Top-ranked badge */}
                  {i === 0 && (
                    <div className="absolute top-2 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[0.65rem] font-bold">
                      <Star size={10} fill="currentColor" /> Best Match
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Rank avatar */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold ring-2 ${si.ring}
                      ${i === 0 ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {i + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Name + score badge */}
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-900">{vol.name}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[0.68rem] font-bold ${si.bg} ${si.text}`}>
                          {pct}% · {si.label}
                        </span>
                      </div>

                      {/* Email / location / availability */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[0.72rem] text-slate-400 font-medium mb-2">
                        <span>{vol.email}</span>
                        {vol.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={10} /> {vol.location}
                          </span>
                        )}
                        {vol.availability && (
                          <span className="flex items-center gap-1">
                            <Clock size={10} /> {vol.availability}
                          </span>
                        )}
                      </div>

                      {/* Score bar */}
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2.5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                          className={`h-full rounded-full ${si.bar}`}
                        />
                      </div>

                      {/* Skills with overlap highlighting */}
                      <div className="flex flex-wrap">
                        {vol.skills.map((s) => (
                          <SkillChip key={s} highlight={reqSet.has(s.toLowerCase())}>
                            {s}
                          </SkillChip>
                        ))}
                      </div>

                      {/* Bio */}
                      {vol.bio && (
                        <p className="mt-2 text-[0.75rem] text-slate-500 leading-relaxed line-clamp-2">
                          {vol.bio}
                        </p>
                      )}
                    </div>

                    {/* ── INVITE BUTTON (new) ── */}
                    <div className="flex-shrink-0 self-center">
                      <InviteButton vol={vol} selectedEvent={selectedEvent} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function NGODashboard() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

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
        { label: 'Active Events',        value: String(stats.activeEvents),        icon: CalendarDays, accent: 'emerald' },
        { label: 'Total Volunteers',      value: String(stats.totalVolunteers),     icon: Users,        accent: 'blue'    },
        { label: 'Pending Applications',  value: String(stats.pendingApplications), icon: ClipboardList, accent: 'amber' },
      ]
    : [], [stats]);

  const events       = stats?.events || [];
  const maxApplicants = useMemo(() => Math.max(1, ...events.map((e) => e.totalApplicants)), [events]);

  return (
    <div className="min-h-screen bg-[#F9F6F0] font-sans text-slate-800 antialiased selection:bg-primary-200 selection:text-primary-900 relative">

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-primary-600 origin-left z-[100]"
        style={{ scaleX }}
      />

      <FloatingOrbs />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-24 space-y-10">

        {/* ── Page Title + Action Buttons ── */}
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

          <motion.div variants={fadeUp} className="flex items-center gap-3 flex-shrink-0">
            <Link
              to="/ngo/messages"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-emerald-200 text-emerald-700 font-bold rounded-xl shadow-sm hover:bg-emerald-50 transition"
            >
              <MessageSquare size={18} /> Messages
            </Link>
            <Link
              to="/ngo/events"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
            >
              <Plus size={18} /> Add Event
            </Link>
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

            {/* ── ML Recommendations Panel (now with Invite buttons) ── */}
            <MLRecommendationsPanel events={events} />

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
                      <ChevronRight size={14} className="text-slate-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
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