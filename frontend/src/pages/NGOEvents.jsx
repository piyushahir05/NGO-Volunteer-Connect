import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

export default function NGOEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    duration: '',
    location: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/ngo/opportunities').then((res) => setEvents(res.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const requiredSkills = form.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
      await api.post('/opportunities', {
        title: form.title,
        description: form.description,
        requiredSkills,
        duration: form.duration,
        location: form.location,
      });
      setForm({ title: '', description: '', requiredSkills: '', duration: '', location: '' });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message || 'Failed to create');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-800">My Events</h1>
          <p className="text-slate-600 mt-1">Post and manage volunteering opportunities.</p>
        </div>
        <button type="button" onClick={() => setShowForm((v) => !v)} className="btn-primary">
          {showForm ? 'Cancel' : '+ New Event'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mt-6 card p-6 max-w-xl space-y-4">
          {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="input-field min-h-[80px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Required skills (comma-separated)</label>
            <input
              type="text"
              value={form.requiredSkills}
              onChange={(e) => setForm((f) => ({ ...f, requiredSkills: e.target.value }))}
              className="input-field"
              placeholder="e.g. Teaching, First Aid"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                className="input-field"
                placeholder="e.g. 2 hours"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                className="input-field"
              />
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      )}

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : events.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">No events yet. Create your first event above.</div>
        ) : (
          events.map((ev) => (
            <div key={ev._id} className="card p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-800">{ev.title}</h3>
                <p className="text-sm text-slate-500">
                  {ev.applicants?.length || 0} applicant(s) · {ev.location || '—'}
                </p>
              </div>
              <Link
                to={`/ngo/events/${ev._id}/applicants`}
                className="btn-secondary text-sm"
              >
                View applicants
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
