import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import {
  Heart, User, Lightbulb, Clock, MapPin,
  ArrowLeft, CheckCircle, AlertCircle, Save, Tag
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

export default function VolunteerProfile() {
  useFonts();

  const [profile, setProfile]       = useState({ skills: [], interests: '', availability: '', location: '' });
  const [skillsInput, setSkillsInput] = useState('');
  const [saving, setSaving]         = useState(false);
  const [message, setMessage]       = useState('');
  const [isError, setIsError]       = useState(false);

  useEffect(() => {
    api.get('/volunteer/profile').then((res) => {
      setProfile(res.data);
      setSkillsInput((res.data.skills || []).join(', '));
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setIsError(false);
    try {
      const skills = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);
      await api.put('/volunteer/profile', {
        skills,
        interests:    profile.interests,
        availability: profile.availability,
        location:     profile.location,
      });
      setProfile((p) => ({ ...p, skills }));
      setMessage('Profile updated successfully.');
      setIsError(false);
    } catch (err) {
      setMessage(err.message || 'Update failed. Please try again.');
      setIsError(true);
    } finally {
      setSaving(false);
    }
  };

  /* Derive skill tags for preview */
  const skillTags = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);

  const FIELDS = [
    {
      key:         'skillsInput',
      label:       'Skills',
      icon:        Tag,
      placeholder: 'e.g. Teaching, First Aid, Cooking',
      hint:        'Separate each skill with a comma.',
      value:       skillsInput,
      onChange:    (v) => setSkillsInput(v),
    },
    {
      key:         'interests',
      label:       'Interests',
      icon:        Lightbulb,
      placeholder: 'e.g. Education, Environment, Healthcare',
      hint:        'Causes you care about most.',
      value:       profile.interests,
      onChange:    (v) => setProfile((p) => ({ ...p, interests: v })),
    },
    {
      key:         'availability',
      label:       'Availability',
      icon:        Clock,
      placeholder: 'e.g. Weekends, Evenings, Full-time',
      hint:        'When you are generally free to volunteer.',
      value:       profile.availability,
      onChange:    (v) => setProfile((p) => ({ ...p, availability: v })),
    },
    {
      key:         'location',
      label:       'Location',
      icon:        MapPin,
      placeholder: 'City or area',
      hint:        'Helps match you with nearby opportunities.',
      value:       profile.location,
      onChange:    (v) => setProfile((p) => ({ ...p, location: v })),
    },
  ];

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
          font-size: 13.5px; font-weight: 600; color: #6b7280;
          text-decoration: none;
          transition: color 0.15s;
        }
        .nav-back:hover { color: #16a34a; }

        /* ── Page layout ── */
        .page { max-width: 860px; margin: 0 auto; padding: 40px 24px 64px; }

        /* ── Page header ── */
        .page-header { margin-bottom: 32px; }
        .page-title { font-size: clamp(1.6rem, 3vw, 2rem); color: #111827; letter-spacing: -0.02em; margin-bottom: 6px; }
        .page-sub { font-size: 15px; color: #6b7280; line-height: 1.6; }

        /* ── Two-column layout ── */
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
        .form-input {
          width: 100%; padding: 11px 14px;
          border: 1.5px solid #e5e7eb; border-radius: 9px;
          font-family: 'Lora', Georgia, serif;
          font-size: 14.5px; color: #111827; background: #fff;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .form-input::placeholder { color: #c4c4c4; }
        .form-input:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
        }
        .form-hint { font-size: 12px; color: #9ca3af; margin-top: 5px; }

        /* ── Alert ── */
        .alert {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 12px 14px; border-radius: 10px; margin-bottom: 22px;
          font-size: 13.5px; line-height: 1.55;
        }
        .alert-success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
        .alert-error   { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; }

        /* ── Submit button ── */
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

        /* ── Sidebar cards ── */
        .sidebar { display: flex; flex-direction: column; gap: 16px; }

        .side-card {
          background: #fff; border: 1.5px solid #e5e7eb; border-radius: 14px; padding: 22px;
        }
        .side-card-title {
          font-size: 13px; font-weight: 700; color: #111827;
          margin-bottom: 14px; letter-spacing: -0.01em;
        }

        /* Skill tags */
        .skill-tags { display: flex; flex-wrap: wrap; gap: 7px; }
        .skill-tag {
          padding: 4px 11px; border-radius: 100px;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          color: #15803d; font-size: 12.5px; font-weight: 500;
        }
        .skill-empty { font-size: 13px; color: #9ca3af; }

        /* Profile completeness */
        .completeness-bar-bg {
          height: 7px; background: #f3f4f6; border-radius: 100px; overflow: hidden; margin: 10px 0;
        }
        .completeness-bar-fill {
          height: 100%; background: #16a34a; border-radius: 100px;
          transition: width 0.4s ease;
        }
        .completeness-label { font-size: 12px; color: #6b7280; }

        /* Tips list */
        .tip-list { display: flex; flex-direction: column; gap: 10px; }
        .tip-item { display: flex; align-items: flex-start; gap: 9px; font-size: 13px; color: #4b5563; line-height: 1.6; }
        .tip-dot  { width: 6px; height: 6px; border-radius: 50%; background: #16a34a; flex-shrink: 0; margin-top: 6px; }
      `}</style>

      {/* ── Nav ── */}
      <nav className="nav">
        <Link to="/" className="nav-logo">
          <div className="nav-logo-icon">
            <Heart size={15} color="#fff" fill="#fff" />
          </div>
          <span className="nav-logo-text">VolunteerMatch <span>AI</span></span>
        </Link>
        <Link to="/volunteer" className="nav-back">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </nav>

      <div className="page">

        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">My Profile</h1>
          <p className="page-sub">Keep your profile up to date for better AI-powered opportunity matching.</p>
        </div>

        <div className="profile-grid">

          {/* ── Form ── */}
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

              {FIELDS.map((f) => (
                <div className="form-group" key={f.key}>
                  <label className="form-label">
                    <span className="form-label-icon">
                      <f.icon size={13} color="#16a34a" />
                    </span>
                    {f.label}
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={f.placeholder}
                    value={f.value}
                    onChange={(e) => f.onChange(e.target.value)}
                  />
                  <p className="form-hint">{f.hint}</p>
                </div>
              ))}

              <button type="submit" className="btn-save" disabled={saving}>
                <Save size={15} />
                {saving ? 'Saving…' : 'Save Profile'}
              </button>

            </form>
          </div>

          {/* ── Sidebar ── */}
          <div className="sidebar">

            {/* Skills preview */}
            <div className="side-card">
              <div className="side-card-title">Skills Preview</div>
              <div className="skill-tags">
                {skillTags.length > 0
                  ? skillTags.map((s) => (
                      <span key={s} className="skill-tag">{s}</span>
                    ))
                  : <span className="skill-empty">No skills added yet.</span>
                }
              </div>
            </div>

            {/* Profile completeness */}
            {(() => {
              const fields = [skillsInput, profile.interests, profile.availability, profile.location];
              const filled = fields.filter(Boolean).length;
              const pct    = Math.round((filled / fields.length) * 100);
              return (
                <div className="side-card">
                  <div className="side-card-title">Profile Completeness</div>
                  <div className="completeness-bar-bg">
                    <div className="completeness-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="completeness-label">{pct}% complete — {filled} of {fields.length} fields filled</span>
                </div>
              );
            })()}

            {/* Tips */}
            <div className="side-card">
              <div className="side-card-title">Tips for better matches</div>
              <div className="tip-list">
                {[
                  'Add at least 3 skills to improve match accuracy.',
                  'Be specific with interests — "Wildlife Conservation" beats "Environment".',
                  'Update your availability regularly so NGOs know when to reach you.',
                  'Adding your location unlocks nearby opportunities.',
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