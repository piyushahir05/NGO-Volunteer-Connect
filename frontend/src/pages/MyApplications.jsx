import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import {
  Heart, ArrowLeft, MapPin, Clock, Building2,
  CheckCircle, XCircle, Clock3, Inbox, ChevronRight
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

const STATUS = {
  Pending:  { label: 'Pending',  icon: Clock3,       color: '#92400e', bg: '#fffbeb', border: '#fde68a' },
  Accepted: { label: 'Accepted', icon: CheckCircle,   color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
  Rejected: { label: 'Rejected', icon: XCircle,       color: '#b91c1c', bg: '#fef2f2', border: '#fecaca' },
};

function StatusBadge({ status }) {
  const s = STATUS[status] || { label: status, icon: Clock3, color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' };
  const Icon = s.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '5px 12px', borderRadius: 100,
      background: s.bg, border: `1px solid ${s.border}`,
      color: s.color, fontSize: 12.5, fontWeight: 600,
      whiteSpace: 'nowrap',
    }}>
      <Icon size={12} />
      {s.label}
    </span>
  );
}

function SkeletonRow() {
  return (
    <div className="app-card" style={{ pointerEvents: 'none' }}>
      <div style={{ flex: 1 }}>
        <div className="sk-line sk-long" />
        <div className="sk-line sk-short" style={{ marginTop: 10 }} />
      </div>
      <div className="sk-line" style={{ width: 80, height: 28, borderRadius: 100 }} />
    </div>
  );
}

export default function MyApplications() {
  useFonts();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState('All');

  useEffect(() => {
    api.get('/volunteer/applications')
      .then((res) => setApplications(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    All:      applications.length,
    Pending:  applications.filter((a) => a.status === 'Pending').length,
    Accepted: applications.filter((a) => a.status === 'Accepted').length,
    Rejected: applications.filter((a) => a.status === 'Rejected').length,
  };

  const filtered = filter === 'All' ? applications : applications.filter((a) => a.status === filter);

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

        .page-header { margin-bottom: 28px; }
        .page-title { font-size: clamp(1.6rem, 3vw, 2rem); color: #111827; letter-spacing: -0.02em; margin-bottom: 5px; }
        .page-sub   { font-size: 15px; color: #6b7280; line-height: 1.6; }

        /* ── Stats row ── */
        .stats-row {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 12px; margin-bottom: 24px;
        }
        @media (max-width: 560px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }
        .stat-card {
          background: #fff; border: 1.5px solid #e5e7eb; border-radius: 12px;
          padding: 16px 18px; text-align: center;
        }
        .stat-val { font-size: 1.6rem; font-weight: 700; color: #111827; line-height: 1; }
        .stat-lbl { font-size: 12px; color: #9ca3af; margin-top: 4px; letter-spacing: 0.03em; }

        /* ── Filter tabs ── */
        .filter-tabs {
          display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 20px;
        }
        .filter-tab {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 16px; border-radius: 100px;
          font-family: 'Lora', Georgia, serif;
          font-size: 13px; font-weight: 600; cursor: pointer;
          border: 1.5px solid #e5e7eb; background: #fff; color: #6b7280;
          transition: all 0.15s;
        }
        .filter-tab:hover { border-color: #bbf7d0; color: #15803d; background: #f9fffe; }
        .filter-tab.active { background: #16a34a; border-color: #16a34a; color: #fff; }
        .filter-tab .count {
          background: rgba(255,255,255,0.25); border-radius: 100px;
          padding: 1px 7px; font-size: 11px;
        }
        .filter-tab:not(.active) .count {
          background: #f3f4f6; color: #9ca3af;
        }

        /* ── Application cards ── */
        .apps-list { display: flex; flex-direction: column; gap: 12px; }

        .app-card {
          background: #fff; border: 1.5px solid #e5e7eb; border-radius: 14px;
          padding: 20px 24px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; flex-wrap: wrap;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .app-card:hover { border-color: #d1d5db; box-shadow: 0 4px 16px rgba(0,0,0,0.05); }

        .app-left { flex: 1; min-width: 0; }
        .app-title { font-size: 15.5px; font-weight: 700; color: #111827; margin-bottom: 6px; }
        .app-meta  { display: flex; flex-wrap: wrap; gap: 12px; }
        .app-meta-item {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12.5px; color: #9ca3af;
        }

        /* Accepted highlight */
        .app-card.accepted { border-color: #bbf7d0; }
        .app-card.accepted:hover { box-shadow: 0 4px 20px rgba(22,163,74,0.09); }

        /* Rejected dim */
        .app-card.rejected .app-title { color: #6b7280; }

        /* ── Skeleton ── */
        .sk-line {
          height: 13px; border-radius: 6px;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        .sk-short { width: 40%; }
        .sk-long  { width: 68%; }
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
        .empty-sub   { font-size: 14px; color: #9ca3af; margin-bottom: 20px; }
        .btn-browse {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 11px 22px; border-radius: 9px;
          background: #16a34a; color: #fff;
          font-family: 'Lora', Georgia, serif;
          font-size: 14px; font-weight: 600; text-decoration: none;
          transition: background 0.18s;
        }
        .btn-browse:hover { background: #15803d; }
      `}</style>

      {/* Nav */}
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
          <h1 className="page-title">My Applications</h1>
          <p className="page-sub">Track the status of every opportunity you've applied for.</p>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="stats-row">
            {[
              { label: 'Total',    val: counts.All },
              { label: 'Pending',  val: counts.Pending },
              { label: 'Accepted', val: counts.Accepted },
              { label: 'Rejected', val: counts.Rejected },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <div className="stat-val">{s.val}</div>
                <div className="stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filter tabs */}
        {!loading && applications.length > 0 && (
          <div className="filter-tabs">
            {['All', 'Pending', 'Accepted', 'Rejected'].map((f) => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f} <span className="count">{counts[f]}</span>
              </button>
            ))}
          </div>
        )}

        {/* List */}
        <div className="apps-list">
          {loading ? (
            [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
          ) : filtered.length === 0 && applications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Inbox size={26} color="#16a34a" />
              </div>
              <div className="empty-title">No applications yet</div>
              <p className="empty-sub">Browse open opportunities and apply to ones that match your skills.</p>
              <Link to="/volunteer/opportunities" className="btn-browse">
                Browse Opportunities <ChevronRight size={14} />
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><Inbox size={26} color="#16a34a" /></div>
              <div className="empty-title">No {filter.toLowerCase()} applications</div>
              <p className="empty-sub">Try a different filter above.</p>
            </div>
          ) : (
            filtered.map((app) => {
              const statusKey = app.status in STATUS ? app.status.toLowerCase() : '';
              return (
                <div key={app._id} className={`app-card ${statusKey}`}>
                  <div className="app-left">
                    <div className="app-title">{app.title}</div>
                    <div className="app-meta">
                      {app.ngoName && (
                        <span className="app-meta-item">
                          <Building2 size={12} /> {app.ngoName}
                        </span>
                      )}
                      {app.location && (
                        <span className="app-meta-item">
                          <MapPin size={12} /> {app.location}
                        </span>
                      )}
                      {app.duration && (
                        <span className="app-meta-item">
                          <Clock size={12} /> {app.duration}
                        </span>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}