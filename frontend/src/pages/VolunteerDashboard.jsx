import { Link } from 'react-router-dom';
import { User, Search, FileText, Clock, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

const STATS = [
  { label: 'Applications Sent',  value: '7',  icon: FileText,    colorClass: 'text-primary-600',  bgClass: 'bg-primary-50' },
  { label: 'Accepted',           value: '3',  icon: CheckCircle, colorClass: 'text-blue-600',     bgClass: 'bg-blue-50' },
  { label: 'Hours Volunteered',  value: '24', icon: Clock,       colorClass: 'text-purple-600',   bgClass: 'bg-purple-50' },
];

const CARDS = [
  {
    to:    '/volunteer/profile',
    icon:  User,
    colorClass: 'text-primary-600',
    bgClass:    'bg-primary-50',
    title: 'My Profile',
    desc:  'Update your skills, interests, and availability so NGOs can find you.',
    cta:   'Edit profile',
  },
  {
    to:    '/volunteer/opportunities',
    icon:  Search,
    colorClass: 'text-blue-600',
    bgClass:    'bg-blue-50',
    title: 'Browse Opportunities',
    desc:  'Discover volunteering events from NGOs and apply in one click.',
    cta:   'Browse now',
  },
  {
    to:    '/volunteer/applications',
    icon:  FileText,
    colorClass: 'text-purple-600',
    bgClass:    'bg-purple-50',
    title: 'My Applications',
    desc:  'Track the status of every application you have submitted.',
    cta:   'View applications',
  },
];

export default function VolunteerDashboard() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-1">
          Welcome back, <span className="text-primary-600">volunteer</span> 👋
        </h1>
        <p className="text-slate-500">Here's a summary of your activity and what you can do next.</p>
      </div>

      {/* Stats */}
      <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-3">Your Activity</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

      {/* tip */}
      <div className="bg-primary-50 border border-primary-200 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0">
          <Sparkles size={17} className="text-white" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-800 mb-1">Get better matches</div>
          <p className="text-sm text-slate-600 leading-relaxed">
            A complete profile helps us find the most relevant opportunities for you.{' '}
            <Link to="/volunteer/profile" className="text-primary-600 font-semibold hover:underline">Complete your profile →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
