import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CheckCircle, Info, Bell, XCircle } from "lucide-react";

export default function NotificationPanel({ onClose }) {
  const { notifications, markRead, markAllRead } = useNotifications();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = (notif) => {
    if (!notif.isRead) markRead(notif._id);

    if (notif.relatedNgoId) {
      if (user.role === "Volunteer") {
        // volunteer navigates using NGO's id
        navigate(`/volunteer/messages/${notif.relatedNgoId}`);
      } else {
        // NGO navigates using volunteer's id
        navigate(`/ngo/messages/${notif.relatedVolunteerId}`);
      }
      if (onClose) onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="absolute right-0 mt-3 w-80 sm:w-[400px] bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 overflow-hidden z-[9999] origin-top-right"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-emerald-50/50 border-b border-emerald-100/50">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Bell size={18} className="text-emerald-600" /> Notifications
        </h3>

        {notifications?.some((n) => !n.isRead) && (
          <button
            onClick={markAllRead}
            className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-widest transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {notifications && notifications.length > 0 ? (
            notifications.map((notif) => {
              const isAccepted =
                notif.message.toLowerCase().includes("accepted") ||
                notif.message.toLowerCase().includes("congratulations");

              return (
                <motion.div
                  key={notif._id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => handleClick(notif)}
                  className={`p-4 border-b border-slate-100/50 flex gap-3 cursor-pointer transition-colors ${notif.isRead
                    ? "bg-white/40"
                    : "bg-emerald-50/80 hover:bg-emerald-100/50"
                    }`}
                >
                  {/* Icon */}
                  <div className="shrink-0 mt-1">
                    {isAccepted ? (
                      <CheckCircle size={20} className="text-emerald-500" />
                    ) : notif.message
                      .toLowerCase()
                      .includes("rejected") ? (
                      <XCircle size={20} className="text-red-500" />
                    ) : (
                      <Info size={20} className="text-blue-500" />
                    )}
                  </div>

                  {/* Message */}
                  <div className="flex-1 pr-2">
                    <p
                      className={`text-sm leading-snug ${notif.isRead
                        ? "text-slate-600 font-medium"
                        : "text-slate-800 font-bold"
                        }`}
                    >
                      {notif.message}
                    </p>

                    <p className="text-[10px] text-slate-400 mt-1.5 font-bold uppercase tracking-wider">
                      {new Date(notif.createdAt).toLocaleDateString()} at{" "}
                      {new Date(notif.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!notif.isRead && (
                    <div className="shrink-0 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    </div>
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className="py-16 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                <Bell size={28} className="text-slate-300" />
              </div>

              <p className="text-sm font-bold text-slate-500">
                You're all caught up!
              </p>

              <p className="text-xs text-slate-400 mt-1 font-medium">
                We'll let you know when NGOs respond.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}