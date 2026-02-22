import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';

function OpportunityCard({ opp, onApply, applied }) {
  const [applying, setApplying] = useState(false);
  const [err, setErr] = useState('');

  const handleApply = async () => {
    setApplying(true);
    setErr('');
    try {
      await api.post(`/opportunities/${opp._id}/apply`);
      onApply(opp._id);
    } catch (e) {
      setErr(e.message || 'Apply failed');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="card p-5 hover:shadow-md transition">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
              {opp.ngoName || 'NGO'}
            </span>
            {/* Optional for future ML: match percentage badge */}
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded" title="Match score (ML coming soon)">
              Match —
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mt-2">{opp.title}</h3>
        </div>
        {opp.requiredSkills?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {opp.requiredSkills.slice(0, 3).map((s) => (
              <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
      {opp.description && (
        <p className="text-sm text-slate-600 mt-2 line-clamp-2">{opp.description}</p>
      )}
      <div className="flex flex-wrap gap-3 mt-3 text-sm text-slate-500">
        {opp.location && <span>📍 {opp.location}</span>}
        {opp.duration && <span>⏱ {opp.duration}</span>}
      </div>
      <div className="mt-4">
        {applied ? (
          <span className="text-sm text-slate-500">You applied</span>
        ) : (
          <>
            <button
              type="button"
              onClick={handleApply}
              className="btn-primary text-sm"
              disabled={applying}
            >
              {applying ? 'Applying...' : 'Apply'}
            </button>
            {err && <p className="text-sm text-red-600 mt-1">{err}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-800">Opportunities</h1>
        <p className="text-slate-600 mt-1">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-slate-800">Opportunities</h1>
      <p className="text-slate-600 mt-1">Browse and apply to volunteering events.</p>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {opportunities.length === 0 ? (
          <p className="text-slate-500 col-span-full">No opportunities posted yet.</p>
        ) : (
          opportunities.map((opp) => (
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
