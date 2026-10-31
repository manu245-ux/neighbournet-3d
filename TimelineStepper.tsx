import React from 'react';
import { TimelineEntry } from '../../types';
import { StatusBadge } from './Badge';
import { 
  CheckCircle2, 
  Clock, 
  Wrench, 
  UserCheck, 
  XCircle, 
  Undo2, 
  User, 
  ShieldCheck 
} from 'lucide-react';

interface TimelineStepperProps {
  timeline: TimelineEntry[];
}

export const TimelineStepper: React.FC<TimelineStepperProps> = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-slate-500">
        No timeline entries recorded yet.
      </div>
    );
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'SUBMITTED':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'APPROVED':
        return <CheckCircle2 className="w-4 h-4 text-blue-400" />;
      case 'ASSIGNED':
        return <UserCheck className="w-4 h-4 text-purple-400" />;
      case 'IN_PROGRESS':
        return <Wrench className="w-4 h-4 text-orange-400" />;
      case 'RESOLVED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4 text-rose-400" />;
      case 'WITHDRAWN':
        return <Undo2 className="w-4 h-4 text-slate-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
      {timeline.map((entry, index) => {
        const isLatest = index === timeline.length - 1;

        return (
          <div key={entry.timelineId || index} className="relative group">
            {/* Step Icon Anchor */}
            <div className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
              isLatest 
                ? 'bg-slate-900 border-sky-400 shadow-md shadow-sky-500/20' 
                : 'bg-slate-950 border-slate-700'
            }`}>
              {getActionIcon(entry.action)}
            </div>

            {/* Step Body */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 space-y-2 group-hover:border-slate-700 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white tracking-wide uppercase">
                    {entry.action.replace('_', ' ')}
                  </span>
                  <StatusBadge status={entry.newStatus} size="sm" />
                </div>
                <span className="text-[11px] text-slate-500">
                  {new Date(entry.timestamp).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {/* Remarks */}
              {entry.remarks && (
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 rounded-lg p-2.5 border border-slate-800/50">
                  {entry.remarks}
                </p>
              )}

              {/* Actor details */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                {entry.updatedByRole === 'admin' ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                ) : (
                  <User className="w-3.5 h-3.5 text-sky-400" />
                )}
                <span>
                  Updated by <strong>{entry.updatedBy}</strong> ({entry.updatedByRole})
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
