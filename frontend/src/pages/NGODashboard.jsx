import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, CalendarDays, Users, TrendingUp, ArrowRight, Heart } from 'lucide-react';

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

const STATS = [
  { label: 'Active Events',      value: '4',   icon: CalendarDays, color: '#16a34a', bg: '#f0fdf4' },
  { label: 'Total Volunteers',   value: '128',  icon: Users,        color: '#2563eb', bg: '#eff6ff' },
  { label: 'Applications',       value: '37',   icon: TrendingUp,   color: '#9333ea', bg: '#faf5ff' },
];

const CARDS = [
  {
    to:    '/ngo/profile',
    icon:  Building2,
    color: '#16a34a',
    bg:    '#f0fdf4',
    title: 'Organization Profile',
    desc:  'Update your NGO name, description, and contact details.',
    cta:   'Edit profile',
  },
  {
    to:    '/ngo/events',
    icon:  CalendarDays,
    color: '#2563eb',
    bg:    '#eff6ff',
    title: 'My Events',
    desc:  'Post new volunteering opportunities and manage existing ones.',
    cta:   'View events',
  },
];

export default function NGODashboard() {
  useFonts();

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

        /* ── Shell ── */
        .dash-shell { min-height: 100vh; background: #f9fafb; }

        /* ── Top nav ── */
        .dash-nav {
          background: #fff;
          border-bottom: 1px solid #e5e7eb;
          padding: 14px 32px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 50;
        }
        .dash-logo {
          display: flex; align-items: center; gap: 9px; text-decoration: none;
        }
        .dash-logo-icon {
          width: 32px; height: 32px; border-radius: 8px;
          background: #16a34a;
          display: flex; align-items: center; justify-content: center;
        }
        .dash-logo-text {
          font-size: 16px; font-weight: 700; color: #111827; letter-spacing: -0.01em;
        }
        .dash-logo-text span { color: #16a34a; }
        .dash-nav-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 100px;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          color: #15803d; font-size: 12px; font-weight: 600;
        }

        /* ── Main content ── */
        .dash-main { max-width: 1100px; margin: 0 auto; padding: 40px 24px 64px; }

        /* ── Header ── */
        .dash-header { margin-bottom: 36px; }
        .dash-greeting {
          font-size: clamp(1.6rem, 3vw, 2.1rem);
          color: #111827; letter-spacing: -0.02em; margin-bottom: 6px;
        }
        .dash-greeting span { color: #16a34a; }
        .dash-sub { font-size: 15px; color: #6b7280; line-height: 1.6; }

        /* ── Stats row ── */
        .stats-row {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 16px; margin-bottom: 36px;
        }
        @media (max-width: 640px) { .stats-row { grid-template-columns: 1fr; } }
        .stat-card {
          background: #fff; border: 1.5px solid #e5e7eb; border-radius: 14px;
          padding: 22px 24px;
          display: flex; align-items: center; gap: 16px;
        }
        .stat-icon {
          width: 46px; height: 46px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .stat-val {
          font-size: 1.75rem; font-weight: 700; color: #111827; line-height: 1;
        }
        .stat-lbl { font-size: 12.5px; color: #9ca3af; margin-top: 4px; letter-spacing: 0.02em; }

        /* ── Section heading ── */
        .section-label {
          font-size: 11.5px; font-weight: 700; color: #9ca3af;
          letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 14px;
        }

        /* ── Nav cards ── */
        .nav-cards {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 16px; margin-bottom: 36px;
        }
        @media (max-width: 640px) { .nav-cards { grid-template-columns: 1fr; } }
        .nav-card {
          background: #fff; border: 1.5px solid #e5e7eb; border-radius: 16px;
          padding: 28px; text-decoration: none; color: inherit;
          display: flex; flex-direction: column; gap: 14px;
          transition: border-color 0.18s, box-shadow 0.18s, transform 0.18s;
        }
        .nav-card:hover {
          border-color: #bbf7d0;
          box-shadow: 0 8px 32px rgba(22,163,74,0.08);
          transform: translateY(-2px);
        }
        .nav-card-icon {
          width: 48px; height: 48px; border-radius: 13px;
          display: flex; align-items: center; justify-content: center;
        }
        .nav-card-title {
          font-size: 17px; font-weight: 700; color: #111827; margin-bottom: 5px;
        }
        .nav-card-desc { font-size: 14px; color: #6b7280; line-height: 1.65; }
        .nav-card-cta {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 13.5px; font-weight: 600; color: #16a34a;
          margin-top: auto;
        }

        /* ── Quick tip ── */
        .tip-box {
          background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 14px;
          padding: 22px 24px;
          display: flex; align-items: flex-start; gap: 14px;
        }
        .tip-icon {
          width: 36px; height: 36px; border-radius: 9px; background: #16a34a;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .tip-title { font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 4px; }
        .tip-body  { font-size: 13.5px; color: #4b5563; line-height: 1.65; }
        .tip-link  { color: #16a34a; font-weight: 600; text-decoration: none; }
        .tip-link:hover { text-decoration: underline; }
      `}</style>

      <div className="dash-shell">

        {/* ── Nav ── */}
        <nav className="dash-nav">
          <Link to="/" className="dash-logo">
            <div className="dash-logo-icon">
              <Heart size={15} color="#fff" fill="#fff" />
            </div>
            <span className="dash-logo-text">VolunteerMatch <span>AI</span></span>
          </Link>
          <span className="dash-nav-badge">
            <Building2 size={12} /> NGO Dashboard
          </span>
        </nav>

        {/* ── Main ── */}
        <main className="dash-main">

          {/* Header */}
          <div className="dash-header">
            <h1 className="dash-greeting">Welcome back, <span>your organization</span> 👋</h1>
            <p className="dash-sub">Here's an overview of your activity and quick actions.</p>
          </div>

          {/* Stats */}
          <p className="section-label">Overview</p>
          <div className="stats-row">
            {STATS.map((s) => (
              <div key={s.label} className="stat-card">
                <div className="stat-icon" style={{ background: s.bg }}>
                  <s.icon size={20} color={s.color} />
                </div>
                <div>
                  <div className="stat-val">{s.value}</div>
                  <div className="stat-lbl">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Nav cards */}
          <p className="section-label">Quick Actions</p>
          <div className="nav-cards">
            {CARDS.map((c) => (
              <Link key={c.to} to={c.to} className="nav-card">
                <div className="nav-card-icon" style={{ background: c.bg }}>
                  <c.icon size={22} color={c.color} />
                </div>
                <div>
                  <div className="nav-card-title">{c.title}</div>
                  <p className="nav-card-desc">{c.desc}</p>
                </div>
                <span className="nav-card-cta">
                  {c.cta} <ArrowRight size={13} />
                </span>
              </Link>
            ))}
          </div>

          {/* Tip */}
          <div className="tip-box">
            <div className="tip-icon">
              <TrendingUp size={17} color="#fff" />
            </div>
            <div>
              <div className="tip-title">Boost your visibility</div>
              <p className="tip-body">
                Complete your organization profile to appear higher in volunteer search results.{' '}
                <Link to="/ngo/profile" className="tip-link">Complete profile →</Link>
              </p>
            </div>
          </div>

        </main>
      </div>
    </>
  );
}