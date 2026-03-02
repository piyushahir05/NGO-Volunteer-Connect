import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import {
  Plus, X, CalendarDays, MapPin,
  Clock, Tag, FileText, Users, AlertCircle, ChevronRight, Inbox
} from 'lucide-react';

function SkeletonRow() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 pointer-events-none">
      <div className="flex-1 space-y-2">
        <div className="h-4 rounded-full bg-slate-200 animate-pulse w-3/4" />
        <div className="h-3 rounded-full bg-slate-200 animate-pulse w-2/5" />
      </div>
    </div>
  );
}

export default function NGOEvents() {
  const [events, setEvents]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [form, setForm]         = useState({
    title: '', description: '', requiredSkills: '', duration: '', location: '',
  });

  const load = () => {
    api.get('/ngo/opportunities')
      .then((res) => setEvents(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { setLoading(true); load(); }, []);

  const resetForm = () => {
    setForm({ title: '', description: '', requiredSkills: '', duration: '', location: '' });
    setError('');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const requiredSkills = form.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
      await api.post('/opportunities', {
        title:         form.title,
        description:   form.description,
        requiredSkills,
        duration:      form.duration,
        location:      form.location,
      });
      resetForm();
      setShowForm(false);
      setLoading(true);
      load();
    } catch (err) {
      setError(err.message || 'Failed to create event. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const skillTags = form.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto">

      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-1">My Events</h1>
          <p className="text-slate-500">Post and manage your volunteering opportunities.</p>
        </div>
        <button
          type="button"
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex-shrink-0 ${
            showForm
              ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
          onClick={() => { setShowForm((v) => !v); if (showForm) resetForm(); }}
        >
          {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> New Event</>}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-2xl p-7 mb-6">
          <div className="text-base font-bold text-slate-800 mb-5 pb-3.5 border-b border-slate-100">Create New Event</div>
          <form onSubmit={handleCreate}>

            {error && (
              <div className="flex items-start gap-2 p-3.5 rounded-xl mb-5 bg-red-50 border border-red-200 text-red-700 text-sm leading-relaxed">
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <span className="w-6 h-6 rounded-md bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <CalendarDays size={13} className="text-primary-600" />
                </span>
                Event Title <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                placeholder="e.g. Weekend Teaching Drive"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <span className="w-6 h-6 rounded-md bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <FileText size={13} className="text-primary-600" />
                </span>
                Description
              </label>
              <textarea
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition resize-vertical min-h-[100px] leading-relaxed"
                placeholder="Describe what volunteers will do, what to expect, and the impact they'll make…"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <span className="w-6 h-6 rounded-md bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <Tag size={13} className="text-primary-600" />
                </span>
                Required Skills
              </label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                placeholder="e.g. Teaching, First Aid, Cooking"
                value={form.requiredSkills}
                onChange={(e) => setForm((f) => ({ ...f, requiredSkills: e.target.value }))}
              />
              <p className="text-xs text-slate-400 mt-1.5">Separate each skill with a comma.</p>
              {skillTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {skillTags.map((s) => (
                    <span key={s} className="px-2.5 py-0.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-medium">{s}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <span className="w-6 h-6 rounded-md bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <Clock size={13} className="text-primary-600" />
                  </span>
                  Duration
                </label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                  placeholder="e.g. 2 hours, Full day"
                  value={form.duration}
                  onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <span className="w-6 h-6 rounded-md bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <MapPin size={13} className="text-primary-600" />
                  </span>
                  Location
                </label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                  placeholder="City or venue"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                disabled={saving}
              >
                <CalendarDays size={15} />
                {saving ? 'Creating…' : 'Create Event'}
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                onClick={() => { setShowForm(false); resetForm(); }}
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Events list */}
      <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-3">
        {loading ? 'Loading…' : `${events.length} ${events.length === 1 ? 'event' : 'events'}`}
      </p>

      <div className="flex flex-col gap-3">
        {loading ? (
          [...Array(3)].map((_, i) => <SkeletonRow key={i} />)
        ) : events.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-14 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-200 flex items-center justify-center mx-auto mb-4">
              <Inbox size={26} className="text-primary-600" />
            </div>
            <div className="text-base font-bold text-slate-800 mb-1">No events yet</div>
            <p className="text-sm text-slate-400">Click "New Event" above to post your first volunteering opportunity.</p>
          </div>
        ) : (
          events.map((ev) => (
            <div key={ev._id} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap hover:border-primary-200 hover:shadow-sm transition-all">
              <div className="flex-1 min-w-0">
                <div className="text-base font-bold text-slate-800 mb-2">{ev.title}</div>
                <div className="flex flex-wrap gap-3">
                  {ev.location && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400"><MapPin size={12} />{ev.location}</span>
                  )}
                  {ev.duration && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400"><Clock size={12} />{ev.duration}</span>
                  )}
                </div>
                {ev.requiredSkills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {ev.requiredSkills.slice(0, 4).map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-xs font-medium">{s}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2.5 flex-shrink-0">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold whitespace-nowrap">
                  <Users size={11} />
                  {ev.applicants?.length || 0} applicant{ev.applicants?.length !== 1 ? 's' : ''}
                </span>
                <Link
                  to={`/ngo/events/${ev._id}/applicants`}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-primary-50 border border-primary-200 text-primary-700 text-sm font-semibold hover:bg-primary-100 transition-colors whitespace-nowrap"
                >
                  View <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
