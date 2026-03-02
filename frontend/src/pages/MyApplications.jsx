import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import {
  MapPin, Clock, Building2,
  CheckCircle, XCircle, Clock3, Inbox, ChevronRight
} from 'lucide-react';

const STATUS = {
  Pending:  { label: 'Pending',  icon: Clock3,       colorClass: 'text-amber-700',  bgClass: 'bg-amber-50',  borderClass: 'border-amber-200' },
  Accepted: { label: 'Accepted', icon: CheckCircle,   colorClass: 'text-primary-700', bgClass: 'bg-primary-50', borderClass: 'border-primary-200' },
  Rejected: { label: 'Rejected', icon: XCircle,       colorClass: 'text-red-700',    bgClass: 'bg-red-50',    borderClass: 'border-red-200' },
};

function StatusBadge({ status }) {
  const s = STATUS[status] || { label: status, icon: Clock3, colorClass: 'text-slate-600', bgClass: 'bg-slate-50', borderClass: 'border-slate-200' };
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-semibold whitespace-nowrap ${s.colorClass} ${s.bgClass} ${s.borderClass}`}>
      <Icon size={12} /> {s.label}
    </span>
  );
}

function SkeletonRow() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4 pointer-events-none">
      <div className="flex-1 space-y-2">
        <div className="h-4 rounded-full bg-slate-200 animate-pulse w-3/4" />
        <div className="h-3 rounded-full bg-slate-200 animate-pulse w-2/5" />
      </div>
      <div className="h-7 w-20 rounded-full bg-slate-200 animate-pulse" />
    </div>
  );
}

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState('All');

  useEffect(() => {
    api.get('/volunteer/applications')
      .then((res) => setApplications(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    All:      applications.length,
    Pending:  applications.filter((a) => a.status === 'Pending').length,
    Accepted: applications.filter((a) => a.status === 'Accepted').length,
    Rejected: applications.filter((a) => a.status === 'Rejected').length,
  };

  const filtered = filter === 'All' ? applications : applications.filter((a) => a.status === filter);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-1">My Applications</h1>
        <p className="text-slate-500">Track the status of every opportunity you've applied for.</p>
      </div>

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Total',    val: counts.All },
            { label: 'Pending',  val: counts.Pending },
            { label: 'Accepted', val: counts.Accepted },
            { label: 'Rejected', val: counts.Rejected },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-slate-800 leading-none">{s.val}</div>
              <div className="text-xs text-slate-400 mt-1 tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      {!loading && applications.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {['All', 'Pending', 'Accepted', 'Rejected'].map((f) => (
            <button
              key={f}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                filter === f
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-primary-200 hover:text-primary-700'
              }`}
              onClick={() => setFilter(f)}
            >
              {f}
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${filter === f ? 'bg-white/25' : 'bg-slate-100 text-slate-400'}`}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* List */}
      <div className="flex flex-col gap-3">
        {loading ? (
          [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
        ) : filtered.length === 0 && applications.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-14 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-200 flex items-center justify-center mx-auto mb-4">
              <Inbox size={26} className="text-primary-600" />
            </div>
            <div className="text-base font-bold text-slate-800 mb-1">No applications yet</div>
            <p className="text-sm text-slate-400 mb-5">Browse open opportunities and apply to ones that match your skills.</p>
            <Link
              to="/volunteer/opportunities"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
            >
              Browse Opportunities <ChevronRight size={14} />
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-14 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-200 flex items-center justify-center mx-auto mb-4">
              <Inbox size={26} className="text-primary-600" />
            </div>
            <div className="text-base font-bold text-slate-800 mb-1">No {filter.toLowerCase()} applications</div>
            <p className="text-sm text-slate-400">Try a different filter above.</p>
          </div>
        ) : (
          filtered.map((app) => (
            <div
              key={app._id}
              className={`bg-white border rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap hover:shadow-sm transition-shadow ${
                app.status === 'Accepted' ? 'border-primary-200' : 'border-slate-200'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className={`text-base font-bold mb-1.5 ${app.status === 'Rejected' ? 'text-slate-500' : 'text-slate-800'}`}>
                  {app.title}
                </div>
                <div className="flex flex-wrap gap-3">
                  {app.ngoName && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                      <Building2 size={12} /> {app.ngoName}
                    </span>
                  )}
                  {app.location && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                      <MapPin size={12} /> {app.location}
                    </span>
                  )}
                  {app.duration && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={12} /> {app.duration}
                    </span>
                  )}
                </div>
              </div>
              <StatusBadge status={app.status} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
