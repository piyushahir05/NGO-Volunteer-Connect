import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { useSocket } from '../context/SocketContext'; // adjust to your socket context path
import { ArrowLeft, Send, Loader2, Sparkles, Mail } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const glassCardClass = "bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_4px_24px_rgba(5,150,105,0.04)] rounded-[1.5rem] overflow-hidden";

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDateLabel(dateStr) {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString())     return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

// Group messages by date
function groupByDate(messages) {
  const groups = [];
  let currentDate = null;
  messages.forEach((msg) => {
    const label = formatDateLabel(msg.createdAt);
    if (label !== currentDate) {
      currentDate = label;
      groups.push({ type: 'date', label });
    }
    groups.push({ type: 'message', ...msg });
  });
  return groups;
}

export default function NGOChat() {
  const { volunteerId } = useParams();
  const navigate        = useNavigate();
  const socket          = useSocket();

  const [messages, setMessages]         = useState([]);
  const [volunteerInfo, setVolunteerInfo] = useState(null);
  const [text, setText]                 = useState('');
  const [loading, setLoading]           = useState(true);
  const [sending, setSending]           = useState(false);

  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const convId     = useRef(null);

  // Fetch messages + volunteer info
  useEffect(() => {
    setLoading(true);

    // Get volunteer info from conversations list
    api.get('/messages/ngo/conversations')
      .then((res) => {
        const v = res.data.find((x) => x._id === volunteerId);
        if (v) setVolunteerInfo(v);
      });

    api.get(`/messages/ngo/${volunteerId}`)
      .then((res) => setMessages(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [volunteerId]);

  // Socket: join conversation room + listen for new messages
  useEffect(() => {
    if (!socket) return;

    // We need the NGO's id to build convId — get it from first message or from api
    // Simplest: server returns messages with conversationId
    // We'll join once we know the convId
  }, [socket]);

  useEffect(() => {
    if (!socket || messages.length === 0) return;
    const cid = messages[0]?.conversationId;
    if (!cid) return;
    convId.current = cid;
    socket.emit('joinConversation', cid);

    const handler = (msg) => {
      if (msg.conversationId === cid) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on('newMessage', handler);
    return () => {
      socket.off('newMessage', handler);
      socket.emit('leaveConversation', cid);
    };
  }, [socket, messages.length > 0 ? messages[0]?.conversationId : null]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const { data } = await api.post(`/messages/ngo/${volunteerId}`, { text: text.trim() });
      setMessages((prev) => [...prev, data]);
      setText('');
      inputRef.current?.focus();
    } catch {
      // keep UI as is
    } finally {
      setSending(false);
    }
  };

  const grouped = groupByDate(messages);
  const initials = (volunteerInfo?.name || 'V').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="relative min-h-screen bg-[#F9F6F0] overflow-hidden py-6 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-200 selection:text-emerald-900">

      {/* Ambient blobs */}
      <div className="fixed top-[0%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-emerald-300/20 blur-[100px] pointer-events-none mix-blend-multiply" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-teal-200/25 blur-[120px] pointer-events-none mix-blend-multiply" />

      <div className="relative z-10 max-w-2xl mx-auto space-y-4">

        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className={`${glassCardClass} p-5 relative`}>
          <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
            <Sparkles size={60} className="text-emerald-600" />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <button
              onClick={() => navigate('/ngo/messages')}
              className="p-2 bg-white/40 hover:bg-white/80 border border-white/60 rounded-xl text-slate-500 hover:text-emerald-700 transition-colors flex-shrink-0"
            >
              <ArrowLeft size={18} />
            </button>

            {volunteerInfo ? (
              <>
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-extrabold shadow-sm flex-shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 truncate">{volunteerInfo.name}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 truncate">
                    <Mail size={10} className="text-emerald-500" /> {volunteerInfo.email}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white/60 animate-pulse" />
                <div className="space-y-1.5">
                  <div className="h-4 w-28 rounded-full bg-white/60 animate-pulse" />
                  <div className="h-3 w-36 rounded-full bg-white/60 animate-pulse" />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Messages */}
        <motion.div
          initial="hidden" animate="visible" variants={fadeUp}
          className={`${glassCardClass} flex flex-col`}
          style={{ minHeight: '460px' }}
        >
          {/* Scrollable area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3" style={{ maxHeight: '460px' }}>
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full py-16">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
                </div>
                <span className="mt-3 text-xs font-bold tracking-widest text-emerald-600 uppercase">Loading…</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-center mx-auto mb-3">
                  <Send size={20} className="text-emerald-600" />
                </div>
                <p className="text-sm font-bold text-slate-700">No messages yet</p>
                <p className="text-xs text-slate-400 mt-1">Send the first message below.</p>
              </div>
            ) : (
              grouped.map((item, idx) => {
                if (item.type === 'date') {
                  return (
                    <div key={`date-${idx}`} className="flex items-center gap-3 my-2">
                      <div className="flex-1 h-px bg-white/60" />
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                      <div className="flex-1 h-px bg-white/60" />
                    </div>
                  );
                }
                const isNGO = item.senderRole === 'ngo';
                return (
                  <div key={item._id} className={`flex ${isNGO ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      isNGO
                        ? 'bg-emerald-600 text-white rounded-br-sm'
                        : 'bg-white/70 text-slate-800 border border-white/80 rounded-bl-sm backdrop-blur-sm'
                    }`}>
                      <p>{item.text}</p>
                      <p className={`text-[10px] mt-1 text-right ${isNGO ? 'text-emerald-200' : 'text-slate-400'}`}>
                        {formatTime(item.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/60 p-4">
            <form onSubmit={handleSend} className="flex items-end gap-3">
              <textarea
                ref={inputRef}
                rows={1}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                }}
                placeholder="Type a message… (Enter to send)"
                className="flex-1 bg-white/50 border border-white/80 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/90 transition-all backdrop-blur-sm resize-none placeholder:text-slate-400"
                style={{ maxHeight: '120px' }}
              />
              <button
                type="submit"
                disabled={!text.trim() || sending}
                className="p-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-emerald-500/20 flex-shrink-0"
              >
                {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </form>
          </div>
        </motion.div>

      </div>
    </div>
  );
}