import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import {
  Heart, MapPin, Clock, Building2, ArrowLeft,
  CheckCircle, AlertCircle, Search, Inbox, Send
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

/* ── Single opportunity card ── */
function OpportunityCard({ opp, applied, onApply }) {
  const [applying, setApplying] = useState(false);
  const [err, setErr]           = useState('');

  const handleApply = async () => {
    setApplying(true);
    setErr('');
    try {
      await api.post(`/opportunities/${opp._id}/apply`);
      onApply(opp._id);
    } catch (e) {
      setErr(e.message || 'Apply failed. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="opp-card">
      {/* Top row */}
      <div className="opp-card-top">
        <span className="opp-ngo-badge">
          <Building2 size={11} />
          {opp.ngoName || 'NGO'}
        </span>
        {applied && (
          <span className="opp-applied-badge">
            <CheckCircle size={11} /> Applied
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="opp-title">{opp.title}</h3>

      {/* Description */}
      {opp.description && (
        <p className="opp-desc">{opp.description}</p>
      )}

      {/* Skills */}
      {opp.requiredSkills?.length > 0 && (
        <div className="opp-skills">
          {opp.requiredSkills.slice(0, 4).map((s) => (
            <span key={s} className="opp-skill-tag">{s}</span>
          ))}
        </div>
      )}

      {/* Meta */}
      <div className="opp-meta">
        {opp.location && (
          <span className="opp-meta-item">
            <MapPin size={12} /> {opp.location}
          </span>
        )}
        {opp.duration && (
          <span className="opp-meta-item">
            <Clock size={12} /> {opp.duration}
          </span>
        )}
      </div>

      {/* Action */}
      <div className="opp-footer">
        {applied ? (
          <span className="opp-applied-text">
            <CheckCircle size={14} /> Application sent
          </span>
        ) : (
          <>
            <button
              className="opp-apply-btn"
              onClick={handleApply}
              disabled={applying}
            >
              <Send size={13} />
              {applying ? 'Applying…' : 'Apply now'}
            </button>
            {err && (
              <p className="opp-err">
                <AlertCircle size={12} /> {err}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ── Page skeleton loader ── */
function SkeletonCard() {
  return (
    <div className="opp-card opp-skeleton">
      <div className="sk-line sk-short" />
      <div className="sk-line sk-long" style={{ marginTop: 14 }} />
      <div className="sk-line sk-med"  style={{ marginTop: 8 }} />
      <div className="sk-line sk-med"  style={{ marginTop: 8 }} />
      <div className="sk-line sk-short" style={{ marginTop: 20 }} />
    </div>
  );
}

/* ══════════════════════════════════════ */
export default function Opportunities() {
  useFonts();

  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications]   = useState([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState('');

  useEffect(() => {
    Promise.all([api.get('/opportunities'), api.get('/volunteer/applications')])
      .then(([oppRes, appRes]) => {
        setOpportunities(oppRes.data);
        setApplications(appRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const appliedIds = applications.map((a) => a._id);

  const handleApplied = (id) => {
    setApplications((prev) => [...prev, { _id: id, status: 'Pending' }]);
  };

  const filtered = opportunities.filter((o) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      o.title?.toLowerCase().includes(q) ||
      o.ngoName?.toLowerCase().includes(q) ||
      o.location?.toLowerCase().includes(q) ||
      o.requiredSkills?.some((s) => s.toLowerCase().includes(q))
    );
  });

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

        /* ── Page shell ── */
        .page { max-width: 1100px; margin: 0 auto; padding: 40px 24px 64px; }

        /* ── Page header ── */
        .page-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          flex-wrap: wrap; gap: 16px; margin-bottom: 28px;
        }
        .page-title { font-size: clamp(1.6rem, 3vw, 2rem); color: #111827; letter-spacing: -0.02em; margin-bottom: 5px; }
        .page-sub   { font-size: 15px; color: #6b7280; line-height: 1.6; }
        .result-count {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 100px;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          color: #15803d; font-size: 12.5px; font-weight: 600;
          align-self: center;
        }

        /* ── Search bar ── */
        .search-wrap {
          position: relative; margin-bottom: 28px; max-width: 420px;
        }
        .search-icon {
          position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
          color: #9ca3af; display: flex; align-items: center; pointer-events: none;
        }
        .search-input {
          width: 100%; padding: 11px 14px 11px 38px;
          border: 1.5px solid #e5e7eb; border-radius: 10px;
          font-family: 'Lora', Georgia, serif;
          font-size: 14.5px; color: #111827; background: #fff;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .search-input::placeholder { color: #c4c4c4; }
        .search-input:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
        }

        /* ── Grid ── */
        .opp-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        @media (max-width: 900px) { .opp-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .opp-grid { grid-template-columns: 1fr; } }

        /* ── Opportunity card ── */
        .opp-card {
          background: #fff; border: 1.5px solid #e5e7eb; border-radius: 16px;
          padding: 24px; display: flex; flex-direction: column; gap: 12px;
          transition: border-color 0.18s, box-shadow 0.18s, transform 0.18s;
        }
        .opp-card:hover {
          border-color: #bbf7d0;
          box-shadow: 0 8px 32px rgba(22,163,74,0.08);
          transform: translateY(-2px);
        }

        .opp-card-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; }

        .opp-ngo-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 100px;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          color: #15803d; font-size: 12px; font-weight: 600;
        }
        .opp-applied-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 100px;
          background: #eff6ff; border: 1px solid #bfdbfe;
          color: #1d4ed8; font-size: 12px; font-weight: 600;
        }

        .opp-title { font-size: 16px; font-weight: 700; color: #111827; line-height: 1.35; }

        .opp-desc {
          font-size: 13.5px; color: #6b7280; line-height: 1.68;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }

        .opp-skills { display: flex; flex-wrap: wrap; gap: 6px; }
        .opp-skill-tag {
          padding: 3px 10px; border-radius: 100px;
          background: #f9fafb; border: 1px solid #e5e7eb;
          color: #6b7280; font-size: 12px; font-weight: 500;
        }

        .opp-meta { display: flex; flex-wrap: wrap; gap: 12px; }
        .opp-meta-item {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12.5px; color: #9ca3af;
        }

        .opp-footer { margin-top: auto; padding-top: 4px; }

        .opp-apply-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 20px; border-radius: 9px;
          background: #16a34a; color: #fff;
          font-family: 'Lora', Georgia, serif;
          font-size: 13.5px; font-weight: 600;
          border: none; cursor: pointer;
          transition: background 0.18s;
        }
        .opp-apply-btn:hover:not(:disabled) { background: #15803d; }
        .opp-apply-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .opp-applied-text {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13.5px; font-weight: 600; color: #16a34a;
        }
        .opp-err {
          display: flex; align-items: center; gap: 5px;
          font-size: 12.5px; color: #b91c1c; margin-top: 8px;
        }

        /* ── Skeleton ── */
        .opp-skeleton { pointer-events: none; }
        .sk-line {
          height: 13px; border-radius: 6px;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        .sk-short { width: 38%; }
        .sk-med   { width: 72%; }
        .sk-long  { width: 90%; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* ── Empty state ── */
        .empty-state {
          grid-column: 1 / -1;
          display: flex; flex-direction: column; align-items: center;
          padding: 64px 24px; text-align: center;
        }
        .empty-icon {
          width: 64px; height: 64px; border-radius: 16px;
          background: #f0fdf4; border: 1.5px solid #bbf7d0;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 18px;
        }
        .empty-title { font-size: 17px; font-weight: 700; color: #111827; margin-bottom: 6px; }
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
        <Link to="/volunteer" className="nav-back">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </nav>

      <div className="page">

        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Browse Opportunities</h1>
            <p className="page-sub">Find volunteering events that match your skills and interests.</p>
          </div>
          {!loading && (
            <span className="result-count">
              {filtered.length} {filtered.length === 1 ? 'opportunity' : 'opportunities'}
            </span>
          )}
        </div>

        {/* Search */}
        <div className="search-wrap">
          <span className="search-icon"><Search size={15} /></span>
          <input
            className="search-input"
            type="text"
            placeholder="Search by title, NGO, location or skill…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Grid */}
        <div className="opp-grid">
          {loading ? (
            [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Inbox size={28} color="#16a34a" />
              </div>
              <div className="empty-title">
                {search ? 'No results found' : 'No opportunities yet'}
              </div>
              <p className="empty-sub">
                {search
                  ? `Try a different search term.`
                  : 'Check back soon — NGOs are posting new events regularly.'}
              </p>
            </div>
          ) : (
            filtered.map((opp) => (
              <OpportunityCard
                key={opp._id}
                opp={opp}
                applied={appliedIds.includes(opp._id)}
                onApply={handleApplied}
              />
            ))
          )}
        </div>

      </div>
    </>
  );
}