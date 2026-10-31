import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  CheckCheck, 
  ArrowLeft, 
  ExternalLink, 
  Clock, 
  Sparkles,
  Inbox
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const NotificationCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadNotificationCount, 
    markNotificationRead, 
    markAllNotificationsRead 
  } = useData();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Resident Hub
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Bell className="w-6 h-6 text-sky-400" />
              In-App Notification Center
            </h1>
            {unreadNotificationCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
                {unreadNotificationCount} Unread
              </span>
            )}
          </div>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={markAllNotificationsRead}
            disabled={unreadNotificationCount === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-sky-400" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <Inbox className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">Your notification inbox is empty</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You will receive real-time notifications here whenever maintenance administrators verify or update the progress of your complaints.
            </p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.notificationId}
              onClick={() => markNotificationRead(item.notificationId)}
              className={`border rounded-2xl p-5 shadow-md transition-all space-y-2 cursor-pointer ${
                !item.readStatus 
                  ? 'bg-slate-900 border-sky-500/40 shadow-sky-950/20' 
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {!item.readStatus && (
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse flex-shrink-0" />
                  )}
                  <h3 className={`text-sm font-bold ${!item.readStatus ? 'text-white' : 'text-slate-300'}`}>
                    {item.title}
                  </h3>
                </div>
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(item.createdAt).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pl-4">
                {item.message}
              </p>

              <div className="flex items-center justify-between pt-2 pl-4 text-xs">
                <span className="text-[11px] font-mono text-sky-400">
                  Ticket #{item.complaintId}
                </span>

                <Link
                  to={`/complaint/${item.complaintId}`}
                  className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 hover:underline font-semibold"
                >
                  View Complaint Details
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
