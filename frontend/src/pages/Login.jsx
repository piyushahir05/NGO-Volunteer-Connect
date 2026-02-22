import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Mail, Lock, ArrowRight } from 'lucide-react';

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

export default function Login() {
  useFonts();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'NGO' ? '/ngo' : '/volunteer');
    } catch (err) {
      setError(err.message || 'Login failed');
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

        .login-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 720px) {
          .login-page { grid-template-columns: 1fr; }
          .login-left  { display: none; }
        }

        /* ── Left panel ── */
        .login-left {
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

        .left-body { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 40px 0; }
        .left-h {
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          color: #111827; line-height: 1.15;
          letter-spacing: -0.02em; margin-bottom: 18px;
        }
        .left-h span { color: #16a34a; }
        .left-p { font-size: 15.5px; color: #4b5563; line-height: 1.76; max-width: 360px; }

        .left-stats { display: flex; gap: 32px; }
        .ls-v { font-size: 1.9rem; font-weight: 700; color: #16a34a; display: block; line-height: 1; }
        .ls-l { font-size: 11px; color: #9ca3af; letter-spacing: 0.07em; text-transform: uppercase; margin-top: 4px; }

        /* ── Right panel ── */
        .login-right {
          display: flex; align-items: center; justify-content: center;
          padding: 48px 40px;
          background: #fff;
        }
        .login-box { width: 100%; max-width: 380px; }

        .login-box-header { margin-bottom: 32px; }
        .login-box-title {
          font-size: 1.75rem; color: #111827;
          letter-spacing: -0.02em; margin-bottom: 6px;
        }
        .login-box-sub { font-size: 14.5px; color: #6b7280; line-height: 1.6; }

        /* Form */
        .form-group { margin-bottom: 18px; }
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

        .error-box {
          padding: 11px 14px; border-radius: 9px;
          background: #fef2f2; border: 1px solid #fecaca;
          color: #b91c1c; font-size: 13.5px; margin-bottom: 18px;
        }

        .btn-submit {
          width: 100%; padding: 13px;
          background: #16a34a; color: #fff;
          font-family: 'Lora', Georgia, serif;
          font-size: 15px; font-weight: 600;
          border: none; border-radius: 9px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          transition: background 0.18s;
        }
        .btn-submit:hover:not(:disabled) { background: #15803d; }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .form-footer {
          margin-top: 22px; text-align: center;
          font-size: 14px; color: #6b7280;
        }
        .form-footer a {
          color: #16a34a; font-weight: 600; text-decoration: none;
        }
        .form-footer a:hover { text-decoration: underline; }

        .divider-row {
          display: flex; align-items: center; gap: 12px;
          margin: 22px 0;
        }
        .divider-line { flex: 1; height: 1px; background: #f3f4f6; }
        .divider-text { font-size: 12px; color: #d1d5db; letter-spacing: 0.05em; }
      `}</style>

      <div className="login-page">

        {/* ── Left decorative panel ── */}
        <div className="login-left">
          <Link to="/" className="left-logo">
            <div className="left-logo-icon">
              <Heart size={16} color="#fff" fill="#fff" />
            </div>
            <span className="left-logo-text">VolunteerMatch <span>AI</span></span>
          </Link>

          <div className="left-body">
            <h2 className="left-h">
              Good to have <br />you <span>back.</span>
            </h2>
            <p className="left-p">
              Thousands of volunteers and NGOs are already creating change.
              Sign in to continue your journey.
            </p>
          </div>

          <div className="left-stats">
            {[
              { v: '10,000+', l: 'Volunteers' },
              { v: '500+',    l: 'Partner NGOs' },
              { v: '85%',     l: 'Match Rate' },
            ].map((s) => (
              <div key={s.l}>
                <span className="ls-v">{s.v}</span>
                <span className="ls-l">{s.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="login-right">
          <div className="login-box">

            <div className="login-box-header">
              <h1 className="login-box-title">Sign in</h1>
              <p className="login-box-sub">Welcome back — enter your details below.</p>
            </div>

            <form onSubmit={handleSubmit}>
              {error && <div className="error-box">{error}</div>}

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
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Signing in…' : (<>Sign in <ArrowRight size={15} /></>)}
              </button>
            </form>

            <div className="divider-row">
              <div className="divider-line" />
              <span className="divider-text">OR</span>
              <div className="divider-line" />
            </div>

            <p className="form-footer">
              Don't have an account?{' '}
              <Link to="/register">Create one</Link>
            </p>

          </div>
        </div>

      </div>
    </>
  );
}