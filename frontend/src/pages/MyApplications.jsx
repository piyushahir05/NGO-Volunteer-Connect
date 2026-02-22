import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';

const statusColors = {
  Pending: 'bg-amber-100 text-amber-800',
  Accepted: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/volunteer/applications').then((res) => setApplications(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-800">My Applications</h1>
        <p className="text-slate-600 mt-1">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-slate-800">My Applications</h1>
      <p className="text-slate-600 mt-1">Track the status of your event applications.</p>
      <div className="mt-6 space-y-4">
        {applications.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">No applications yet. Apply to opportunities from the Opportunities page.</div>
        ) : (
          applications.map((app) => (
            <div key={app._id} className="card p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-800">{app.title}</h3>
                <p className="text-sm text-slate-500">{app.ngoName}</p>
                {app.location && <p className="text-sm text-slate-600 mt-1">📍 {app.location}</p>}
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[app.status] || 'bg-slate-100 text-slate-700'}`}>
                {app.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
