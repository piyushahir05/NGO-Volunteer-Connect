import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles, BrainCircuit, CheckCircle, Clock,
  FileText, Briefcase, Activity, BookHeart,
  Star, Plus, X, Award, MessageSquare
} from 'lucide-react';

/* ───── Animation Variants ───── */
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

/* ───── Premium Glass Classes ───── */
const glassCardClass = "bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_4px_24px_rgba(5,150,105,0.04)] rounded-[1.5rem] overflow-hidden";
const glassHoverClass = "hover:bg-white/60 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(5,150,105,0.08)] hover:-translate-y-0.5";
const inputClass = "w-full bg-white/50 border border-white/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors";

export default function VolunteerDashboard() {
  const { user } = useAuth();

  // Data States
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ total: 0, accepted: 0, pending: 0 });
  const [applications, setApplications] = useState([]);
  const [smartMatches, setSmartMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Memories & Feedback Feature States
  const [memories, setMemories] = useState([]);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [newMemory, setNewMemory] = useState({ opportunityId: '', opportunityTitle: '', rating: 5, text: '' });

  useEffect(() => {
    let cancelled = false;

    async function fetchDashboardData() {
      try {
        // 1. Fetch Standard Backend Data (Node.js)
        const [profileRes, appsRes, oppsRes, memoriesRes] = await Promise.all([
          api.get('/volunteer/profile').catch(() => ({ data: {} })),
          api.get('/volunteer/applications').catch(() => ({ data: [] })),
          api.get('/opportunities').catch(() => ({ data: [] })),
          api.get('/volunteer/memories').catch(() => ({ data: [] }))
        ]);

        if (cancelled) return;

        const profileData = profileRes.data;
        const apps = appsRes.data || [];
        const opps = oppsRes.data || [];
        const dbMemories = memoriesRes.data || [];

        setProfile(profileData);
        setApplications(apps);
        setMemories(dbMemories);

        setStats({
          total: apps.length,
          accepted: apps.filter(a => a.status?.toLowerCase() === 'accepted').length,
          pending: apps.filter(a => a.status?.toLowerCase() === 'pending').length,
        });

        // 2. 🚀 Python FastAPI ML Recommendation Call (Port 8000) 🚀
        try {
          const userSkills = profileData.skills ?
            (Array.isArray(profileData.skills) ? profileData.skills : profileData.skills.split(','))
              .map(s => s.trim().toLowerCase()).filter(Boolean) : [];

          // Format payload strictly to match Python's RecommendOpportunitiesRequest
          const mlPayload = {
            skills: userSkills,
            opportunities: opps.map(opp => ({
              id: opp._id.toString(),
              requiredSkills: opp.requiredSkills || []
            }))
          };

          // Replace the hardcoded fetch with an environment variable
          const mlBaseUrl = import.meta.env.VITE_ML_API_URL || 'http://localhost:8000';
          const mlRes = await fetch(`${mlBaseUrl}/recommend/opportunities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mlPayload)
          });

          if (!mlRes.ok) throw new Error(`ML Server returned ${mlRes.status}`);

          const recommendations = await mlRes.json(); // Array of { id, matchScore }

          // Filter out applied opportunities and map full details back
          const appliedOppIds = new Set(apps.map(app => app.opportunityId?._id || app.opportunityId));
          const rankedOpps = recommendations
            .filter(rec => !appliedOppIds.has(rec.id) && rec.matchScore > 0.1) // Minimum threshold
            .map(rec => {
              const fullOpp = opps.find(o => o._id === rec.id);
              // Convert decimal score to percentage if needed
              const displayScore = rec.matchScore <= 1 ? Math.round(rec.matchScore * 100) : Math.round(rec.matchScore);
              return fullOpp ? { ...fullOpp, matchScore: displayScore } : null;
            })
            .filter(Boolean)
            .sort((a, b) => b.matchScore - a.matchScore);

          setSmartMatches(rankedOpps.slice(0, 3));
        } catch (mlErr) {
          console.error("ML Service Error: Make sure uvicorn is running on port 8000. ", mlErr);
          setSmartMatches([]); // Fail gracefully
        }

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDashboardData();
    return () => { cancelled = true; };
  }, [user._id]);

  // Save Memory to MongoDB via Node.js
  const handleSaveMemory = async (e) => {
    e.preventDefault();
    if (!newMemory.text.trim() || !newMemory.opportunityId) return;

    try {
      const memoryPayload = {
        opportunityId: newMemory.opportunityId,
        opportunityTitle: newMemory.opportunityTitle,
        rating: newMemory.rating,
        text: newMemory.text,
        date: new Date().toISOString()
      };

      const res = await api.post('/volunteer/memories', memoryPayload);
      setMemories([res.data || memoryPayload, ...memories]);
      setNewMemory({ opportunityId: '', opportunityTitle: '', rating: 5, text: '' });
      setIsMemoryModalOpen(false);
    } catch (err) {
      console.error("Failed to save memory", err);
      alert("Failed to save memory. Please check your backend.");
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return 'text-emerald-600 bg-emerald-100 border-emerald-200';
      case 'rejected': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-amber-600 bg-amber-100 border-amber-200';
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F9F6F0] overflow-hidden py-6 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-200 selection:text-emerald-900">

      {/* Background Ambience */}
      <div className="fixed top-[0%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-emerald-300/20 blur-[100px] pointer-events-none mix-blend-multiply animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-teal-200/25 blur-[120px] pointer-events-none mix-blend-multiply animate-[pulse_10s_ease-in-out_infinite_reverse]" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
              {greeting()}, {user?.name?.split(' ')[0]}! <Sparkles className="text-emerald-500 animate-pulse" size={28} />
            </h1>
            <p className="text-sm sm:text-base font-bold text-slate-500 mt-1.5">
              Welcome back to your dashboard. Here's your impact overview.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/volunteer/messages"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-emerald-200 text-emerald-700 font-bold rounded-xl shadow-sm hover:bg-emerald-50 transition"
            >
              <MessageSquare size={18} /> Messages
            </Link>

            <Link
              to="/volunteer/opportunities"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
            >
              <Briefcase size={18} /> Find Opportunities
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8">

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <motion.div variants={fadeUp} className={`${glassCardClass} p-6 flex items-center gap-4`}>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-0.5">Total Applied</p>
                  <p className="text-2xl font-black text-slate-800">{stats.total}</p>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className={`${glassCardClass} p-6 flex items-center gap-4`}>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-0.5">Accepted Roles</p>
                  <p className="text-2xl font-black text-slate-800">{stats.accepted}</p>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className={`${glassCardClass} p-6 flex items-center gap-4`}>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-0.5">Pending</p>
                  <p className="text-2xl font-black text-slate-800">{stats.pending}</p>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className={`${glassCardClass} p-6 flex items-center gap-4 border-teal-200/50 bg-gradient-to-br from-teal-50 to-emerald-50`}>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white shrink-0 shadow-inner">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-teal-700 uppercase tracking-widest mb-0.5">Impact Memories</p>
                  <p className="text-2xl font-black text-slate-800 flex items-baseline gap-1">
                    {memories.length} <span className="text-xs font-bold text-teal-600 ml-1">Logs</span>
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Smart Matches (ML Output) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-extrabold text-slate-800 flex items-center gap-2">
                  <BrainCircuit className="text-emerald-500" size={22} /> Smart Matches
                </h2>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Powered by ML TF-IDF</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {smartMatches.length > 0 ? smartMatches.map(opp => (
                  <motion.div key={opp._id} variants={fadeUp} className={`${glassCardClass} ${glassHoverClass} p-5 flex flex-col relative`}>
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md text-[10px] font-bold border border-emerald-200 shadow-sm">
                      <Sparkles size={12} /> {opp.matchScore}% Match
                    </div>

                    <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2 pr-20 line-clamp-2">{opp.title}</h3>
                    <p className="text-sm font-medium text-slate-500 line-clamp-2 mb-4 flex-1">
                      {opp.description || "Highly recommended based on your skills."}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {opp.requiredSkills?.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-white/60 border border-white/80 text-slate-600 rounded text-[9px] font-bold uppercase tracking-wider">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <Link to="/volunteer/opportunities" className="w-full py-2.5 bg-white/60 border border-white/80 hover:border-emerald-500 hover:text-emerald-700 text-slate-700 text-sm font-bold rounded-xl text-center transition-all shadow-sm">
                      Review Opportunity
                    </Link>
                  </motion.div>
                )) : (
                  <div className={`${glassCardClass} col-span-3 p-8 text-center`}>
                    <BrainCircuit className="mx-auto text-slate-300 mb-3" size={32} />
                    <p className="text-slate-600 font-bold">Waiting for ML recommendations...</p>
                    <p className="text-sm text-slate-500 mt-1">Make sure you have skills added to your profile to get matches!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Impact Journal & Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Journal */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-display font-extrabold text-slate-800 flex items-center gap-2">
                    <BookHeart className="text-rose-500" size={20} /> Impact Journal
                  </h2>
                  <button
                    onClick={() => setIsMemoryModalOpen(true)}
                    className="text-xs font-bold bg-white/60 border border-white/80 text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors shadow-sm"
                  >
                    <Plus size={14} /> Log Memory
                  </button>
                </div>

                <div className={`${glassCardClass} p-4 min-h-[300px]`}>
                  {memories.length > 0 ? (
                    <div className="space-y-3">
                      {memories.slice(0, 3).map((mem, idx) => (
                        <motion.div key={mem._id || idx} variants={fadeUp} className="bg-white/50 border border-white/80 p-4 rounded-xl shadow-sm backdrop-blur-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-slate-800 text-sm">{mem.opportunityTitle || 'Activity'}</h4>
                            <div className="flex text-amber-400">
                              {[...Array(mem.rating || 5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 italic">"{mem.text}"</p>
                          <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">
                            {new Date(mem.date || mem.createdAt).toLocaleDateString()}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-60">
                      <BookHeart size={40} className="text-rose-300 mb-3" />
                      <p className="text-sm font-bold text-slate-600 mb-1">Your journal is empty.</p>
                      <p className="text-xs text-slate-500">Log memories for activities you've participated in.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Feed */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-display font-extrabold text-slate-800 flex items-center gap-2">
                    <Activity className="text-blue-500" size={20} /> Application History
                  </h2>
                  <Link to="/volunteer/applications" className="text-xs font-bold text-slate-500 hover:text-emerald-600 uppercase tracking-widest transition-colors">
                    View All
                  </Link>
                </div>

                <div className={`${glassCardClass} p-1 h-[300px] overflow-y-auto custom-scrollbar`}>
                  {applications.length > 0 ? (
                    <div className="divide-y divide-slate-200/50">
                      {applications.slice(0, 5).map((app) => (
                        <motion.div key={app._id} variants={fadeUp} className="p-5 hover:bg-white/50 transition-colors flex flex-col gap-2">
                          <h4 className="font-bold text-slate-800 text-sm line-clamp-1">
                            {app.opportunityId?.title || app.title || "Opportunity Application"}
                          </h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(app.status)}`}>
                              {app.status || 'Pending'}
                            </span>
                            <span className="text-xs font-bold text-slate-400">
                              {new Date(app.createdAt || Date.now()).toLocaleDateString()}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-60">
                      <FileText className="text-slate-300 mb-3" size={40} />
                      <p className="text-sm font-bold text-slate-600">No applications yet.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </div>

      {/* Memory Modal */}
      <AnimatePresence>
        {isMemoryModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#F9F6F0] rounded-2xl shadow-2xl w-full max-w-md border border-white overflow-hidden"
            >
              <div className="flex justify-between items-center p-5 border-b border-slate-200/50 bg-white/40">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                  <BookHeart className="text-rose-500" size={20} /> Log Activity Memory
                </h3>
                <button onClick={() => setIsMemoryModalOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors"><X size={20} /></button>
              </div>

              <form onSubmit={handleSaveMemory} className="p-5 space-y-5">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Select Your Activity</label>
                  {applications.length > 0 ? (
                    <select
                      required
                      value={newMemory.opportunityId}
                      onChange={(e) => setNewMemory({
                        ...newMemory,
                        opportunityId: e.target.value,
                        opportunityTitle: e.target.options[e.target.selectedIndex].text
                      })}
                      className={inputClass}
                    >
                      <option value="" disabled>Choose an applied opportunity...</option>
                      {applications.map(app => (
                        <option key={app._id} value={app.opportunityId?._id || app._id}>
                          {app.opportunityId?.title || app.title || "Unknown Activity"}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-sm text-rose-600 font-medium">
                      You must apply to an opportunity first before logging a memory.
                    </div>
                  )}
                </div>

                {applications.length > 0 && (
                  <>
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Experience Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewMemory({ ...newMemory, rating: star })}
                            className={`p-2 rounded-xl transition-all ${newMemory.rating >= star ? 'text-amber-500 bg-amber-50 shadow-sm border border-amber-100' : 'text-slate-300 hover:text-amber-300'}`}
                          >
                            <Star size={24} fill={newMemory.rating >= star ? 'currentColor' : 'none'} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Reflection / Feedback</label>
                      <textarea
                        required
                        rows="4"
                        placeholder="What did you learn? How was the experience?"
                        value={newMemory.text}
                        onChange={(e) => setNewMemory({ ...newMemory, text: e.target.value })}
                        className={`${inputClass} resize-none`}
                      ></textarea>
                    </div>

                    <button type="submit" className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20">
                      Save to Database
                    </button>
                  </>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}