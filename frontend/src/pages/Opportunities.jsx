import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Clock, Briefcase, Search, Sparkles, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

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
const glassCardClass = "bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_4px_24px_rgba(5,150,105,0.04)] rounded-[1.5rem] overflow-hidden hover:bg-white/50 transition-colors duration-300";
const glassInputClass = "w-full bg-white/50 border border-white/80 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/90 transition-all backdrop-blur-sm shadow-inner placeholder:text-slate-400";

export default function Opportunities() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [applying, setApplying] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchOpportunities() {
      try {
        const { data } = await api.get('/opportunities');
        if (!cancelled) setOpportunities(data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load opportunities.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchOpportunities();
    return () => { cancelled = true; };
  }, []);

  const handleApply = async (id) => {
    setApplying(id);
    try {
      await api.post(`/opportunities/${id}/apply`);
      setOpportunities(opportunities.map(opp =>
        opp._id === id
          ? { ...opp, hasApplied: true, applicants: [...(opp.applicants || []), { volunteerId: user._id }] }
          : opp
      ));
    } catch (err) {
      alert(err.message || 'Failed to apply.');
    } finally {
      setApplying(null);
    }
  };

  const filteredOpportunities = opportunities.filter(opp =>
    opp.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opp.requiredSkills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="relative min-h-screen bg-[#F9F6F0] overflow-hidden py-6 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-200 selection:text-emerald-900">

      {/* Ambient Background Blobs */}
      <div className="fixed top-[0%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-emerald-300/20 blur-[100px] pointer-events-none mix-blend-multiply animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-teal-200/25 blur-[120px] pointer-events-none mix-blend-multiply animate-[pulse_10s_ease-in-out_infinite_reverse]" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">

        {/* Header & Search */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <Sparkles className="text-emerald-500" size={28} />
              Discover Opportunities
            </h1>
            <p className="text-sm font-bold text-slate-500 mt-1">Find causes that match your skills and passion.</p>
          </div>

          <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={glassInputClass}
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 h-[50vh]">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
            </div>
            <span className="mt-4 text-xs font-bold tracking-widest text-emerald-600 uppercase">Loading Opportunities...</span>
          </div>
        ) : error ? (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-red-50/80 backdrop-blur-md border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-center gap-3 shadow-sm">
            <AlertCircle size={18} className="text-red-500" />
            <span className="font-medium">{error}</span>
          </motion.div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredOpportunities.length > 0 ? filteredOpportunities.map((opp) => {
                const hasApplied = opp.hasApplied || opp.applicants?.some(a => a.volunteerId === user?._id);
                return (
                  <motion.div key={opp._id} variants={fadeUp} layout className={`${glassCardClass} flex flex-col p-6`}>
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h2 className="text-xl font-extrabold text-emerald-700 leading-tight">
                            {opp.ngoName || 'NGO'}
                          </h2>

                          <p className="text-base font-semibold text-slate-700 mt-1">
                            {opp.title}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-slate-600 line-clamp-3">
                        {opp.description || "No description provided."}
                      </p>

                      <div className="space-y-2 pt-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                          <MapPin size={16} className="text-emerald-500" />
                          {opp.location || "Location not specified"}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                          <Clock size={16} className="text-blue-500" />
                          {opp.duration || "Duration not specified"}
                        </div>
                        <div className="flex items-start gap-2 text-sm font-semibold text-slate-600">
                          <Briefcase size={16} className="text-amber-500 mt-0.5" />
                          <div className="flex flex-wrap gap-1.5">
                            {opp.requiredSkills?.length > 0 ? (
                              opp.requiredSkills.map((skill, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-white/60 border border-white/80 rounded-md text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                                  {skill}
                                </span>
                              ))
                            ) : (
                              <span>No specific skills</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200/50">
                      <button
                        onClick={() => handleApply(opp._id)}
                        disabled={hasApplied || applying === opp._id}
                        className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${hasApplied
                            ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed border border-emerald-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20 hover:shadow-md'
                          }`}
                      >
                        {applying === opp._id ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : hasApplied ? (
                          <>
                            <CheckCircle size={18} /> Applied
                          </>
                        ) : (
                          'Apply Now'
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              }) : (
                <div className="col-span-full py-12 text-center">
                  <p className="text-slate-500 font-bold text-lg">No opportunities found matching your criteria.</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}