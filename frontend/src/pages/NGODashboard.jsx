import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import {
  Building2,
  CalendarDays,
  Users,
  ArrowRight,
  Plus,
  ClipboardList,
  MessageSquare,
  BarChart3,
  ChevronRight,
  Briefcase,
  Loader2,
} from 'lucide-react';

const ACCENT_MAP = {
  emerald: { bg: 'bg-emerald-900/40', text: 'text-emerald-400', badge: 'text-emerald-400' },
  blue:    { bg: 'bg-blue-900/40',    text: 'text-blue-400',    badge: 'text-blue-400' },
  amber:   { bg: 'bg-amber-900/40',   text: 'text-amber-400',   badge: 'text-amber-400' },
};

const BAR_COLORS = [
  'bg-emerald-500',
  'bg-blue-500',
  'bg-amber-500',
  'bg-purple-500',
  'bg-teal-500',
  'bg-rose-500',
  'bg-indigo-500',
  'bg-cyan-500',
];

const QUICK_ACTIONS = [
  { label: 'Create Event',        icon: Plus,           to: '/ngo/events',   desc: 'Launch a new volunteering opportunity' },
  { label: 'Review Applications', icon: ClipboardList,  to: '/ngo/events',   desc: 'Screen and approve pending requests' },
  { label: 'Message Volunteers',  icon: MessageSquare,  to: '/ngo/events',   desc: 'Coordinate with your active team' },
];

/* ── component ───────────────────────────────────────────────── */

export default function NGODashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        { label: 'Active Events', value: String(stats.activeEvents), icon: CalendarDays, accent: 'emerald' },
        { label: 'Total Volunteers', value: String(stats.totalVolunteers), icon: Users, accent: 'blue' },
        { label: 'Pending Applications', value: String(stats.pendingApplications), icon: ClipboardList, accent: 'amber' },
      ]
    : [], [stats]);

  const events = stats?.events || [];
  const maxApplicants = useMemo(() => Math.max(1, ...events.map((e) => e.totalApplicants)), [events]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1">
            Dashboard
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            Organization Command Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time overview of your impact, team, and operations.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/ngo/profile"
            className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors no-underline"
          >
            <Building2 size={15} /> Organization Profile
          </Link>
          <Link
            to="/ngo/events"
            className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-600 transition-colors no-underline"
          >
            <Plus size={15} /> New Event
          </Link>
        </div>
      </div>

      {/* ── Loading / Error ─────────────────────────────────── */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="animate-spin text-slate-400" />
          <span className="ml-3 text-sm text-slate-500">Loading dashboard…</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {stats && (
        <>
          {/* ── KPI Row ─────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpiCards.map((k) => {
              const a = ACCENT_MAP[k.accent];
              return (
                <div
                  key={k.label}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-5 flex items-center gap-4 hover:border-slate-600 transition-colors"
                >
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${a.bg}`}>
                    <k.icon size={20} className={a.text} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-2xl font-bold text-white leading-none">{k.value}</div>
                    <div className="text-xs text-slate-400 mt-1">{k.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Applicants per Event Bar Chart ──────────────────── */}
          {events.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-5">
                <BarChart3 size={18} className="text-slate-500" />
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Applicants per Event
                </h2>
              </div>
              <div className="space-y-3">
                {events.map((ev, idx) => (
                  <div key={ev._id} className="flex items-center gap-3">
                    <span className="w-36 text-xs font-medium text-slate-500 text-right truncate" title={ev.title}>
                      {ev.title}
                    </span>
                    <div className="flex-1 h-6 bg-slate-100 rounded overflow-hidden">
                      <div
                        className={`h-full ${BAR_COLORS[idx % BAR_COLORS.length]} rounded transition-all duration-500`}
                        style={{ width: `${(ev.totalApplicants / maxApplicants) * 100}%` }}
                      />
                    </div>
                    <span className="w-8 text-xs font-semibold text-slate-700 text-right">{ev.totalApplicants}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Event Performance ───────────────────────────────── */}
          {events.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-5">
                <Briefcase size={18} className="text-slate-500" />
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Event Acceptance Rate
                </h2>
              </div>
              <div className="space-y-4">
                {events.map((ev, idx) => (
                  <div key={ev._id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-700 font-medium truncate" title={ev.title}>{ev.title}</span>
                      <span className="text-xs font-bold text-slate-500 ml-2 flex-shrink-0">
                        {ev.fillRate}% ({ev.accepted}/{ev.totalApplicants})
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${BAR_COLORS[idx % BAR_COLORS.length]} transition-all duration-500`}
                        style={{ width: `${ev.fillRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {events.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
              <CalendarDays size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">No events created yet. Create your first event to see stats here.</p>
            </div>
          )}
        </>
      )}

      {/* ── Quick Actions ───────────────────────────────────── */}
      <div>
        <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-3">
          Quick Actions
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map((qa) => (
            <Link
              key={qa.label}
              to={qa.to}
              className="group bg-white border border-slate-200 rounded-lg p-5 flex items-start gap-4 no-underline hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-800 flex items-center justify-center flex-shrink-0">
                <qa.icon size={18} className="text-emerald-300" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-800 flex items-center gap-1">
                  {qa.label}
                  <ChevronRight
                    size={14}
                    className="text-slate-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{qa.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Footer Nav Cards ────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/ngo/profile"
          className="group bg-slate-800 border border-slate-700 rounded-lg p-6 flex items-center gap-4 no-underline hover:border-emerald-600 transition-colors"
        >
          <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
            <Building2 size={22} className="text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-base font-bold text-white">Organization Profile</div>
            <p className="text-xs text-slate-400 mt-0.5">
              Update credentials, description, and public details.
            </p>
          </div>
          <ArrowRight
            size={18}
            className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all flex-shrink-0"
          />
        </Link>

        <Link
          to="/ngo/events"
          className="group bg-slate-800 border border-slate-700 rounded-lg p-6 flex items-center gap-4 no-underline hover:border-emerald-600 transition-colors"
        >
          <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
            <CalendarDays size={22} className="text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-base font-bold text-white">Manage Events</div>
            <p className="text-xs text-slate-400 mt-0.5">
              Create, edit, and track all volunteering opportunities.
            </p>
          </div>
          <ArrowRight
            size={18}
            className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0"
          />
        </Link>
      </div>
    </div>
  );
}
