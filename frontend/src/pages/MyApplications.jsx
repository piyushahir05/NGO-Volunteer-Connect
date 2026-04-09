import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import { MapPin, Clock, Briefcase, CheckCircle, XCircle, Clock3, AlertCircle, Loader2, FileText } from 'lucide-react';

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

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchApplications() {
      try {
        // Fetch logic based on the backend routes structure.
        // Assuming there is an endpoint that returns the current user's applications
        const { data } = await api.get('/volunteer/applications');
        if (!cancelled) setApplications(data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load applications.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchApplications();
    return () => { cancelled = true; };
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold tracking-widest uppercase">
            <CheckCircle size={14} /> Accepted
          </div>
        );
      case 'rejected':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 border border-red-200 text-red-700 text-xs font-bold tracking-widest uppercase">
            <XCircle size={14} /> Rejected
          </div>
        );
      default: // pending
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold tracking-widest uppercase">
            <Clock3 size={14} /> Pending
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F9F6F0] overflow-hidden py-6 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Ambient Background Blobs */}
      <div className="fixed top-[0%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-emerald-300/20 blur-[100px] pointer-events-none mix-blend-multiply animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-teal-200/25 blur-[120px] pointer-events-none mix-blend-multiply animate-[pulse_10s_ease-in-out_infinite_reverse]" />
      
      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <h1 className="font-display text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <FileText className="text-emerald-500" size={28} />
            My Applications
          </h1>
          <p className="text-sm font-bold text-slate-500 mt-1">Track the status of opportunities you've applied for.</p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 h-[50vh]">
            <div className="relative w-12 h-12 flex items-center justify-center">
               <div className="absolute inset-0 rounded-full border-4 border-emerald-100"></div>
               <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
            </div>
            <span className="mt-4 text-xs font-bold tracking-widest text-emerald-600 uppercase">Loading Applications...</span>
          </div>
        ) : error ? (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-red-50/80 backdrop-blur-md border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-center gap-3 shadow-sm">
            <AlertCircle size={18} className="text-red-500" />
            <span className="font-medium">{error}</span>
          </motion.div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-4">
            <AnimatePresence>
              {applications.length > 0 ? applications.map((app) => (
                <motion.div key={app._id} variants={fadeUp} layout className={`${glassCardClass} flex flex-col md:flex-row p-6 gap-6 md:items-center justify-between`}>
                  
                  <div className="flex-1 space-y-3">
                    <h2 className="text-xl font-bold text-slate-800 leading-tight">
                      {app.opportunityId?.title || app.title || "Opportunity Details"}
                    </h2>
                    
                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                        <MapPin size={16} className="text-emerald-500" />
                        {app.opportunityId?.location || app.location || "Location not specified"}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                        <Clock size={16} className="text-blue-500" />
                        {app.opportunityId?.duration || app.duration || "Duration not specified"}
                      </div>
                      <div className="flex items-start gap-2 text-sm font-semibold text-slate-600">
                        <Briefcase size={16} className="text-amber-500" />
                        <span className="truncate max-w-[200px]">
                          {(app.opportunityId?.requiredSkills || app.requiredSkills || []).join(', ') || "No specific skills"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-3 shrink-0 border-t md:border-t-0 md:border-l border-slate-200/50 pt-4 md:pt-0 md:pl-6">
                    {getStatusBadge(app.status)}
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Applied: {new Date(app.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                </motion.div>
              )) : (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 bg-white/60 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-white">
                    <FileText size={24} className="text-emerald-300" />
                  </div>
                  <p className="text-slate-500 font-bold text-lg">You haven't applied to any opportunities yet.</p>
                  <p className="text-sm text-slate-400 font-medium mt-1">Head over to the Opportunities tab to find your match!</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}