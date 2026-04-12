import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import {
  MessageSquare, Search, Inbox, Sparkles,
  ArrowLeft, Mail, Clock
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const glassCardClass = "bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_4px_24px_rgba(5,150,105,0.04)] rounded-[1.5rem] overflow-hidden";

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function SkeletonRow() {
  return (
    <div className="bg-white/30 backdrop-blur-md border border-white/60 rounded-[1.5rem] p-4 flex items-center gap-4 pointer-events-none">
      <div className="w-12 h-12 rounded-full bg-white/60 animate-pulse flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 rounded-full bg-white/60 animate-pulse w-1/3" />
        <div className="h-3 rounded-full bg-white/60 animate-pulse w-2/3" />
      </div>
      <div className="h-3 w-12 rounded-full bg-white/60 animate-pulse" />
    </div>
  );
}

export default function NGOMessages() {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');

  useEffect(() => {
    api.get('/messages/ngo/conversations')
      .then((res) => setVolunteers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = volunteers.filter((v) =>
    v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-[#F9F6F0] overflow-hidden py-6 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-200 selection:text-emerald-900">

      {/* Ambient blobs */}
      <div className="fixed top-[0%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-emerald-300/20 blur-[100px] pointer-events-none mix-blend-multiply animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-teal-200/25 blur-[120px] pointer-events-none mix-blend-multiply animate-[pulse_10s_ease-in-out_infinite_reverse]" />

      <div className="relative z-10 max-w-2xl mx-auto space-y-6">

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
            </div>
            <span className="mt-4 text-xs font-bold tracking-widest text-emerald-600 uppercase">Loading Conversations...</span>
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">

            {/* Header */}
            <motion.div variants={fadeUp} className={`${glassCardClass} p-6 md:p-8 relative`}>
              <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                <Sparkles size={80} className="text-emerald-600" />
              </div>
              <div className="relative z-10">
                <button
                  onClick={() => navigate('/ngo')}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-900 mb-4 transition-colors"
                >
                  <ArrowLeft size={15} /> Back to Dashboard
                </button>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 border border-white/80 shadow-sm text-emerald-700 text-[10px] font-bold tracking-widest uppercase mb-3 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Messages
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight mb-1">Volunteer Conversations</h1>
                <p className="text-slate-500 text-sm font-medium">Message volunteers who applied to your events.</p>
              </div>
            </motion.div>

            {/* Search */}
            <motion.div variants={fadeUp} className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/50 border border-white/80 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/90 transition-all backdrop-blur-sm placeholder:text-slate-400"
              />
            </motion.div>

            {/* Count */}
            <motion.p variants={fadeUp} className="text-xs font-bold text-slate-400 tracking-widest uppercase">
              {filtered.length} {filtered.length === 1 ? 'volunteer' : 'volunteers'}
            </motion.p>

            {/* List */}
            <div className="flex flex-col gap-3">
              {filtered.length === 0 ? (
                <motion.div variants={fadeUp} className={`${glassCardClass} p-14 text-center`}>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-center mx-auto mb-4">
                    <Inbox size={26} className="text-emerald-600" />
                  </div>
                  <div className="text-base font-bold text-slate-800 mb-1">No conversations yet</div>
                  <p className="text-sm text-slate-400">Volunteers who apply to your events will appear here.</p>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {filtered.map((v) => {
                    const initials = (v.name || 'V').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
                    return (
                      <motion.button
                        key={v._id}
                        variants={fadeUp}
                        onClick={() => navigate(`/ngo/messages/${v._id}`)}
                        className={`${glassCardClass} p-4 flex items-center gap-4 w-full text-left hover:border-emerald-200/80 hover:shadow-md transition-all duration-300 group`}
                      >
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-extrabold shadow-sm">
                            {initials}
                          </div>
                          {v.unread > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
                              {v.unread}
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-sm font-bold truncate ${v.unread > 0 ? 'text-slate-900' : 'text-slate-700'}`}>
                              {v.name || 'Volunteer'}
                            </p>
                            {v.latestAt && (
                              <span className="text-[11px] text-slate-400 font-medium flex-shrink-0 flex items-center gap-1">
                                <Clock size={10} /> {timeAgo(v.latestAt)}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 font-medium flex items-center gap-1 truncate mt-0.5">
                            <Mail size={10} className="text-emerald-500 flex-shrink-0" />
                            {v.email}
                          </p>
                          {v.latestMessage && (
                            <p className={`text-xs mt-1 truncate ${v.unread > 0 ? 'text-slate-700 font-semibold' : 'text-slate-400'}`}>
                              {v.latestMessage}
                            </p>
                          )}
                        </div>

                        {/* Arrow */}
                        <div className="text-slate-300 group-hover:text-emerald-500 transition-colors flex-shrink-0">
                          <MessageSquare size={16} />
                        </div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

          </motion.div>
        )}
      </div>
    </div>
  );
}