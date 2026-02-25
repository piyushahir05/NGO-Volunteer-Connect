import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import {
  Heart, Building2, FileText, ArrowLeft,
  CheckCircle, AlertCircle, Save, Eye
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

export default function NGOProfile() {
  useFonts();

  const [profile, setProfile] = useState({ organizationName: '', description: '' });
  const [saving, setSaving]   = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    api.get('/ngo/profile').then((res) => setProfile(res.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setIsError(false);
    try {
      await api.put('/ngo/profile', profile);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setMessage(err.message || 'Update failed. Please try again.');
      setIsError(true);
    } finally {
      setSaving(false);
    }
  };

  /* Completeness */
  const filled  = [profile.organizationName, profile.description].filter(Boolean).length;
  const pct     = Math.round((filled / 2) * 100);

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
        .page { max-width: 860px; margin: 0 auto; padding: 40px 24px 64px; }

        .page-header { margin-bottom: 32px; }
        .page-title { font-size: clamp(1.6rem, 3vw, 2rem); color: #111827; letter-spacing: -0.02em; margin-bottom: 6px; }
        .page-sub   { font-size: 15px; color: #6b7280; line-height: 1.6; }

        /* ── Two-column ── */
        .profile-grid {
          display: grid; grid-template-columns: 1fr 300px; gap: 24px; align-items: start;
        }
        @media (max-width: 720px) { .profile-grid { grid-template-columns: 1fr; } }

        /* ── Form card ── */
        .form-card {
          background: #fff; border: 1.5px solid #e5e7eb; border-radius: 16px; padding: 32px;
        }

        .form-group { margin-bottom: 22px; }
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
        .form-textarea { resize: vertical; min-height: 120px; line-height: 1.7; }

        /* Char count */
        .char-count { font-size: 11.5px; color: #9ca3af; text-align: right; margin-top: 4px; }
        .char-count.near { color: #f59e0b; }
        .char-count.over { color: #ef4444; }

        /* Alert */
        .alert {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 12px 14px; border-radius: 10px; margin-bottom: 22px;
          font-size: 13.5px; line-height: 1.55;
        }
        .alert-success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
        .alert-error   { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; }

        /* Submit */
        .btn-save {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px; border-radius: 9px;
          background: #16a34a; color: #fff;
          font-family: 'Lora', Georgia, serif;
          font-size: 15px; font-weight: 600;
          border: none; cursor: pointer;
          transition: background 0.18s;
        }
        .btn-save:hover:not(:disabled) { background: #15803d; }
        .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── Sidebar ── */
        .sidebar { display: flex; flex-direction: column; gap: 16px; }
        .side-card {
          background: #fff; border: 1.5px solid #e5e7eb; border-radius: 14px; padding: 22px;
        }
        .side-card-title {
          font-size: 13px; font-weight: 700; color: #111827; margin-bottom: 14px;
        }

        /* Preview card */
        .preview-ngo-name {
          font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 8px;
          min-height: 22px;
        }
        .preview-desc {
          font-size: 13px; color: #6b7280; line-height: 1.65;
          min-height: 40px;
          display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;
        }
        .preview-empty { font-size: 13px; color: #d1d5db; font-style: italic; }
        .preview-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 100px;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          color: #15803d; font-size: 11.5px; font-weight: 600;
          margin-bottom: 12px;
        }

        /* Completeness */
        .completeness-bar-bg {
          height: 7px; background: #f3f4f6; border-radius: 100px; overflow: hidden; margin: 10px 0;
        }
        .completeness-bar-fill {
          height: 100%; background: #16a34a; border-radius: 100px;
          transition: width 0.35s ease;
        }
        .completeness-label { font-size: 12px; color: #6b7280; }

        /* Tips */
        .tip-list { display: flex; flex-direction: column; gap: 10px; }
        .tip-item { display: flex; align-items: flex-start; gap: 9px; font-size: 13px; color: #4b5563; line-height: 1.6; }
        .tip-dot  { width: 6px; height: 6px; border-radius: 50%; background: #16a34a; flex-shrink: 0; margin-top: 6px; }
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

        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Organization Profile</h1>
          <p className="page-sub">This information is visible to volunteers browsing opportunities.</p>
        </div>

        <div className="profile-grid">

          {/* Form */}
          <div className="form-card">
            <form onSubmit={handleSubmit}>

              {message && (
                <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>
                  {isError
                    ? <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                    : <CheckCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                  }
                  {message}
                </div>
              )}

              {/* Organization Name */}
              <div className="form-group">
                <label className="form-label">
                  <span className="form-label-icon">
                    <Building2 size={13} color="#16a34a" />
                  </span>
                  Organization Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Green Earth Foundation"
                  value={profile.organizationName}
                  onChange={(e) => setProfile((p) => ({ ...p, organizationName: e.target.value }))}
                  required
                />
                <p className="form-hint">This is the name volunteers will see when browsing.</p>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">
                  <span className="form-label-icon">
                    <FileText size={13} color="#16a34a" />
                  </span>
                  Description
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="Describe your organization's mission, focus areas, and the kind of volunteers you're looking for…"
                  rows={5}
                  maxLength={600}
                  value={profile.description}
                  onChange={(e) => setProfile((p) => ({ ...p, description: e.target.value }))}
                />
                <div className={`char-count ${profile.description.length > 540 ? 'near' : ''} ${profile.description.length >= 600 ? 'over' : ''}`}>
                  {profile.description.length} / 600
                </div>
                <p className="form-hint">A clear description helps volunteers understand your mission.</p>
              </div>

              <button type="submit" className="btn-save" disabled={saving}>
                <Save size={15} />
                {saving ? 'Saving…' : 'Save Profile'}
              </button>

            </form>
          </div>

          {/* Sidebar */}
          <div className="sidebar">

            {/* Live preview */}
            <div className="side-card">
              <div className="side-card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Eye size={13} color="#16a34a" /> Volunteer Preview
              </div>
              <span className="preview-badge">
                <Building2 size={10} /> NGO
              </span>
              <div className="preview-ngo-name">
                {profile.organizationName || <span className="preview-empty">Organization name…</span>}
              </div>
              <p className="preview-desc">
                {profile.description || <span className="preview-empty">Your description will appear here…</span>}
              </p>
            </div>

            {/* Completeness */}
            <div className="side-card">
              <div className="side-card-title">Profile Completeness</div>
              <div className="completeness-bar-bg">
                <div className="completeness-bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="completeness-label">{pct}% complete — {filled} of 2 fields filled</span>
            </div>

            {/* Tips */}
            <div className="side-card">
              <div className="side-card-title">Tips for attracting volunteers</div>
              <div className="tip-list">
                {[
                  'Use your full registered organization name so volunteers can verify you.',
                  'Describe your mission clearly in 2–3 sentences.',
                  'Mention the causes you work on — e.g. education, environment, health.',
                  'Keep your description updated as your focus areas evolve.',
                ].map((t) => (
                  <div className="tip-item" key={t}>
                    <span className="tip-dot" />
                    {t}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}