import { Link } from 'react-router-dom';
import {
  Heart, Clock, Calendar, Award, Star, TrendingUp, CheckCircle,
  ArrowRight, Sparkles, Users, Target, Flame, MapPin, Trophy,
  Zap, BookOpen, ThumbsUp, Gift, User, Search, FileText, Briefcase,
} from 'lucide-react';

/* ───────────────── static data ───────────────── */

const IMPACT_STATS = [
  { label: 'Hours Volunteered', value: '48',  icon: Clock,       accent: 'emerald' },
  { label: 'Events Attended',   value: '12',  icon: Calendar,    accent: 'blue' },
  { label: 'Causes Supported',  value: '5',   icon: Heart,       accent: 'rose' },
  { label: 'Lives Impacted',    value: '124', icon: Users,       accent: 'amber' },
];

const APPLICATION_STATS = [
  { label: 'Sent',     value: 7, color: 'bg-slate-400' },
  { label: 'Accepted', value: 3, color: 'bg-emerald-500' },
  { label: 'Pending',  value: 2, color: 'bg-amber-400' },
  { label: 'Declined', value: 2, color: 'bg-rose-400' },
];

const BADGES = [
  { name: 'First Step',     icon: Zap,      desc: 'Completed first event',      earned: true },
  { name: 'Team Player',    icon: Users,     desc: 'Joined 3 group events',      earned: true },
  { name: 'Early Bird',     icon: Sparkles,  desc: 'Signed up within 24 hours',  earned: true },
  { name: 'Mentor',         icon: BookOpen,  desc: 'Helped onboard a newcomer',  earned: false },
  { name: 'Globe Trotter',  icon: MapPin,    desc: 'Volunteered in 3 cities',    earned: false },
  { name: 'Century Club',   icon: Trophy,    desc: 'Logged 100+ hours',          earned: false },
];

const UPCOMING = [
  { date: 'Jun 28', title: 'Beach Cleanup Drive',        org: 'Ocean Care NGO',     icon: Heart,     accent: 'teal' },
  { date: 'Jul 05', title: 'Community Teaching Session',  org: 'Teach for Tomorrow', icon: BookOpen,  accent: 'blue' },
  { date: 'Jul 12', title: 'Food Distribution Camp',      org: 'Meals of Hope',      icon: Gift,      accent: 'amber' },
];

const QUICK_ACTIONS = [
  {
    to: '/volunteer/profile',
    icon: User,
    accent: 'emerald',
    title: 'My Profile',
    desc: 'Keep your skills and availability up to date.',
    cta: 'Edit profile',
  },
  {
    to: '/volunteer/opportunities',
    icon: Search,
    accent: 'blue',
    title: 'Find Opportunities',
    desc: 'Discover causes that match your passion.',
    cta: 'Browse now',
  },
  {
    to: '/volunteer/applications',
    icon: FileText,
    accent: 'purple',
    title: 'My Applications',
    desc: 'Track every application in one place.',
    cta: 'View all',
  },
];

/* ───── color helper maps (Tailwind safe-list friendly) ───── */

const ACCENT_MAP = {
  emerald: { bg: 'bg-emerald-50',  text: 'text-emerald-600', ring: 'ring-emerald-200', fill: 'bg-emerald-500', light: 'bg-emerald-100' },
  blue:    { bg: 'bg-blue-50',     text: 'text-blue-600',    ring: 'ring-blue-200',    fill: 'bg-blue-500',    light: 'bg-blue-100' },
  rose:    { bg: 'bg-rose-50',     text: 'text-rose-500',    ring: 'ring-rose-200',    fill: 'bg-rose-500',    light: 'bg-rose-100' },
  amber:   { bg: 'bg-amber-50',    text: 'text-amber-600',   ring: 'ring-amber-200',   fill: 'bg-amber-500',   light: 'bg-amber-100' },
  teal:    { bg: 'bg-teal-50',     text: 'text-teal-600',    ring: 'ring-teal-200',    fill: 'bg-teal-500',    light: 'bg-teal-100' },
  purple:  { bg: 'bg-purple-50',   text: 'text-purple-600',  ring: 'ring-purple-200',  fill: 'bg-purple-500',  light: 'bg-purple-100' },
};

/* ───── tiny reusable pieces ───── */

function ProgressBar({ percent, color = 'bg-emerald-500' }) {
  return (
    <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${percent}%` }} />
    </div>
  );
}

function SectionLabel({ children }) {
  return <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-3">{children}</p>;
}

/* ───────────────── main component ───────────────── */

export default function VolunteerDashboard() {
  const level = 4;
  const xp = 480;
  const xpNext = 600;
  const streak = 5;
  const totalApps = APPLICATION_STATS.reduce((s, a) => s + a.value, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* ── Hero greeting ── */}
      <div className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 border border-emerald-100 rounded-3xl p-6 md:p-8 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-100/40 rounded-full blur-2xl" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
              Welcome back, <span className="text-emerald-600">Alex</span> 👋
            </h1>
            <p className="text-slate-500 mt-1 max-w-lg">
              You've impacted <span className="font-semibold text-emerald-600">124 lives</span> so far 💚 — keep the momentum going!
            </p>

            {/* Streak badge */}
            <div className="mt-3 inline-flex items-center gap-2 bg-white/70 backdrop-blur rounded-full px-3.5 py-1.5 text-sm font-medium text-amber-700 border border-amber-200">
              <Flame size={15} className="text-amber-500" />
              {streak}-day volunteering streak 🔥
            </div>
          </div>

          {/* Level ring */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1">
            <div className="relative w-20 h-20 rounded-full bg-white border-4 border-emerald-400 flex items-center justify-center shadow-md">
              <span className="text-2xl font-extrabold text-emerald-600">{level}</span>
              <Star size={14} className="absolute -top-1 -right-1 text-amber-400 fill-amber-400" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Level {level}</span>
          </div>
        </div>

        {/* XP bar */}
        <div className="relative mt-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <TrendingUp size={13} /> {xp} / {xpNext} XP to Level {level + 1}
            </span>
            <span className="text-xs text-slate-400">{Math.round((xp / xpNext) * 100)}%</span>
          </div>
          <ProgressBar percent={(xp / xpNext) * 100} color="bg-emerald-500" />
        </div>
      </div>

      {/* ── Impact stats ── */}
      <section>
        <SectionLabel>✨ Your Impact</SectionLabel>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {IMPACT_STATS.map((s) => {
            const a = ACCENT_MAP[s.accent];
            return (
              <div key={s.label} className={`${a.bg} border border-transparent rounded-2xl p-5 flex flex-col items-start gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}>
                <div className={`w-11 h-11 rounded-xl ${a.light} flex items-center justify-center`}>
                  <s.icon size={20} className={a.text} />
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-slate-800 leading-none">{s.value}</div>
                  <div className="text-xs text-slate-500 mt-1 font-medium">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Two-column: Applications & Achievements ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Applications breakdown */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Briefcase size={17} className="text-slate-400" /> Applications
            </h2>
            <Link to="/volunteer/applications" className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {APPLICATION_STATS.map((a) => (
              <div key={a.label} className="flex items-center gap-3">
                <span className="w-16 text-xs font-medium text-slate-500">{a.label}</span>
                <div className="flex-1">
                  <ProgressBar percent={totalApps ? (a.value / totalApps) * 100 : 0} color={a.color} />
                </div>
                <span className="text-sm font-bold text-slate-700 w-6 text-right">{a.value}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
            <CheckCircle size={12} className="text-emerald-500" /> 3 of 7 applications accepted — great ratio!
          </p>
        </section>

        {/* Badges / Achievements */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Award size={17} className="text-amber-500" /> Achievements
            </h2>
            <span className="text-xs font-semibold text-slate-400">
              {BADGES.filter((b) => b.earned).length}/{BADGES.length} unlocked
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {BADGES.map((b) => (
              <div
                key={b.name}
                className={`relative flex flex-col items-center text-center p-3 rounded-xl transition-all ${
                  b.earned
                    ? 'bg-amber-50 border border-amber-200'
                    : 'bg-slate-50 border border-slate-100 opacity-50 grayscale'
                }`}
              >
                {b.earned && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                    <CheckCircle size={10} className="text-white" />
                  </span>
                )}
                <b.icon size={22} className={b.earned ? 'text-amber-500' : 'text-slate-400'} />
                <span className="text-[11px] font-bold text-slate-700 mt-1.5 leading-tight">{b.name}</span>
                <span className="text-[10px] text-slate-400 leading-tight mt-0.5">{b.desc}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Upcoming commitments ── */}
      <section>
        <SectionLabel>📅 Upcoming Commitments</SectionLabel>
        <div className="space-y-3">
          {UPCOMING.map((ev) => {
            const a = ACCENT_MAP[ev.accent];
            return (
              <div key={ev.title} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl ${a.bg} flex items-center justify-center flex-shrink-0`}>
                  <ev.icon size={20} className={a.text} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-800 truncate">{ev.title}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={11} /> {ev.org}
                  </div>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="text-xs font-bold text-slate-600">{ev.date}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-0.5">
                    <CheckCircle size={10} /> Confirmed
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Quick actions ── */}
      <section>
        <SectionLabel>🚀 Quick Actions</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map((c) => {
            const a = ACCENT_MAP[c.accent];
            return (
              <Link
                key={c.to}
                to={c.to}
                className="group bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-3 no-underline hover:border-emerald-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-xl ${a.bg} flex items-center justify-center`}>
                  <c.icon size={22} className={a.text} />
                </div>
                <div>
                  <div className="text-base font-bold text-slate-800 mb-0.5">{c.title}</div>
                  <p className="text-sm text-slate-500 leading-relaxed">{c.desc}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 mt-auto group-hover:gap-2 transition-all">
                  {c.cta} <ArrowRight size={13} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Motivational footer ── */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-100 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center flex-shrink-0 shadow">
          <ThumbsUp size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-slate-800 mb-0.5">Keep going — you're making a difference!</div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Help onboard a newcomer to unlock the <strong>Mentor</strong> badge.{' '}
            <Link to="/volunteer/opportunities" className="text-emerald-600 font-semibold hover:underline">Find your next event →</Link>
          </p>
        </div>
        <Target size={28} className="text-teal-300 hidden sm:block flex-shrink-0" />
      </div>
    </div>
  );
}
