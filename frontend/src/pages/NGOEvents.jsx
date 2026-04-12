import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import {
  Plus, X, CalendarDays, MapPin,
  Clock, Tag, FileText, Users, AlertCircle,
  ChevronRight, Inbox, Loader2, Sparkles
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const glassCardClass = "bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_4px_24px_rgba(5,150,105,0.04)] rounded-[1.5rem] overflow-hidden";
const glassInputClass = "w-full bg-white/50 border border-white/80 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/90 transition-all backdrop-blur-sm shadow-inner placeholder:text-slate-400";
const glassLabelClass = "block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5 ml-1";

function SkeletonRow() {
  return (
    <div className="bg-white/30 backdrop-blur-md border border-white/60 rounded-[1.5rem] p-5 flex items-center gap-4 pointer-events-none">
      <div className="flex-1 space-y-2">
        <div className="h-4 rounded-full bg-white/60 animate-pulse w-3/4" />
        <div className="h-3 rounded-full bg-white/60 animate-pulse w-2/5" />
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
    <div className="relative min-h-screen bg-[#F9F6F0] overflow-hidden py-6 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-200 selection:text-emerald-900">

      {/* Ambient blobs */}
      <div className="fixed top-[0%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-emerald-300/20 blur-[100px] pointer-events-none mix-blend-multiply animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-teal-200/25 blur-[120px] pointer-events-none mix-blend-multiply animate-[pulse_10s_ease-in-out_infinite_reverse]" />

      <div className="relative z-10 max-w-3xl mx-auto">

        {loading && events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 h-[50vh]">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
            </div>
            <span className="mt-4 text-xs font-bold tracking-widest text-emerald-600 uppercase">Loading Events...</span>
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">

            {/* ── Page Header ── */}
            <motion.div variants={fadeUp} className={`${glassCardClass} p-6 md:p-8 relative`}>
              <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                <Sparkles size={80} className="text-emerald-600" />
              </div>
              <div className="flex items-start justify-between flex-wrap gap-4 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 border border-white/80 shadow-sm text-emerald-700 text-[10px] font-bold tracking-widest uppercase mb-3 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> NGO Dashboard
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight mb-1">My Events</h1>
                  <p className="text-slate-500 text-sm font-medium">Post and manage your volunteering opportunities.</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setShowForm((v) => !v); if (showForm) resetForm(); }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 mt-1 ${
                    showForm
                      ? 'bg-white/60 border border-white/80 text-slate-600 hover:bg-white/90 backdrop-blur-md'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-500/20'
                  }`}
                >
                  {showForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> New Event</>}
                </button>
              </div>
            </motion.div>

            {/* ── Create Form ── */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  key="form"
                  initial="hidden" animate="visible" exit="exit"
                  variants={fadeUp}
                  className={`${glassCardClass} p-6 sm:p-8`}
                >
                  <div className="flex items-center justify-between mb-8 border-b border-white/60 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100/50 rounded-lg text-emerald-600">
                        <CalendarDays size={20} />
                      </div>
                      <h2 className="text-xl font-bold text-slate-800">Create New Event</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); resetForm(); }}
                      className="p-2 bg-white/40 hover:bg-white/80 border border-white/60 rounded-xl text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleCreate} className="space-y-5">

                    {error && (
                      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50/80 border border-red-200 text-red-700 text-sm leading-relaxed backdrop-blur-sm">
                        <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                        {error}
                      </div>
                    )}

                    {/* Title */}
                    <div>
                      <label className={glassLabelClass}>
                        Event Title <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <CalendarDays size={18} className="absolute left-4 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          className={`${glassInputClass} pl-12`}
                          placeholder="e.g. Weekend Teaching Drive"
                          value={form.title}
                          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className={glassLabelClass}>Description</label>
                      <textarea
                        className={`${glassInputClass} resize-vertical min-h-[100px] leading-relaxed`}
                        placeholder="Describe what volunteers will do, what to expect, and the impact they'll make…"
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      />
                    </div>

                    {/* Required Skills */}
                    <div>
                      <label className={glassLabelClass}>Required Skills</label>
                      <div className="relative">
                        <Tag size={18} className="absolute left-4 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          className={`${glassInputClass} pl-12`}
                          placeholder="e.g. Teaching, First Aid, Cooking"
                          value={form.requiredSkills}
                          onChange={(e) => setForm((f) => ({ ...f, requiredSkills: e.target.value }))}
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-1.5 ml-1">Separate each skill with a comma.</p>
                      {skillTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {skillTags.map((s) => (
                            <span key={s} className="px-3 py-1 bg-emerald-50/70 border border-emerald-200/80 text-emerald-800 rounded-lg text-xs font-bold">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Duration + Location */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={glassLabelClass}>Duration</label>
                        <div className="relative">
                          <Clock size={18} className="absolute left-4 top-2.5 text-slate-400" />
                          <input
                            type="text"
                            className={`${glassInputClass} pl-12`}
                            placeholder="e.g. 2 hours, Full day"
                            value={form.duration}
                            onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <label className={glassLabelClass}>Location</label>
                        <div className="relative">
                          <MapPin size={18} className="absolute left-4 top-2.5 text-slate-400" />
                          <input
                            type="text"
                            className={`${glassInputClass} pl-12`}
                            placeholder="City or venue"
                            value={form.location}
                            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-white/60">
                      <button
                        type="button"
                        onClick={() => { setShowForm(false); resetForm(); }}
                        disabled={saving}
                        className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-white/40 hover:bg-white/80 border border-white/60 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <CalendarDays size={18} />}
                        {saving ? 'Creating…' : 'Create Event'}
                      </button>
                    </div>

                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Events List ── */}
            <motion.div variants={fadeUp}>
              <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-3">
                {loading ? 'Loading…' : `${events.length} ${events.length === 1 ? 'event' : 'events'}`}
              </p>

              <div className="flex flex-col gap-3">
                {loading ? (
                  [...Array(3)].map((_, i) => <SkeletonRow key={i} />)
                ) : events.length === 0 ? (
                  <div className={`${glassCardClass} p-14 text-center`}>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-center mx-auto mb-4">
                      <Inbox size={26} className="text-emerald-600" />
                    </div>
                    <div className="text-base font-bold text-slate-800 mb-1">No events yet</div>
                    <p className="text-sm text-slate-400">Click "New Event" above to post your first volunteering opportunity.</p>
                  </div>
                ) : (
                  events.map((ev) => (
                    <motion.div
                      key={ev._id}
                      variants={fadeUp}
                      className={`${glassCardClass} p-5 flex items-center justify-between gap-4 flex-wrap hover:border-emerald-200/80 hover:shadow-md transition-all duration-300`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-bold text-slate-800 mb-2">{ev.title}</div>
                        <div className="flex flex-wrap gap-3">
                          {ev.location && (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                              <MapPin size={12} className="text-emerald-500" />{ev.location}
                            </span>
                          )}
                          {ev.duration && (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                              <Clock size={12} className="text-emerald-500" />{ev.duration}
                            </span>
                          )}
                        </div>
                        {ev.requiredSkills?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {ev.requiredSkills.slice(0, 4).map((s) => (
                              <span key={s} className="px-2.5 py-0.5 rounded-lg bg-white/60 border border-white/80 text-slate-600 text-xs font-bold backdrop-blur-sm">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5 flex-shrink-0">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/70 border border-blue-200/80 text-blue-700 text-xs font-bold whitespace-nowrap">
                          <Users size={11} />
                          {ev.applicants?.length || 0} applicant{ev.applicants?.length !== 1 ? 's' : ''}
                        </span>
                        <Link
                          to={`/ngo/events/${ev._id}/applicants`}
                          className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 shadow-sm shadow-emerald-500/20 transition-all whitespace-nowrap"
                        >
                          View <ChevronRight size={13} />
                        </Link>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

          </motion.div>
        )}
      </div>
    </div>
  );
}