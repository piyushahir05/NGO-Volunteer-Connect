import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart, ArrowRight, Sparkles, Zap, Globe,
  Brain, Target, LayoutDashboard, Users, TrendingUp,
} from "lucide-react";

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
    title: "Smart Matching",
    body: "Our engine analyses 40+ skill dimensions to surface the highest-impact pairings between volunteers and NGOs.",
    colorClass: "text-primary-600",
    bgClass: "bg-primary-50",
  },
  {
    Icon: Target,
    title: "Precision Filtering",
    body: "Location, availability, expertise, and cause-area filters so every suggestion is genuinely relevant.",
    colorClass: "text-blue-600",
    bgClass: "bg-blue-50",
  },
  {
    Icon: LayoutDashboard,
    title: "Role-Based Dashboards",
    body: "Dedicated views for volunteers and NGO coordinators — focused, clutter-free, and built for action.",
    colorClass: "text-purple-600",
    bgClass: "bg-purple-50",
  },
];

const STEPS = [
  { n: "01", title: "Create your profile",  sub: "Skills, availability & passions" },
  { n: "02", title: "Get matched",           sub: "Surfaces top opportunities"  },
  { n: "03", title: "Collaborate & track",  sub: "Manage hours and impact"         },
];

const CAUSES = [
  "Education","Environment","Healthcare","Animal Welfare",
  "Disaster Relief","Mental Health","Food Security","Human Rights",
  "Youth Empowerment","Arts & Culture",
];

export default function Home() {
  const volunteers = useCountUp(10000);
  const ngos       = useCountUp(500);
  const matchRate  = useCountUp(85);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 antialiased">

      {/* NAV */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0">
              <Heart size={16} className="text-white fill-white" />
            </div>
            <span className="font-display text-lg text-slate-800">
              VolunteerMatch
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold">
              <Sparkles size={11} /> Smart Social Impact
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight text-slate-900 mb-5">
            Connect Volunteers <br />
            with <span className="text-primary-600">Causes That</span> <br />
            <span className="text-primary-600">Need Them Most</span>
          </h1>
          <p className="text-base md:text-lg text-slate-500 leading-relaxed max-w-md mb-8">
            VolunteerMatch uses intelligent recommendation to pair passionate people
            with the NGOs where they'll create real, lasting change.
          </p>
          <div className="flex flex-wrap gap-3 mb-10">
            <Link
              to="/register?role=volunteer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 transition-colors"
            >
              Join as Volunteer <ArrowRight size={15} />
            </Link>
            <Link
              to="/register?role=ngo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700 transition-all"
            >
              Register as NGO
            </Link>
          </div>
          <div className="flex gap-8 pt-5 border-t border-slate-100">
            {[
              { v: `${volunteers.toLocaleString()}+`, l: "Active Volunteers" },
              { v: `${ngos}+`,                        l: "Partner NGOs" },
              { v: `${matchRate}%`,                   l: "Match Success" },
            ].map((s) => (
              <div key={s.l}>
                <span className="block font-display text-3xl text-primary-600 leading-none">{s.v}</span>
                <span className="block text-xs text-slate-400 tracking-widest uppercase mt-1">{s.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero visual */}
        <div className="hidden md:block relative">
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=75"
              alt="Volunteers working together"
              loading="eager"
              decoding="async"
              className="block w-full aspect-[4/3] object-cover"
            />
          </div>
          {/* Badge A */}
          <div className="absolute -bottom-4 -left-4 bg-white border border-slate-200 rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 animate-[floatA_4s_ease-in-out_infinite]">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0">
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">New match found!</div>
              <div className="text-xs text-slate-500 mt-0.5">94% compatibility score</div>
            </div>
          </div>
          {/* Badge B */}
          <div className="absolute -top-3 -right-3 bg-white border border-slate-200 rounded-xl shadow-lg px-3.5 py-2.5 flex items-center gap-2 animate-[floatB_5s_ease-in-out_infinite]">
            <Globe size={14} className="text-primary-600" />
            <span className="text-xs font-semibold text-slate-800">500+ NGOs worldwide</span>
          </div>
        </div>
      </div>

      {/* TICKER */}
      <div className="border-y border-slate-100 bg-slate-50 py-3.5 overflow-hidden" aria-hidden="true">
        <div className="flex whitespace-nowrap motion-reduce:animate-none" style={{ animation: 'slide 30s linear infinite' }}>
          {[...Array(3)].flatMap((_, gi) =>
            CAUSES.map((c) => (
              <span className="inline-flex items-center gap-6 px-6 text-xs font-semibold text-slate-400 tracking-widest uppercase" key={`${c}-${gi}`}>
                {c} <span className="text-primary-400 text-[9px]">✦</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <p className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 tracking-widest uppercase mb-3">
          <TrendingUp size={11} /> Platform Features
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-slate-900 tracking-tight leading-tight max-w-lg">
          Built for real social impact
        </h2>
        <p className="text-base text-slate-500 leading-relaxed max-w-sm mt-3">
          Every feature designed to remove friction between goodwill and action.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="border border-slate-200 rounded-2xl p-7 hover:border-primary-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${f.bgClass}`}>
                <f.Icon size={20} className={f.colorClass} />
              </div>
              <h3 className="font-display text-lg text-slate-800 mb-2 tracking-tight">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* SOCIAL PROOF */}
      <div className="bg-slate-50 border-y border-slate-100 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { v: "10,000+", l: "Registered Volunteers" },
            { v: "500+",    l: "Partner NGOs" },
            { v: "85%",     l: "Placement Success Rate" },
            { v: "40+",     l: "Cause Categories" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-4xl text-primary-600">{s.v}</div>
              <div className="text-sm text-slate-500 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <p className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 tracking-widest uppercase mb-3">
          <Users size={11} /> How It Works
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-slate-900 tracking-tight leading-tight">
          Three steps to making a difference
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="px-7 py-7 border-t-2 border-slate-100 hover:border-primary-400 transition-colors duration-200"
            >
              <div className="font-display text-6xl text-slate-100 leading-none">{s.n}</div>
              <div className="font-display text-lg text-slate-800 mt-2.5">{s.title}</div>
              <p className="text-sm text-slate-400 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="px-6 pb-16">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-primary-50 to-white border border-primary-200 rounded-3xl p-12 md:p-16 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-100 border border-primary-200 text-primary-700 text-xs font-semibold mb-4">
            <Sparkles size={11} /> Join the Movement
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-slate-900 tracking-tight leading-tight max-w-lg mx-auto mt-3 mb-4">
            Ready to make a difference?
          </h2>
          <p className="text-base text-slate-500 leading-relaxed max-w-sm mx-auto mb-8">
            Join thousands of volunteers and hundreds of NGOs already creating lasting change together.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/register?role=volunteer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
            >
              Start as Volunteer <ArrowRight size={17} />
            </Link>
            <Link
              to="/register?role=ngo"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700 transition-all"
            >
              Register an NGO
            </Link>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2.5 no-underline mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
                <Heart size={13} className="text-white fill-white" />
              </div>
              <span className="font-display text-base text-slate-800">
                VolunteerMatch
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Connecting passionate volunteers with impactful NGOs through smart matching.
            </p>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-3">Quick Links</div>
            <div className="flex flex-col gap-2">
              {[['About', '#'], ['Contact', '#'], ['Privacy', '#']].map(([label, href]) => (
                <a key={label} href={href} className="text-sm text-slate-500 hover:text-primary-600 transition-colors">{label}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-3">Get Started</div>
            <div className="flex flex-col gap-2">
              <Link to="/register?role=volunteer" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Join as Volunteer</Link>
              <Link to="/register?role=ngo" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Register as NGO</Link>
              <Link to="/login" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Sign In</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-100 px-6 py-4">
          <div className="max-w-6xl mx-auto text-center text-xs text-slate-400">
            © 2026 VolunteerMatch · All rights reserved
          </div>
        </div>
      </footer>

    </div>
  );
}
