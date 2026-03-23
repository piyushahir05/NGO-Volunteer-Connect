import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import {
  Heart, Clock, Calendar, Award, CheckCircle,
  ArrowRight, Users, Target, Trophy,
  Zap, BookOpen, User, Search, FileText, Briefcase,
  Loader2, Activity, LayoutDashboard, ShieldCheck, Sparkles
} from 'lucide-react';

/* ───── Animation Variants ───── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

/* ───── Dynamic Badge Generator ───── */
const generateBadges = (stats) => [
  { name: 'First Step', icon: Zap, desc: 'Submitted first app', earned: stats?.totalApplications > 0 },
  { name: 'Active Supporter', icon: Heart, desc: 'Supported 2+ causes', earned: stats?.causesSupported >= 2 },
  { name: 'Trusted Partner', icon: ShieldCheck, desc: 'Accepted to an event', earned: stats?.accepted >= 1 },
  { name: 'Team Player', icon: Users, desc: 'Accepted to 3+ events', earned: stats?.accepted >= 3 },
  { name: 'Impact Maker', icon: Target, desc: 'Applied to 10+ ops', earned: stats?.totalApplications >= 10 },
  { name: 'Century Club', icon: Trophy, desc: 'Outstanding dedication', earned: stats?.accepted >= 20 },
];

const QUICK_ACTIONS = [
  { to: '/volunteer/profile', icon: User, title: 'My Profile', desc: 'Keep your skills up to date.', cta: 'Edit profile' },
  { to: '/volunteer/opportunities', icon: Search, title: 'Discover', desc: 'Find matching causes.', cta: 'Browse now' },
  { to: '/volunteer/applications', icon: FileText, title: 'Applications', desc: 'Track your pipeline.', cta: 'View all' },
];

/* ───── Reusable Premium Glass Components ───── */
const glassCardClass = "bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_4px_24px_rgba(5,150,105,0.04)] rounded-[1.5rem] overflow-hidden";

function ProgressBar({ percent, color = 'bg-emerald-500' }) {
  return (
    <div className="h-2 w-full rounded-full bg-white/50 border border-white/30 overflow-hidden shadow-inner">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        className={`h-full rounded-full ${color} shadow-[0_0_8px_rgba(16,185,129,0.3)] relative overflow-hidden`} 
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </motion.div>
    </div>
  );
}

function SectionLabel({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 mb-4 ml-1">
      <div className="p-1 rounded-md bg-emerald-100/50 text-emerald-700 backdrop-blur-sm border border-emerald-200/50">
        {Icon && <Icon size={14} strokeWidth={2.5} />}
      </div>
      <h3 className="font-display text-base font-bold text-slate-800 tracking-tight">{children}</h3>
    </div>
  );
}

/* ───────────────── Main Component ───────────────── */
export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchStats() {
      try {
        const { data } = await api.get('/volunteer/dashboard-stats');
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load dashboard stats');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchStats();
    return () => { cancelled = true; };
  }, []);

  const userName = stats?.userName || user?.name || 'Volunteer';

  const impactStats = useMemo(() => stats ? [
    { label: 'Applications',       value: stats.totalApplications || 0, icon: FileText, color: 'text-blue-600',  bg: 'bg-blue-100/50',  border: 'border-blue-200/50' },
    { label: 'Accepted',           value: stats.accepted || 0,          icon: Calendar, color: 'text-emerald-600',bg: 'bg-emerald-100/50',border: 'border-emerald-200/50' },
    { label: 'Causes Supported',   value: stats.causesSupported || 0,   icon: Heart,    color: 'text-rose-600',   bg: 'bg-rose-100/50',  border: 'border-rose-200/50' },
    { label: 'Pending Reviews',    value: stats.pending || 0,           icon: Clock,    color: 'text-amber-600',  bg: 'bg-amber-100/50', border: 'border-amber-200/50' },
  ] : [], [stats]);

  const applicationStats = useMemo(() => stats ? [
    { label: 'Sent',     value: stats.totalApplications || 0, color: 'bg-slate-400' },
    { label: 'Accepted', value: stats.accepted || 0,          color: 'bg-emerald-500' },
    { label: 'Pending',  value: stats.pending || 0,           color: 'bg-amber-400' },
    { label: 'Declined', value: stats.rejected || 0,          color: 'bg-slate-300' },
  ] : [], [stats]);

  const totalApps = stats?.totalApplications || 0;
  const userBadges = useMemo(() => generateBadges(stats), [stats]);
  const earnedBadgesCount = userBadges.filter(b => b.earned).length;

  return (
    <div className="relative min-h-screen bg-[#F9F6F0] overflow-hidden py-6 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* ── Ambient Background Orbs (Scaled Down) ── */}
      <div className="fixed top-[-5%] left-[-5%] w-[30vw] h-[30vw] rounded-full bg-emerald-300/20 blur-[100px] pointer-events-none mix-blend-multiply animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="fixed bottom-[-5%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-teal-200/25 blur-[120px] pointer-events-none mix-blend-multiply animate-[pulse_10s_ease-in-out_infinite_reverse]" />
      <div className="fixed top-[15%] right-[10%] w-[20vw] h-[20vw] rounded-full bg-amber-100/30 blur-[80px] pointer-events-none mix-blend-multiply" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        
        {/* ── Loading / Error States ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 h-[50vh]">
            <div className="relative w-12 h-12 flex items-center justify-center">
               <div className="absolute inset-0 rounded-full border-4 border-emerald-100"></div>
               <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
            </div>
            <span className="mt-4 text-xs font-bold tracking-widest text-emerald-600 uppercase">Synchronizing...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50/80 backdrop-blur-md border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-center gap-3 shadow-sm">
            <Activity size={18} className="text-red-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {stats && (
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer} 
            className="space-y-8"
          >
            {/* ── Hero Glass Panel ── */}
            <motion.div variants={fadeUp} className={`${glassCardClass} p-6 md:p-8 relative group`}>
              <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none">
                <Sparkles size={80} className="text-emerald-600" />
              </div>
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/50 border border-white/60 shadow-sm text-emerald-700 text-[10px] font-bold tracking-widest uppercase mb-4 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Volunteer Portal
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-[1.15] mb-2">
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">{userName}.</span>
                </h1>
                <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed">
                  You have <strong className="text-slate-800">{stats.accepted} accepted application{stats.accepted !== 1 ? 's' : ''}</strong>. Your energy is shaping a better tomorrow.
                </p>
              </div>
            </motion.div>

            {/* ── Impact Stats Grid ── */}
            <motion.section variants={fadeUp}>
              <SectionLabel icon={Activity}>Impact Overview</SectionLabel>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {impactStats.map((s) => (
                  <div key={s.label} className={`${glassCardClass} p-5 flex flex-col items-start gap-3 hover:-translate-y-0.5 transition-transform duration-300 group cursor-default`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border backdrop-blur-md transition-colors duration-300 ${s.bg} ${s.border} group-hover:bg-white`}>
                      <s.icon size={18} className={s.color} />
                    </div>
                    <div>
                      <div className="text-2xl md:text-3xl font-display font-extrabold text-slate-800 leading-none mb-1.5 tracking-tight">{s.value}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* ── Pipeline & Badges (Two Column Layout) ── */}
            <motion.div variants={staggerContainer} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Pipeline Widget */}
              <motion.section variants={fadeUp} className={`lg:col-span-5 ${glassCardClass} p-6 flex flex-col`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-display font-bold text-slate-800 flex items-center gap-2">
                    <Briefcase size={18} className="text-emerald-600" /> Pipeline
                  </h2>
                </div>
                
                <div className="space-y-4 flex-1">
                  {applicationStats.map((a) => (
                    <div key={a.label} className="flex items-center gap-3 group">
                      <span className="w-16 text-xs font-bold text-slate-500 group-hover:text-slate-800 transition-colors">{a.label}</span>
                      <div className="flex-1">
                        <ProgressBar percent={totalApps ? (a.value / totalApps) * 100 : 0} color={a.color} />
                      </div>
                      <span className="text-sm font-display font-bold text-slate-800 w-6 text-right">{a.value}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-start gap-2.5 text-xs text-slate-600 font-medium bg-white/30 p-3 rounded-xl border border-white/50">
                  <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="text-slate-800 text-sm">{stats.accepted}</strong> of {stats.totalApplications} accepted. Keep applying!
                  </p>
                </div>
              </motion.section>

              {/* Achievements Widget */}
              <motion.section variants={fadeUp} className={`lg:col-span-7 ${glassCardClass} p-6 flex flex-col`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-display font-bold text-slate-800 flex items-center gap-2">
                    <Award size={18} className="text-amber-500" /> Milestones
                  </h2>
                  <div className="px-3 py-1 rounded-full bg-white/60 border border-white/80 shadow-sm backdrop-blur-md">
                    <span className="text-[10px] font-extrabold text-slate-700 tracking-widest uppercase">
                      <span className="text-emerald-600">{earnedBadgesCount}</span> / {userBadges.length} Unlocked
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
                  {userBadges.map((b) => (
                    <div
                      key={b.name}
                      className={`relative flex flex-col items-center text-center p-4 rounded-xl border backdrop-blur-md transition-all duration-500 ${
                        b.earned
                          ? 'bg-white/60 border-white/80 shadow-sm shadow-emerald-900/5 hover:-translate-y-0.5'
                          : 'bg-white/20 border-white/30 opacity-60 grayscale hover:grayscale-0 hover:opacity-100'
                      }`}
                    >
                      {b.earned && (
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-md border-2 border-white z-10">
                          <CheckCircle size={10} className="text-white" strokeWidth={3} />
                        </span>
                      )}
                      <div className={`p-2.5 rounded-xl mb-2.5 ${b.earned ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        <b.icon size={20} strokeWidth={2} />
                      </div>
                      <span className="text-xs font-extrabold text-slate-800 leading-tight mb-1">{b.name}</span>
                      <span className="text-[10px] text-slate-500 font-medium leading-tight px-1">{b.desc}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            </motion.div>

            {/* ── Platform Navigation ── */}
            <motion.section variants={fadeUp}>
              <SectionLabel icon={LayoutDashboard}>Navigation</SectionLabel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {QUICK_ACTIONS.map((c) => (
                  <Link
                    key={c.to}
                    to={c.to}
                    className={`${glassCardClass} p-5 flex flex-col gap-3 group hover:bg-white/60 hover:border-emerald-200/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/50 border border-white/60 shadow-sm flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500 text-emerald-700">
                      <c.icon size={20} strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-base font-display font-bold text-slate-800 mb-1">{c.title}</div>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">{c.desc}</p>
                    </div>
                    <div className="mt-auto pt-3 border-t border-slate-200/40 flex items-center justify-between text-xs font-bold text-emerald-600">
                      <span>{c.cta}</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>

            {/* ── Footer Call to Action ── */}
            <motion.div variants={fadeUp} className={`${glassCardClass} p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-br from-white/40 to-emerald-50/40`}>
              <div className="flex items-center gap-5">
                <div className="hidden sm:flex w-12 h-12 rounded-full bg-emerald-100/80 border border-emerald-200/80 items-center justify-center shrink-0 shadow-inner">
                  <BookOpen size={24} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-800 mb-1">Ready to make a bigger impact?</h3>
                  <p className="text-xs text-slate-600 font-medium">Explore new causes and connect with organizations.</p>
                </div>
              </div>
              <Link 
                to="/volunteer/opportunities" 
                className="w-full md:w-auto px-6 py-3 bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-emerald-700 hover:shadow-md hover:shadow-emerald-600/20 transition-all duration-300 text-center whitespace-nowrap"
              >
                Find Opportunities
              </Link>
            </motion.div>

          </motion.div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}