import React, { useRef, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { formatDistanceToNow } from '../lib/date';

export default function NotificationPanel({ onClose }) {
  const { notifications, loading, markRead, markAllRead, unreadCount } = useNotifications();
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-96 max-h-[80vh] card shadow-lg z-50 overflow-hidden"
    >
      <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <span className="font-semibold text-slate-800">Notifications</span>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="text-sm text-primary-600 hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>
      <div className="overflow-y-auto max-h-96">
        {loading ? (
          <div className="p-6 text-center text-slate-500">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center text-slate-500">No notifications yet.</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <li
                key={n._id}
                className={`p-3 hover:bg-slate-50 cursor-pointer ${!n.isRead ? 'bg-primary-50/50' : ''}`}
                onClick={() => {
                  markRead(n._id);
                }}
              >
                <p className="text-sm text-slate-800">{n.message}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {n.createdAt ? formatDistanceToNow(n.createdAt) : ''}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
