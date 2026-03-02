import { Link } from 'react-router-dom';
import { Building2, CalendarDays, Users, TrendingUp, ArrowRight } from 'lucide-react';

const STATS = [
  { label: 'Active Events',      value: '4',   icon: CalendarDays, colorClass: 'text-primary-600', bgClass: 'bg-primary-50' },
  { label: 'Total Volunteers',   value: '128',  icon: Users,        colorClass: 'text-blue-600',    bgClass: 'bg-blue-50' },
  { label: 'Applications',       value: '37',   icon: TrendingUp,   colorClass: 'text-purple-600',  bgClass: 'bg-purple-50' },
];

const CARDS = [
  {
    to:         '/ngo/profile',
    icon:       Building2,
    colorClass: 'text-primary-600',
    bgClass:    'bg-primary-50',
    title:      'Organization Profile',
    desc:       'Update your NGO name, description, and contact details.',
    cta:        'Edit profile',
  },
  {
    to:         '/ngo/events',
    icon:       CalendarDays,
    colorClass: 'text-blue-600',
    bgClass:    'bg-blue-50',
    title:      'My Events',
    desc:       'Post new volunteering opportunities and manage existing ones.',
    cta:        'View events',
  },
];

export default function NGODashboard() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-1">
          Welcome back, <span className="text-primary-600">your organization</span> 👋
        </h1>
        <p className="text-slate-500">Here's an overview of your activity and quick actions.</p>
      </div>

      {/* Stats */}
      <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-3">Overview</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bgClass}`}>
              <s.icon size={20} className={s.colorClass} />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800 leading-none">{s.value}</div>
              <div className="text-xs text-slate-400 mt-1 tracking-wide">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Nav cards */}
      <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-3">Quick Actions</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {CARDS.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="group bg-white border border-slate-200 rounded-2xl p-7 flex flex-col gap-3 no-underline hover:border-primary-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.bgClass}`}>
              <c.icon size={22} className={c.colorClass} />
            </div>
            <div>
              <div className="text-base font-bold text-slate-800 mb-1">{c.title}</div>
              <p className="text-sm text-slate-500 leading-relaxed">{c.desc}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 mt-auto group-hover:gap-2 transition-all">
              {c.cta} <ArrowRight size={13} />
            </span>
          </Link>
        ))}
      </div>

      {/* Tip */}
      <div className="bg-primary-50 border border-primary-200 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0">
          <TrendingUp size={17} className="text-white" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-800 mb-1">Boost your visibility</div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Complete your organization profile to appear higher in volunteer search results.{' '}
            <Link to="/ngo/profile" className="text-primary-600 font-semibold hover:underline">Complete profile →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
