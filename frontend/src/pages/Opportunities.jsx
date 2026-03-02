import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import {
  MapPin, Clock, Building2,
  CheckCircle, AlertCircle, Search, Inbox, Send
} from 'lucide-react';

/* ── Single opportunity card ── */
function OpportunityCard({ opp, applied, onApply }) {
  const [applying, setApplying] = useState(false);
  const [err, setErr]           = useState('');

  const handleApply = async () => {
    setApplying(true);
    setErr('');
    try {
      await api.post(`/opportunities/${opp._id}/apply`);
      onApply(opp._id);
    } catch (e) {
      setErr(e.message || 'Apply failed. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-3 hover:border-primary-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Top row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold">
          <Building2 size={11} /> {opp.ngoName || 'NGO'}
        </span>
        {applied && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <CheckCircle size={11} /> Applied
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-slate-800 leading-snug">{opp.title}</h3>

      {/* Description */}
      {opp.description && (
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{opp.description}</p>
      )}

      {/* Skills */}
      {opp.requiredSkills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {opp.requiredSkills.slice(0, 4).map((s) => (
            <span key={s} className="px-2.5 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-xs font-medium">{s}</span>
          ))}
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap gap-3">
        {opp.location && (
          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
            <MapPin size={12} /> {opp.location}
          </span>
        )}
        {opp.duration && (
          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
            <Clock size={12} /> {opp.duration}
          </span>
        )}
      </div>

      {/* Action */}
      <div className="mt-auto pt-1">
        {applied ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600">
            <CheckCircle size={14} /> Application sent
          </span>
        ) : (
          <>
            <button
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              onClick={handleApply}
              disabled={applying}
            >
              <Send size={13} />
              {applying ? 'Applying…' : 'Apply now'}
            </button>
            {err && (
              <p className="flex items-center gap-1 text-xs text-red-600 mt-2">
                <AlertCircle size={12} /> {err}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ── Page skeleton loader ── */
function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-3 pointer-events-none">
      <div className="h-3 rounded-full bg-slate-200 animate-pulse w-2/5" />
      <div className="h-4 rounded-full bg-slate-200 animate-pulse w-4/5 mt-2" />
      <div className="h-3 rounded-full bg-slate-200 animate-pulse w-3/4" />
      <div className="h-3 rounded-full bg-slate-200 animate-pulse w-3/4" />
      <div className="h-3 rounded-full bg-slate-200 animate-pulse w-2/5 mt-2" />
    </div>
  );
}

/* ══════════════════════════════════════ */
export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications]   = useState([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState('');

  useEffect(() => {
    Promise.all([api.get('/opportunities'), api.get('/volunteer/applications')])
      .then(([oppRes, appRes]) => {
        setOpportunities(oppRes.data);
        setApplications(appRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const appliedIds = applications.map((a) => a._id);

  const handleApplied = (id) => {
    setApplications((prev) => [...prev, { _id: id, status: 'Pending' }]);
  };

  const filtered = opportunities.filter((o) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      o.title?.toLowerCase().includes(q) ||
      o.ngoName?.toLowerCase().includes(q) ||
      o.location?.toLowerCase().includes(q) ||
      o.requiredSkills?.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-1">Browse Opportunities</h1>
          <p className="text-slate-500">Find volunteering events that match your skills and interests.</p>
        </div>
        {!loading && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold self-center">
            {filtered.length} {filtered.length === 1 ? 'opportunity' : 'opportunities'}
          </span>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 flex items-center pointer-events-none">
          <Search size={15} />
        </span>
        <input
          className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
          type="text"
          placeholder="Search by title, NGO, location or skill…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
        ) : filtered.length === 0 ? (
          <div className="col-span-full flex flex-col items-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 border border-primary-200 flex items-center justify-center mb-4">
              <Inbox size={28} className="text-primary-600" />
            </div>
            <div className="text-base font-bold text-slate-800 mb-1">
              {search ? 'No results found' : 'No opportunities yet'}
            </div>
            <p className="text-sm text-slate-400">
              {search
                ? 'Try a different search term.'
                : 'Check back soon — NGOs are posting new events regularly.'}
            </p>
          </div>
        ) : (
          filtered.map((opp) => (
            <OpportunityCard
              key={opp._id}
              opp={opp}
              applied={appliedIds.includes(opp._id)}
              onApply={handleApplied}
            />
          ))
        )}
      </div>
    </div>
  );
}
