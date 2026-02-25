import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import {
  Heart, ArrowLeft, Plus, X, CalendarDays, MapPin,
  Clock, Tag, FileText, Users, AlertCircle, ChevronRight, Inbox
} from 'lucide-react';

function useFonts() {
  useEffect(() => {
    if (document.getElementById('vm-gf')) return;
    const l = document.createElement('link');
    l.id = 'vm-gf';
    l.rel = 'stylesheet';
    l.href =
      'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap';
    document.head.appendChild(l);
  }, []);
}

function SkeletonRow() {
  return (
    <div className="event-card" style={{ pointerEvents: 'none' }}>
      <div className="sk-line sk-long" />
      <div className="sk-line sk-short" style={{ marginTop: 10 }} />
    </div>
  );
}

export default function NGOEvents() {
  useFonts();

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
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #f9fafb;
          font-family: 'Lora', Georgia, serif;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
          color: #111827;
        }

        /* ── Nav ── */
        .nav {
          background: #fff; border-bottom: 1px solid #e5e7eb;
          padding: 14px 32px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 50;
        }
        .nav-logo { display: flex; align-items: center; gap: 9px; text-decoration: none; }
        .nav-logo-icon {
          width: 32px; height: 32px; border-radius: 8px; background: #16a34a;
          display: flex; align-items: center; justify-content: center;
        }
        .nav-logo-text { font-size: 16px; font-weight: 700; color: #111827; letter-spacing: -0.01em; }
        .nav-logo-text span { color: #16a34a; }
        .nav-back {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13.5px; font-weight: 600; color: #6b7280; text-decoration: none;
          transition: color 0.15s;
        }
        .nav-back:hover { color: #16a34a; }

        /* ── Page ── */
        .page { max-width: 900px; margin: 0 auto; padding: 40px 24px 64px; }

        /* ── Page header ── */
        .page-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          flex-wrap: wrap; gap: 16px; margin-bottom: 32px;
        }
        .page-title { font-size: clamp(1.6rem, 3vw, 2rem); color: #111827; letter-spacing: -0.02em; margin-bottom: 5px; }
        .page-sub   { font-size: 15px; color: #6b7280; line-height: 1.6; }

        /* ── Buttons ── */
        .btn-new {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 11px 22px; border-radius: 9px;
          background: #16a34a; color: #fff;
          font-family: 'Lora', Georgia, serif;
          font-size: 14px; font-weight: 600;
          border: none; cursor: pointer;
          transition: background 0.18s;
          flex-shrink: 0;
        }
        .btn-new:hover { background: #15803d; }
        .btn-new.cancel {
          background: transparent; color: #6b7280;
          border: 1.5px solid #e5e7eb;
        }
        .btn-new.cancel:hover { background: #f9fafb; color: #111827; border-color: #d1d5db; }

        .btn-create {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 12px 26px; border-radius: 9px;
          background: #16a34a; color: #fff;
          font-family: 'Lora', Georgia, serif;
          font-size: 15px; font-weight: 600;
          border: none; cursor: pointer;
          transition: background 0.18s;
        }
        .btn-create:hover:not(:disabled) { background: #15803d; }
        .btn-create:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── Create form card ── */
        .form-card {
          background: #fff; border: 1.5px solid #e5e7eb; border-radius: 16px;
          padding: 28px; margin-bottom: 28px;
        }
        .form-card-title {
          font-size: 16px; font-weight: 700; color: #111827;
          margin-bottom: 22px; letter-spacing: -0.01em;
          padding-bottom: 14px; border-bottom: 1px solid #f3f4f6;
        }

        .form-group { margin-bottom: 18px; }
        .form-label {
          display: flex; align-items: center; gap: 7px;
          font-size: 13.5px; font-weight: 600; color: #374151; margin-bottom: 8px;
        }
        .form-label-icon {
          width: 22px; height: 22px; border-radius: 6px; background: #f0fdf4;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .form-hint { font-size: 12px; color: #9ca3af; margin-top: 5px; }

        .form-input, .form-textarea {
          width: 100%; padding: 11px 14px;
          border: 1.5px solid #e5e7eb; border-radius: 9px;
          font-family: 'Lora', Georgia, serif;
          font-size: 14.5px; color: #111827; background: #fff;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .form-input::placeholder, .form-textarea::placeholder { color: #c4c4c4; }
        .form-input:focus, .form-textarea:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
        }
        .form-textarea { resize: vertical; min-height: 100px; line-height: 1.7; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 560px) { .form-row { grid-template-columns: 1fr; } }

        /* Skill tags preview */
        .skill-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
        .skill-tag {
          padding: 3px 10px; border-radius: 100px;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          color: #15803d; font-size: 12px; font-weight: 500;
        }

        /* Error */
        .form-error {
          display: flex; align-items: flex-start; gap: 9px;
          padding: 11px 14px; border-radius: 9px; margin-bottom: 18px;
          background: #fef2f2; border: 1px solid #fecaca;
          color: #b91c1c; font-size: 13.5px; line-height: 1.55;
        }

        .form-footer {
          display: flex; align-items: center; gap: 12px;
          padding-top: 6px;
        }

        /* ── Events list ── */
        .section-label {
          font-size: 11.5px; font-weight: 700; color: #9ca3af;
          letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 14px;
        }

        .events-list { display: flex; flex-direction: column; gap: 12px; }

        .event-card {
          background: #fff; border: 1.5px solid #e5e7eb; border-radius: 14px;
          padding: 22px 24px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; flex-wrap: wrap;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .event-card:hover { border-color: #bbf7d0; box-shadow: 0 4px 20px rgba(22,163,74,0.07); }

        .event-info { flex: 1; min-width: 0; }
        .event-title { font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 8px; }

        .event-meta { display: flex; flex-wrap: wrap; gap: 14px; }
        .event-meta-item {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12.5px; color: #9ca3af;
        }

        .event-skills { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
        .event-skill {
          padding: 3px 9px; border-radius: 100px;
          background: #f9fafb; border: 1px solid #e5e7eb;
          color: #6b7280; font-size: 11.5px; font-weight: 500;
        }

        .applicants-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 11px; border-radius: 100px;
          background: #eff6ff; border: 1px solid #bfdbfe;
          color: #1d4ed8; font-size: 12px; font-weight: 600;
          white-space: nowrap;
        }

        .btn-view {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 9px 18px; border-radius: 9px;
          background: #f0fdf4; color: #15803d;
          border: 1.5px solid #bbf7d0;
          font-family: 'Lora', Georgia, serif;
          font-size: 13.5px; font-weight: 600;
          text-decoration: none;
          transition: background 0.18s, border-color 0.18s;
          white-space: nowrap;
        }
        .btn-view:hover { background: #dcfce7; border-color: #86efac; }

        /* ── Skeleton ── */
        .sk-line {
          height: 13px; border-radius: 6px;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        .sk-short { width: 35%; }
        .sk-long  { width: 70%; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* ── Empty state ── */
        .empty-state {
          background: #fff; border: 1.5px dashed #e5e7eb; border-radius: 14px;
          padding: 56px 24px; text-align: center;
        }
        .empty-icon {
          width: 56px; height: 56px; border-radius: 14px;
          background: #f0fdf4; border: 1.5px solid #bbf7d0;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
        }
        .empty-title { font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 6px; }
        .empty-sub   { font-size: 14px; color: #9ca3af; }
      `}</style>

      {/* Nav */}
      <nav className="nav">
        <Link to="/" className="nav-logo">
          <div className="nav-logo-icon">
            <Heart size={15} color="#fff" fill="#fff" />
          </div>
          <span className="nav-logo-text">VolunteerMatch <span>AI</span></span>
        </Link>
        <Link to="/ngo" className="nav-back">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </nav>

      <div className="page">

        {/* Page header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">My Events</h1>
            <p className="page-sub">Post and manage your volunteering opportunities.</p>
          </div>
          <button
            type="button"
            className={`btn-new ${showForm ? 'cancel' : ''}`}
            onClick={() => { setShowForm((v) => !v); if (showForm) resetForm(); }}
          >
            {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> New Event</>}
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="form-card">
            <div className="form-card-title">Create New Event</div>
            <form onSubmit={handleCreate}>

              {error && (
                <div className="form-error">
                  <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                  {error}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">
                  <span className="form-label-icon"><CalendarDays size={13} color="#16a34a" /></span>
                  Event Title <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Weekend Teaching Drive"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="form-label-icon"><FileText size={13} color="#16a34a" /></span>
                  Description
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="Describe what volunteers will do, what to expect, and the impact they'll make…"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="form-label-icon"><Tag size={13} color="#16a34a" /></span>
                  Required Skills
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Teaching, First Aid, Cooking"
                  value={form.requiredSkills}
                  onChange={(e) => setForm((f) => ({ ...f, requiredSkills: e.target.value }))}
                />
                <p className="form-hint">Separate each skill with a comma.</p>
                {skillTags.length > 0 && (
                  <div className="skill-tags">
                    {skillTags.map((s) => <span key={s} className="skill-tag">{s}</span>)}
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">
                    <span className="form-label-icon"><Clock size={13} color="#16a34a" /></span>
                    Duration
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 2 hours, Full day"
                    value={form.duration}
                    onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">
                    <span className="form-label-icon"><MapPin size={13} color="#16a34a" /></span>
                    Location
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="City or venue"
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-footer" style={{ marginTop: 22 }}>
                <button type="submit" className="btn-create" disabled={saving}>
                  <CalendarDays size={15} />
                  {saving ? 'Creating…' : 'Create Event'}
                </button>
                <button
                  type="button"
                  className="btn-new cancel"
                  onClick={() => { setShowForm(false); resetForm(); }}
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Events list */}
        <p className="section-label">
          {loading ? 'Loading…' : `${events.length} ${events.length === 1 ? 'event' : 'events'}`}
        </p>

        <div className="events-list">
          {loading ? (
            [...Array(3)].map((_, i) => <SkeletonRow key={i} />)
          ) : events.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Inbox size={26} color="#16a34a" />
              </div>
              <div className="empty-title">No events yet</div>
              <p className="empty-sub">Click "New Event" above to post your first volunteering opportunity.</p>
            </div>
          ) : (
            events.map((ev) => (
              <div key={ev._id} className="event-card">
                <div className="event-info">
                  <div className="event-title">{ev.title}</div>
                  <div className="event-meta">
                    {ev.location && (
                      <span className="event-meta-item"><MapPin size={12} />{ev.location}</span>
                    )}
                    {ev.duration && (
                      <span className="event-meta-item"><Clock size={12} />{ev.duration}</span>
                    )}
                  </div>
                  {ev.requiredSkills?.length > 0 && (
                    <div className="event-skills">
                      {ev.requiredSkills.slice(0, 4).map((s) => (
                        <span key={s} className="event-skill">{s}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span className="applicants-badge">
                    <Users size={11} />
                    {ev.applicants?.length || 0} applicant{ev.applicants?.length !== 1 ? 's' : ''}
                  </span>
                  <Link to={`/ngo/events/${ev._id}/applicants`} className="btn-view">
                    View <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  );
}