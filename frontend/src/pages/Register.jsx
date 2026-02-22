import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Mail, Lock, User, ArrowRight, Users, Building2 } from 'lucide-react';

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

export default function Register() {
  useFonts();

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState('Volunteer');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const user = await register(name, email, password, role);
      navigate(user.role === 'NGO' ? '/ngo' : '/volunteer');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #fff;
          font-family: 'Lora', Georgia, serif;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .reg-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 720px) {
          .reg-page { grid-template-columns: 1fr; }
          .reg-left  { display: none; }
        }

        /* ── Left panel ── */
        .reg-left {
          background: #f0fdf4;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
        }
        .left-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
        }
        .left-logo-icon {
          width: 34px; height: 34px; border-radius: 8px;
          background: #16a34a;
          display: flex; align-items: center; justify-content: center;
        }
        .left-logo-text {
          font-size: 17px; font-weight: 700; color: #111827;
          letter-spacing: -0.01em;
        }
        .left-logo-text span { color: #16a34a; }

        .left-body {
          flex: 1; display: flex; flex-direction: column;
          justify-content: center; padding: 40px 0;
        }
        .left-h {
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          color: #111827; line-height: 1.15;
          letter-spacing: -0.02em; margin-bottom: 18px;
        }
        .left-h span { color: #16a34a; }
        .left-p {
          font-size: 15.5px; color: #4b5563;
          line-height: 1.76; max-width: 360px;
        }

        /* Who can join cards */
        .join-cards { display: flex; flex-direction: column; gap: 12px; margin-top: 36px; }
        .join-card {
          display: flex; align-items: flex-start; gap: 13px;
          padding: 16px; border-radius: 12px;
          background: #fff; border: 1.5px solid #e5e7eb;
        }
        .join-card-icon {
          width: 36px; height: 36px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .join-card-title { font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 3px; }
        .join-card-sub   { font-size: 12.5px; color: #6b7280; line-height: 1.5; }

        /* ── Right panel ── */
        .reg-right {
          display: flex; align-items: center; justify-content: center;
          padding: 48px 40px;
          background: #fff;
          overflow-y: auto;
        }
        .reg-box { width: 100%; max-width: 400px; }

        .reg-box-header { margin-bottom: 28px; }
        .reg-box-title {
          font-size: 1.75rem; color: #111827;
          letter-spacing: -0.02em; margin-bottom: 6px;
        }
        .reg-box-sub { font-size: 14.5px; color: #6b7280; line-height: 1.6; }

        /* Form */
        .form-group { margin-bottom: 16px; }
        .form-label {
          display: block; font-size: 13.5px; font-weight: 600;
          color: #374151; margin-bottom: 7px;
        }
        .input-wrap { position: relative; }
        .input-icon {
          position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
          color: #9ca3af; pointer-events: none;
          display: flex; align-items: center;
        }
        .form-input {
          width: 100%; padding: 11px 14px 11px 38px;
          border: 1.5px solid #e5e7eb; border-radius: 9px;
          font-family: 'Lora', Georgia, serif;
          font-size: 14.5px; color: #111827;
          background: #fff;
          transition: border-color 0.18s, box-shadow 0.18s;
          outline: none;
        }
        .form-input::placeholder { color: #c4c4c4; }
        .form-input:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
        }

        /* Role toggle */
        .role-toggle {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
        }
        .role-option { position: relative; }
        .role-option input[type="radio"] {
          position: absolute; opacity: 0; width: 0; height: 0;
        }
        .role-label {
          display: flex; align-items: center; gap: 9px;
          padding: 11px 14px; border-radius: 9px;
          border: 1.5px solid #e5e7eb; cursor: pointer;
          transition: border-color 0.18s, background 0.18s;
          font-size: 14px; font-weight: 500; color: #374151;
        }
        .role-label:hover { border-color: #bbf7d0; background: #f9fffe; }
        .role-option input:checked + .role-label {
          border-color: #16a34a;
          background: #f0fdf4;
          color: #15803d;
        }
        .role-icon {
          width: 28px; height: 28px; border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          background: #f3f4f6; flex-shrink: 0;
          transition: background 0.18s;
        }
        .role-option input:checked + .role-label .role-icon {
          background: #dcfce7;
        }

        .error-box {
          padding: 11px 14px; border-radius: 9px;
          background: #fef2f2; border: 1px solid #fecaca;
          color: #b91c1c; font-size: 13.5px; margin-bottom: 16px;
        }

        .btn-submit {
          width: 100%; padding: 13px;
          background: #16a34a; color: #fff;
          font-family: 'Lora', Georgia, serif;
          font-size: 15px; font-weight: 600;
          border: none; border-radius: 9px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          transition: background 0.18s;
          margin-top: 6px;
        }
        .btn-submit:hover:not(:disabled) { background: #15803d; }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .form-footer {
          margin-top: 20px; text-align: center;
          font-size: 14px; color: #6b7280;
        }
        .form-footer a {
          color: #16a34a; font-weight: 600; text-decoration: none;
        }
        .form-footer a:hover { text-decoration: underline; }

        .divider-row {
          display: flex; align-items: center; gap: 12px;
          margin: 20px 0;
        }
        .divider-line { flex: 1; height: 1px; background: #f3f4f6; }
        .divider-text { font-size: 12px; color: #d1d5db; letter-spacing: 0.05em; }
      `}</style>

      <div className="reg-page">

        {/* ── Left panel ── */}
        <div className="reg-left">
          <Link to="/" className="left-logo">
            <div className="left-logo-icon">
              <Heart size={16} color="#fff" fill="#fff" />
            </div>
            <span className="left-logo-text">VolunteerMatch <span>AI</span></span>
          </Link>

          <div className="left-body">
            <h2 className="left-h">
              Start making <br />an <span>impact today.</span>
            </h2>
            <p className="left-p">
              Join a growing community of volunteers and NGOs using AI to connect
              the right people with the right causes.
            </p>

            <div className="join-cards">
              <div className="join-card">
                <div className="join-card-icon" style={{ background: '#dcfce7' }}>
                  <Users size={17} color="#16a34a" />
                </div>
                <div>
                  <div className="join-card-title">Volunteers</div>
                  <div className="join-card-sub">Find causes that match your skills and schedule.</div>
                </div>
              </div>
              <div className="join-card">
                <div className="join-card-icon" style={{ background: '#dbeafe' }}>
                  <Building2 size={17} color="#2563eb" />
                </div>
                <div>
                  <div className="join-card-title">NGOs & Organizations</div>
                  <div className="join-card-sub">Post opportunities and get matched with ideal volunteers.</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: 12, color: '#9ca3af' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="reg-right">
          <div className="reg-box">

            <div className="reg-box-header">
              <h1 className="reg-box-title">Create account</h1>
              <p className="reg-box-sub">Fill in your details to get started.</p>
            </div>

            <form onSubmit={handleSubmit}>
              {error && <div className="error-box">{error}</div>}

              <div className="form-group">
                <label className="form-label" htmlFor="name">Full name</label>
                <div className="input-wrap">
                  <span className="input-icon"><User size={15} /></span>
                  <input
                    id="name"
                    type="text"
                    className="form-input"
                    placeholder="Your name or organization"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email address</label>
                <div className="input-wrap">
                  <span className="input-icon"><Mail size={15} /></span>
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <div className="input-wrap">
                  <span className="input-icon"><Lock size={15} /></span>
                  <input
                    id="password"
                    type="password"
                    className="form-input"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">I am a</label>
                <div className="role-toggle">
                  {['Volunteer', 'NGO'].map((r) => (
                    <div className="role-option" key={r}>
                      <input
                        type="radio"
                        name="role"
                        id={`role-${r}`}
                        value={r}
                        checked={role === r}
                        onChange={(e) => setRole(e.target.value)}
                      />
                      <label className="role-label" htmlFor={`role-${r}`}>
                        <div className="role-icon">
                          {r === 'Volunteer'
                            ? <Users size={14} color={role === r ? '#16a34a' : '#6b7280'} />
                            : <Building2 size={14} color={role === r ? '#16a34a' : '#6b7280'} />
                          }
                        </div>
                        {r}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Creating account…' : (<>Create account <ArrowRight size={15} /></>)}
              </button>
            </form>

            <div className="divider-row">
              <div className="divider-line" />
              <span className="divider-text">OR</span>
              <div className="divider-line" />
            </div>

            <p className="form-footer">
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </p>

          </div>
        </div>

      </div>
    </>
  );
}