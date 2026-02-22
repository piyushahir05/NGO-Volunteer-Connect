import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart, ArrowRight, Sparkles, Zap, Globe,
  Brain, Target, LayoutDashboard, Users, TrendingUp,
} from "lucide-react";

/* ── Load Google Fonts once ── */
function useFonts() {
  useEffect(() => {
    if (document.getElementById("vm-gf")) return;

    const link = document.createElement("link");
    link.id = "vm-gf";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Inter:wght@400;500;600;700&display=swap";

    document.head.appendChild(link);
  }, []);
}

/* ── Simple count-up ── */
function useCountUp(target, ms = 1400) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf, t0;
    const tick = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / ms, 1);
      setV(Math.floor(p * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

const FEATURES = [
  {
    Icon: Brain,
    title: "AI-Powered Matching",
    body: "Our engine analyses 40+ skill dimensions to surface the highest-impact pairings between volunteers and NGOs.",
    color: "#16a34a",
    bg: "#f0fdf4",
  },
  {
    Icon: Target,
    title: "Precision Filtering",
    body: "Location, availability, expertise, and cause-area filters so every suggestion is genuinely relevant.",
    color: "#2563eb",
    bg: "#eff6ff",
  },
  {
    Icon: LayoutDashboard,
    title: "Role-Based Dashboards",
    body: "Dedicated views for volunteers and NGO coordinators — focused, clutter-free, and built for action.",
    color: "#9333ea",
    bg: "#faf5ff",
  },
];

const STEPS = [
  { n: "01", title: "Create your profile",   sub: "Skills, availability & passions" },
  { n: "02", title: "Get matched",            sub: "AI surfaces top opportunities"  },
  { n: "03", title: "Collaborate & track",   sub: "Manage hours and impact"         },
];

const CAUSES = [
  "Education","Environment","Healthcare","Animal Welfare",
  "Disaster Relief","Mental Health","Food Security","Human Rights",
  "Youth Empowerment","Arts & Culture",
];

export default function Home() {
  useFonts();
  const volunteers = useCountUp(10000);
  const ngos       = useCountUp(500);
  const matchRate  = useCountUp(85);

  return (
    <>
      <style>{`
        /* ─── Reset & base ─── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: #fff;
          color: #111827;
          font-family: 'DM Sans', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        /* ─── Typography ─── */
        .serif { font-family: 'DM Serif Display', Georgia, serif !important; }

        /* ─── Layout helpers ─── */
        .container { max-width: 1140px; margin: 0 auto; padding: 0 24px; }

        /* ─── Pill badge ─── */
        .pill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 13px; border-radius: 100px;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          color: #15803d; font-size: 12.5px; font-weight: 600;
          letter-spacing: 0.03em;
        }

        /* ─── Buttons ─── */
        .btn-primary {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 13px 26px; border-radius: 10px;
          background: #16a34a; color: #fff;
          font-weight: 700; font-size: 15px; font-family: 'DM Sans', sans-serif;
          text-decoration: none; border: none; cursor: pointer;
          transition: background 0.18s;
        }
        .btn-primary:hover { background: #15803d; }

        .btn-outline {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 13px 26px; border-radius: 10px;
          background: transparent; color: #111827;
          font-weight: 600; font-size: 15px; font-family: 'DM Sans', sans-serif;
          text-decoration: none; border: 1.5px solid #d1d5db; cursor: pointer;
          transition: border-color 0.18s, background 0.18s;
        }
        .btn-outline:hover { border-color: #16a34a; background: #f0fdf4; color: #15803d; }

        /* ─── NAV ─── */
        .nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-bottom: 1px solid #f3f4f6;
        }
        .nav-in {
          display: flex; justify-content: space-between; align-items: center;
          padding: 15px 24px;
        }
        .logo {
          display: flex; align-items: center; gap: 9px; text-decoration: none;
        }
        .logo-icon {
          width: 34px; height: 34px; border-radius: 8px;
          background: #16a34a;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .logo-text {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 18px; color: #111827; letter-spacing: -0.01em;
        }
        .logo-text span { color: #16a34a; }
        .nav-links { display: flex; align-items: center; gap: 14px; }
        .nav-link {
          color: #6b7280; text-decoration: none;
          font-size: 14px; font-weight: 500;
          transition: color 0.15s;
        }
        .nav-link:hover { color: #111827; }

        /* ─── HERO ─── */
        .hero {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 56px; align-items: center;
          padding: 80px 24px 72px;
          max-width: 1140px; margin: 0 auto;
        }
        @media (max-width: 800px) {
          .hero { grid-template-columns: 1fr; padding: 48px 20px; }
          .hero-visual { display: none; }
          .feat-grid, .steps-grid { grid-template-columns: 1fr !important; }
        }
        .hero-eyebrow { margin-bottom: 18px; }
        .hero-h1 {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(2.4rem, 4.5vw, 3.6rem);
          line-height: 1.1; letter-spacing: -0.02em;
          color: #111827; margin-bottom: 20px;
        }
        .hero-h1 .accent { color: #16a34a; }
        .hero-p {
          font-size: 16.5px; color: #4b5563; line-height: 1.76;
          max-width: 440px; margin-bottom: 32px;
        }
        .hero-cta { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 44px; }

        /* Stats */
        .stats { display: flex; gap: 36px; padding-top: 4px; border-top: 1px solid #f3f4f6; }
        .stat-v {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(1.8rem, 3vw, 2.3rem);
          color: #16a34a; display: block; line-height: 1;
        }
        .stat-l {
          font-size: 11.5px; color: #9ca3af;
          letter-spacing: 0.07em; text-transform: uppercase; margin-top: 4px;
        }

        /* Hero visual */
        .hero-visual { position: relative; }
        .hero-img-wrap {
          border-radius: 18px; overflow: hidden;
          border: 1px solid #e5e7eb;
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
        }
        .hero-img-wrap img {
          display: block; width: 100%; aspect-ratio: 4/3; object-fit: cover;
        }

        /* Floating badges — CSS-only, compositor-safe */
        .badge {
          position: absolute;
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          display: flex; align-items: center; gap: 10px;
          will-change: transform;
        }
        .badge-a {
          bottom: -14px; left: -14px; padding: 12px 16px;
          animation: floatA 4s ease-in-out infinite;
        }
        .badge-b {
          top: -12px; right: -12px; padding: 10px 14px;
          animation: floatB 5s ease-in-out infinite;
        }
        @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(5px)}  }
        .badge-icon {
          width: 36px; height: 36px; border-radius: 9px;
          background: #16a34a;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .badge-t { font-size: 13px; font-weight: 700; color: #111827; }
        .badge-s { font-size: 11px; color: #6b7280; margin-top: 1px; }

        /* ─── TICKER ─── */
        .ticker {
          border-top: 1px solid #f3f4f6; border-bottom: 1px solid #f3f4f6;
          background: #fafafa; padding: 14px 0; overflow: hidden;
        }
        .ticker-track {
          display: flex; white-space: nowrap;
          animation: slide 30s linear infinite;
          will-change: transform;
        }
        .ticker-item {
          display: inline-flex; align-items: center; gap: 24px;
          padding: 0 24px;
          font-size: 12px; font-weight: 600; color: #9ca3af;
          letter-spacing: 0.1em; text-transform: uppercase;
        }
        .ticker-dot { color: #16a34a; font-size: 9px; }
        @keyframes slide { from{transform:translateX(0)} to{transform:translateX(-50%)} }

        /* ─── SECTION SHELL ─── */
        .section { max-width: 1140px; margin: 0 auto; padding: 80px 24px; }
        .section-label {
          font-size: 12px; font-weight: 700; color: #16a34a;
          letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px;
        }
        .section-h2 {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(1.9rem, 3.2vw, 2.7rem);
          color: #111827; letter-spacing: -0.02em; line-height: 1.1;
          max-width: 500px;
        }
        .section-sub {
          font-size: 15.5px; color: #6b7280; line-height: 1.74;
          max-width: 420px; margin-top: 14px;
        }

        /* ─── FEATURE CARDS ─── */
        .feat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; margin-top: 48px; }
        .feat-card {
          border: 1.5px solid #e5e7eb; border-radius: 16px; padding: 28px;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .feat-card:hover {
          border-color: #bbf7d0;
          box-shadow: 0 10px 40px rgba(22,163,74,0.08);
          transform: translateY(-3px);
        }
        .feat-ico {
          width: 46px; height: 46px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 18px;
        }
        .feat-h3 {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 18px; color: #111827; margin-bottom: 9px;
          letter-spacing: -0.01em;
        }
        .feat-p { font-size: 14.5px; color: #6b7280; line-height: 1.7; }

        /* ─── DIVIDER ─── */
        .divider { border: none; border-top: 1px solid #f3f4f6; }

        /* ─── HOW IT WORKS ─── */
        .steps-grid { display: grid; grid-template-columns: repeat(3,1fr); margin-top: 48px; }
        .step {
          padding: 28px 24px;
          border-top: 2px solid #f3f4f6;
          transition: border-color 0.2s;
        }
        .step:hover { border-color: #16a34a; }
        .step-n {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 3.6rem; color: #e5e7eb; line-height: 1;
          transition: color 0.2s;
        }
        .step:hover .step-n { color: #bbf7d0; }
        .step-h {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 17px; color: #111827; margin-top: 10px;
        }
        .step-p { font-size: 14px; color: #9ca3af; margin-top: 5px; }

        /* ─── SOCIAL PROOF strip ─── */
        .proof-strip {
          background: #f9fafb; border-top: 1px solid #f3f4f6; border-bottom: 1px solid #f3f4f6;
          padding: 48px 24px;
        }
        .proof-inner {
          max-width: 1140px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4,1fr); gap: 24px;
          text-align: center;
        }
        @media (max-width: 640px) { .proof-inner { grid-template-columns: repeat(2,1fr); } }
        .proof-v {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 2.4rem; color: #16a34a;
        }
        .proof-l { font-size: 13px; color: #6b7280; margin-top: 4px; }

        /* ─── CTA ─── */
        .cta-section { padding: 80px 24px; }
        .cta-box {
          max-width: 1140px; margin: 0 auto;
          background: #f0fdf4;
          border: 1.5px solid #bbf7d0;
          border-radius: 24px; padding: 64px 48px;
          text-align: center;
        }
        .cta-h2 {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(1.9rem, 3.5vw, 2.9rem);
          color: #111827; letter-spacing: -0.02em;
          margin: 14px auto; max-width: 480px;
        }
        .cta-p { font-size: 16px; color: #4b5563; line-height: 1.74; max-width: 380px; margin: 0 auto 32px; }
        .cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

        /* ─── FOOTER ─── */
        .footer { border-top: 1px solid #f3f4f6; background: #fff; padding: 32px 24px; }
        .footer-in {
          max-width: 1140px; margin: 0 auto;
          display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;
        }
        .footer-copy { font-size: 13px; color: #9ca3af; }
      `}</style>

      {/* ── NAV ── */}
      <header className="nav">
        <div className="nav-in container">
          <Link to="/" className="logo">
            <div className="logo-icon">
              <Heart size={16} color="#fff" fill="#fff" />
            </div>
            <span className="logo-text">VolunteerMatch <span>AI</span></span>
          </Link>
          <div className="nav-links">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn-primary" style={{ padding: "9px 20px", fontSize: 14, borderRadius: 9 }}>
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <div className="hero">
        {/* Left */}
        <div>
          <div className="hero-eyebrow">
            <span className="pill"><Sparkles size={11} /> AI-Powered Social Impact</span>
          </div>

          <h1 className="hero-h1">
            Connect Volunteers <br />
            with <span className="accent">Causes That</span> <br />
            <span className="accent">Need Them Most</span>
          </h1>

          <p className="hero-p">
            VolunteerMatch AI uses intelligent recommendation to pair passionate people
            with the NGOs where they'll create real, lasting change.
          </p>

          <div className="hero-cta">
            <Link to="/register?role=volunteer" className="btn-primary">
              Join as Volunteer <ArrowRight size={15} />
            </Link>
            <Link to="/register?role=ngo" className="btn-outline">
              Register as NGO
            </Link>
          </div>

          <div className="stats">
            {[
              { v: `${volunteers.toLocaleString()}+`, l: "Active Volunteers" },
              { v: `${ngos}+`,                        l: "Partner NGOs" },
              { v: `${matchRate}%`,                   l: "Match Success" },
            ].map((s) => (
              <div key={s.l}>
                <span className="stat-v">{s.v}</span>
                <span className="stat-l">{s.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — image */}
        <div className="hero-visual">
          <div className="hero-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=75"
              alt="Volunteers working together"
              loading="eager"
              decoding="async"
            />
          </div>

          {/* Badge A */}
          <div className="badge badge-a">
            <div className="badge-icon"><Zap size={16} color="#fff" /></div>
            <div>
              <div className="badge-t">New match found!</div>
              <div className="badge-s">94% compatibility score</div>
            </div>
          </div>

          {/* Badge B */}
          <div className="badge badge-b">
            <Globe size={14} color="#16a34a" />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>500+ NGOs worldwide</span>
          </div>
        </div>
      </div>

      {/* ── TICKER ── */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[...Array(3)].flatMap((_, gi) =>
            CAUSES.map((c) => (
              <span className="ticker-item" key={`${c}-${gi}`}>
                {c} <span className="ticker-dot">✦</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="section">
        <div className="section-label"><TrendingUp size={11} style={{ display:"inline", marginRight:5 }} />Platform Features</div>
        <h2 className="serif section-h2">Built for real social impact</h2>
        <p className="section-sub">Every feature designed to remove friction between goodwill and action.</p>

        <div className="feat-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feat-card">
              <div className="feat-ico" style={{ background: f.bg }}>
                <f.Icon size={20} color={f.color} />
              </div>
              <div className="feat-h3">{f.title}</div>
              <p className="feat-p">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* ── SOCIAL PROOF ── */}
      <div className="proof-strip">
        <div className="proof-inner">
          {[
            { v: "10,000+", l: "Registered Volunteers" },
            { v: "500+",    l: "Partner NGOs" },
            { v: "85%",     l: "Placement Success Rate" },
            { v: "40+",     l: "Cause Categories" },
          ].map((s) => (
            <div key={s.l}>
              <div className="proof-v">{s.v}</div>
              <div className="proof-l">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="section">
        <div className="section-label"><Users size={11} style={{ display:"inline", marginRight:5 }} />How It Works</div>
        <h2 className="serif section-h2">Three steps to making a difference</h2>

        <div className="steps-grid">
          {STEPS.map((s) => (
            <div key={s.n} className="step">
              <div className="step-n">{s.n}</div>
              <div className="step-h">{s.title}</div>
              <p className="step-p">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="cta-section">
        <div className="cta-box">
          <span className="pill"><Sparkles size={11} /> Join the Movement</span>
          <h2 className="serif cta-h2">Ready to make a difference?</h2>
          <p className="cta-p">
            Join thousands of volunteers and hundreds of NGOs already creating lasting change together.
          </p>
          <div className="cta-btns">
            <Link to="/register?role=volunteer" className="btn-primary" style={{ fontSize: 16, padding: "15px 32px", borderRadius: 12 }}>
              Start as Volunteer <ArrowRight size={17} />
            </Link>
            <Link to="/register?role=ngo" className="btn-outline" style={{ fontSize: 16, padding: "15px 32px", borderRadius: 12 }}>
              Register an NGO
            </Link>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-in">
          <div className="logo">
            <div className="logo-icon" style={{ width: 28, height: 28, borderRadius: 7 }}>
              <Heart size={13} color="#fff" fill="#fff" />
            </div>
            <span className="logo-text" style={{ fontSize: 15 }}>VolunteerMatch <span>AI</span></span>
          </div>
          <span className="footer-copy">© 2026 VolunteerMatch AI · All rights reserved</span>
        </div>
      </footer>
    </>
  );
}