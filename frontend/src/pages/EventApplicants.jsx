import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import {
  ArrowLeft, Users, CheckCircle, XCircle,
  Clock, Loader2, Inbox, Sparkles, Mail, User
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const glassCardClass = "bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_4px_24px_rgba(5,150,105,0.04)] rounded-[1.5rem] overflow-hidden";

const statusConfig = {
  Pending:  { bg: 'bg-amber-50/70 border-amber-200/80 text-amber-700',  icon: <Clock size={12} />,       dot: 'bg-amber-400' },
  Accepted: { bg: 'bg-emerald-50/70 border-emerald-200/80 text-emerald-700', icon: <CheckCircle size={12} />, dot: 'bg-emerald-500' },
  Rejected: { bg: 'bg-red-50/70 border-red-200/80 text-red-700',        icon: <XCircle size={12} />,     dot: 'bg-red-400' },
};

function SkeletonRow() {
  return (
    <div className="bg-white/30 backdrop-blur-md border border-white/60 rounded-[1.5rem] p-5 flex items-center gap-4 pointer-events-none">
      <div className="w-11 h-11 rounded-full bg-white/60 animate-pulse flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 rounded-full bg-white/60 animate-pulse w-1/3" />
        <div className="h-3 rounded-full bg-white/60 animate-pulse w-1/2" />
      </div>
      <div className="h-7 w-20 rounded-full bg-white/60 animate-pulse" />
    </div>
  );
}

export default function EventApplicants() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    api.get('/ngo/opportunities')
      .then((res) => {
        const opp = res.data.find((o) => o._id === eventId);
        setEvent(opp);
        if (opp) setApplicants(opp.applicants || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [eventId]);

  const updateStatus = async (applicantId, status) => {
    setUpdating(applicantId);
    try {
      await api.put(`/opportunities/${eventId}/applicants/${applicantId}/status`, { status });
      setApplicants((prev) =>
        prev.map((a) => (a._id === applicantId ? { ...a, status } : a))
      );
    } catch {
      // keep UI as is
    } finally {
      setUpdating(null);
    }
  };

  const accepted = applicants.filter((a) => a.status === 'Accepted').length;
  const pending  = applicants.filter((a) => a.status === 'Pending').length;
  const rejected = applicants.filter((a) => a.status === 'Rejected').length;

  return (
    <div className="relative min-h-screen bg-[#F9F6F0] overflow-hidden py-6 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-200 selection:text-emerald-900">

      {/* Ambient blobs */}
      <div className="fixed top-[0%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-emerald-300/20 blur-[100px] pointer-events-none mix-blend-multiply animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-teal-200/25 blur-[120px] pointer-events-none mix-blend-multiply animate-[pulse_10s_ease-in-out_infinite_reverse]" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">

        {/* ── Loading ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 h-[50vh]">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
            </div>
            <span className="mt-4 text-xs font-bold tracking-widest text-emerald-600 uppercase">Loading Applicants...</span>
          </div>

        ) : !event ? (
          // ── Not Found ──
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className={`${glassCardClass} p-14 text-center`}>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-center mx-auto mb-4">
              <Inbox size={26} className="text-emerald-600" />
            </div>
            <div className="text-base font-bold text-slate-800 mb-1">Event not found</div>
            <p className="text-sm text-slate-400 mb-6">This event may have been removed or doesn't exist.</p>
            <button
              type="button"
              onClick={() => navigate('/ngo/events')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-500/20"
            >
              <ArrowLeft size={15} /> Back to Events
            </button>
          </motion.div>

        ) : (
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">

            {/* ── Header Card ── */}
            <motion.div variants={fadeUp} className={`${glassCardClass} p-6 md:p-8 relative`}>
              <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                <Sparkles size={80} className="text-emerald-600" />
              </div>
              <div className="relative z-10">
                <button
                  type="button"
                  onClick={() => navigate('/ngo/events')}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-900 mb-4 transition-colors"
                >
                  <ArrowLeft size={15} /> Back to Events
                </button>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 border border-white/80 shadow-sm text-emerald-700 text-[10px] font-bold tracking-widest uppercase mb-3 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Event Applicants
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight mb-1">
                  {event.title}
                </h1>
                <p className="text-slate-500 text-sm font-medium">Review and manage applications for this event.</p>
              </div>
            </motion.div>

            {/* ── Stats Row ── */}
            <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total',    value: applicants.length, color: 'text-slate-700',   bg: 'bg-white/40' },
                { label: 'Pending',  value: pending,           color: 'text-amber-700',   bg: 'bg-amber-50/50' },
                { label: 'Accepted', value: accepted,          color: 'text-emerald-700', bg: 'bg-emerald-50/50' },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className={`${bg} backdrop-blur-md border border-white/60 rounded-2xl p-4 text-center`}>
                  <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">{label}</div>
                </div>
              ))}
            </motion.div>

            {/* ── Applicants List ── */}
            <motion.div variants={fadeUp}>
              <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-3">
                {applicants.length} {applicants.length === 1 ? 'applicant' : 'applicants'}
              </p>

              <div className="flex flex-col gap-3">
                {applicants.length === 0 ? (
                  <div className={`${glassCardClass} p-14 text-center`}>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-center mx-auto mb-4">
                      <Users size={26} className="text-emerald-600" />
                    </div>
                    <div className="text-base font-bold text-slate-800 mb-1">No applications yet</div>
                    <p className="text-sm text-slate-400">Volunteers who apply will appear here.</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {applicants.map((app) => {
                      const cfg = statusConfig[app.status] || statusConfig.Pending;
                      const isUpdating = updating === app._id;
                      const initials = (app.volunteerId?.name || 'V')
                        .split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

                      return (
                        <motion.div
                          key={app._id}
                          variants={fadeUp}
                          className={`${glassCardClass} p-5 flex flex-wrap items-center justify-between gap-4`}
                        >
                          {/* Avatar + Info */}
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-extrabold flex-shrink-0 shadow-sm">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 truncate">
                                {app.volunteerId?.name || 'Volunteer'}
                              </p>
                              <p className="text-xs text-slate-400 font-medium flex items-center gap-1 truncate">
                                <Mail size={11} className="text-emerald-500 flex-shrink-0" />
                                {app.volunteerId?.email || '—'}
                              </p>
                            </div>
                          </div>

                          {/* Status + Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${cfg.bg}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                              {app.status}
                            </span>

                            {app.status === 'Pending' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => updateStatus(app._id, 'Accepted')}
                                  disabled={isUpdating}
                                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm shadow-emerald-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                  {isUpdating
                                    ? <Loader2 size={13} className="animate-spin" />
                                    : <CheckCircle size={13} />}
                                  Accept
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateStatus(app._id, 'Rejected')}
                                  disabled={isUpdating}
                                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/60 border border-red-200/80 text-red-600 text-xs font-bold hover:bg-red-50/80 transition-all disabled:opacity-60 disabled:cursor-not-allowed backdrop-blur-md"
                                >
                                  {isUpdating
                                    ? <Loader2 size={13} className="animate-spin" />
                                    : <XCircle size={13} />}
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>

          </motion.div>
        )}
      </div>
    </div>
  );
}