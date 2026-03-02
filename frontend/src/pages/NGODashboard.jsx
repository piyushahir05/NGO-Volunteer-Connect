import { Link } from 'react-router-dom';
import {
  Building2,
  CalendarDays,
  Users,
  TrendingUp,
  ArrowRight,
  Plus,
  ClipboardList,
  MessageSquare,
  BarChart3,
  PieChart,
  Activity,
  Eye,
  UserPlus,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  ArrowUpRight,
  Briefcase,
} from 'lucide-react';

/* ── static data ─────────────────────────────────────────────── */

const KPI = [
  { label: 'Active Events', value: '12', delta: '+3', up: true, icon: CalendarDays, accent: 'emerald' },
  { label: 'Total Volunteers', value: '1,248', delta: '+18%', up: true, icon: Users, accent: 'blue' },
  { label: 'Pending Applications', value: '64', delta: '+9', up: true, icon: ClipboardList, accent: 'amber' },
  { label: 'Avg. Attendance', value: '87%', delta: '+4%', up: true, icon: Activity, accent: 'purple' },
];

const ACCENT_MAP = {
  emerald: { bg: 'bg-emerald-900/40', text: 'text-emerald-400', badge: 'text-emerald-400' },
  blue:    { bg: 'bg-blue-900/40',    text: 'text-blue-400',    badge: 'text-blue-400' },
  amber:   { bg: 'bg-amber-900/40',   text: 'text-amber-400',   badge: 'text-amber-400' },
  purple:  { bg: 'bg-purple-900/40',  text: 'text-purple-400',  badge: 'text-purple-400' },
};

const MONTHLY_VOLUNTEERS = [
  { month: 'Jul', value: 62 },
  { month: 'Aug', value: 75 },
  { month: 'Sep', value: 58 },
  { month: 'Oct', value: 90 },
  { month: 'Nov', value: 110 },
  { month: 'Dec', value: 135 },
];
const MAX_VOL = Math.max(...MONTHLY_VOLUNTEERS.map((m) => m.value));

const EVENT_PERFORMANCE = [
  { name: 'Beach Cleanup Drive', fill: 92, color: 'bg-emerald-500' },
  { name: 'Youth Mentorship',    fill: 78, color: 'bg-blue-500' },
  { name: 'Food Distribution',   fill: 85, color: 'bg-amber-500' },
  { name: 'Tree Plantation',     fill: 64, color: 'bg-purple-500' },
  { name: 'Health Camp',         fill: 71, color: 'bg-teal-500' },
];

const DONUT_SEGMENTS = {
  background: 'conic-gradient(#059669 0% 38%, #3b82f6 38% 62%, #d97706 62% 80%, #8b5cf6 80% 100%)',
};
const DONUT_LEGEND = [
  { label: 'Environment', pct: '38%', color: 'bg-emerald-500' },
  { label: 'Education',   pct: '24%', color: 'bg-blue-500' },
  { label: 'Welfare',     pct: '18%', color: 'bg-amber-500' },
  { label: 'Health',      pct: '20%', color: 'bg-purple-500' },
];

const RECENT_ACTIVITY = [
  { icon: UserPlus,    text: '14 new volunteer sign-ups',         time: '2 h ago',  color: 'text-emerald-400' },
  { icon: CheckCircle, text: '"Beach Cleanup" event completed',   time: '5 h ago',  color: 'text-blue-400' },
  { icon: AlertCircle, text: '3 applications need review',        time: '8 h ago',  color: 'text-amber-400' },
  { icon: Eye,         text: 'Profile viewed 42 times this week', time: '1 d ago',  color: 'text-purple-400' },
];

const QUICK_ACTIONS = [
  { label: 'Create Event',        icon: Plus,           to: '/ngo/events',   desc: 'Launch a new volunteering opportunity' },
  { label: 'Review Applications', icon: ClipboardList,  to: '/ngo/events',   desc: 'Screen and approve pending requests' },
  { label: 'Message Volunteers',  icon: MessageSquare,  to: '/ngo/events',   desc: 'Coordinate with your active team' },
];

/* ── component ───────────────────────────────────────────────── */

export default function NGODashboard() {
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

      {/* ── KPI Row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI.map((k) => {
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
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  {k.label}
                  <span className={`inline-flex items-center gap-0.5 font-semibold ${a.badge}`}>
                    <ArrowUpRight size={11} /> {k.delta}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Charts Row ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Volunteer Growth Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-slate-500" />
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                Volunteer Growth
              </h2>
            </div>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
              <TrendingUp size={13} /> +32% overall
            </span>
          </div>
          <div className="space-y-3">
            {MONTHLY_VOLUNTEERS.map((m) => (
              <div key={m.month} className="flex items-center gap-3">
                <span className="w-8 text-xs font-medium text-slate-500 text-right">{m.month}</span>
                <div className="flex-1 h-6 bg-slate-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded transition-all duration-500"
                    style={{ width: `${(m.value / MAX_VOL) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-xs font-semibold text-slate-700 text-right">{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut – Category Distribution */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col items-center">
          <div className="flex items-center gap-2 self-start mb-5">
            <PieChart size={18} className="text-slate-500" />
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              Event Categories
            </h2>
          </div>
          <div className="relative w-40 h-40 rounded-full mb-5" style={{ background: DONUT_SEGMENTS.background }}>
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-slate-800">12</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs w-full">
            {DONUT_LEGEND.map((d) => (
              <div key={d.label} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${d.color} flex-shrink-0`} />
                <span className="text-slate-600">{d.label}</span>
                <span className="ml-auto font-semibold text-slate-800">{d.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Middle Row: Performance + Activity ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Event Performance */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-5">
            <Briefcase size={18} className="text-slate-500" />
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              Event Performance
            </h2>
          </div>
          <div className="space-y-4">
            {EVENT_PERFORMANCE.map((e) => (
              <div key={e.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-700 font-medium">{e.name}</span>
                  <span className="text-xs font-bold text-slate-500">{e.fill}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${e.color} transition-all duration-500`}
                    style={{ width: `${e.fill}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity size={18} className="text-slate-400" />
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wide">
              Recent Activity
            </h2>
          </div>
          <ul className="space-y-4">
            {RECENT_ACTIVITY.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <a.icon size={15} className={a.color} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-slate-200 leading-snug">{a.text}</p>
                  <span className="text-xs text-slate-500">{a.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

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

      {/* ── Application Trends (mini-sparkline style) ──────── */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-slate-500" />
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              Weekly Application Trend
            </h2>
          </div>
          <span className="text-xs font-semibold text-blue-600 flex items-center gap-0.5">
            <ArrowUpRight size={13} /> 64 this week
          </span>
        </div>
        <div className="flex items-end gap-2 h-24">
          {[28, 42, 35, 55, 48, 64, 58].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-sm bg-blue-500/80 hover:bg-blue-600 transition-colors"
                style={{ height: `${(v / 64) * 100}%` }}
              />
              <span className="text-[10px] text-slate-400 font-medium">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
              </span>
            </div>
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
