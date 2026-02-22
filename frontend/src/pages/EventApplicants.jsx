import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

const statusColors = {
  Pending: 'bg-amber-100 text-amber-800',
  Accepted: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

export default function EventApplicants() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    api.get('/ngo/opportunities').then((res) => {
      const opp = res.data.find((o) => o._id === eventId);
      setEvent(opp);
      if (opp) setApplicants(opp.applicants || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [eventId]);

  const updateStatus = async (applicantId, status) => {
    setUpdating(applicantId);
    try {
      await api.put(`/opportunities/${eventId}/applicants/${applicantId}/status`, { status });
      setApplicants((prev) =>
        prev.map((a) => (a._id === applicantId ? { ...a, status } : a))
      );
    } catch {
      // keep UI as is
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div>
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div>
        <p className="text-slate-500">Event not found.</p>
        <button type="button" onClick={() => navigate('/ngo/events')} className="btn-secondary mt-2">
          Back to events
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate('/ngo/events')}
        className="text-sm text-slate-600 hover:text-slate-800 mb-4"
      >
        ← Back to events
      </button>
      <h1 className="text-2xl font-display font-bold text-slate-800">{event.title}</h1>
      <p className="text-slate-600 mt-1">Applicants for this event</p>
      <div className="mt-6 space-y-4">
        {applicants.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">No applications yet.</div>
        ) : (
          applicants.map((app) => (
            <div key={app._id} className="card p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium text-slate-800">
                  {app.volunteerId?.name || 'Volunteer'}
                </p>
                <p className="text-sm text-slate-500">{app.volunteerId?.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[app.status] || 'bg-slate-100'}`}>
                  {app.status}
                </span>
                {app.status === 'Pending' && (
                  <>
                    <button
                      type="button"
                      onClick={() => updateStatus(app._id, 'Accepted')}
                      className="btn-primary text-sm"
                      disabled={updating === app._id}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(app._id, 'Rejected')}
                      className="btn-secondary text-sm"
                      disabled={updating === app._id}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
