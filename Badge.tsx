import React from 'react';
import { ComplaintStatus, PriorityLevel } from '../../types';
import { 
  Clock, 
  CheckCircle, 
  UserCheck, 
  Wrench, 
  CheckCircle2, 
  XCircle, 
  Undo2,
  AlertTriangle,
  Flame,
  Info
} from 'lucide-react';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  switch (status) {
    case 'PENDING_VERIFICATION':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5" />
          Pending Verification
        </span>
      );
    case 'APPROVED':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 ${sizeClasses}`}>
          <CheckCircle className="w-3.5 h-3.5" />
          Approved
        </span>
      );
    case 'ASSIGNED':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 ${sizeClasses}`}>
          <UserCheck className="w-3.5 h-3.5" />
          Assigned
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 ${sizeClasses}`}>
          <Wrench className="w-3.5 h-3.5 animate-spin-slow" />
          In Progress
        </span>
      );
    case 'RESOLVED':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          Resolved
        </span>
      );
    case 'REJECTED':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-slate-800 text-slate-400 border border-rose-500/30 ${sizeClasses}`}>
          <XCircle className="w-3.5 h-3.5 text-rose-400" />
          Rejected
        </span>
      );
    case 'WITHDRAWN':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 ${sizeClasses}`}>
          <Undo2 className="w-3.5 h-3.5" />
          Withdrawn
        </span>
      );
    default:
      return null;
  }
};

interface PriorityBadgeProps {
  priority: PriorityLevel;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  switch (priority) {
    case 'urgent':
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/20 px-2 py-0.5 text-xs font-semibold text-rose-300 border border-rose-500/40">
          <Flame className="w-3 h-3 text-rose-400" />
          Urgent
        </span>
      );
    case 'high':
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-orange-500/20 px-2 py-0.5 text-xs font-semibold text-orange-300 border border-orange-500/40">
          <AlertTriangle className="w-3 h-3 text-orange-400" />
          High
        </span>
      );
    case 'medium':
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-sky-500/20 px-2 py-0.5 text-xs font-semibold text-sky-300 border border-sky-500/40">
          <Info className="w-3 h-3 text-sky-400" />
          Medium
        </span>
      );
    case 'low':
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-400 border border-slate-700">
          Low
        </span>
      );
  }
};
