import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  Wrench, 
  ShieldAlert, 
  Undo2, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { TimelineStepper } from '../components/common/TimelineStepper';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { complaintService } from '../services/complaintService';
import { ComplaintRecord, TimelineEntry } from '../types';

export const ComplaintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const { complaints, updateStatus } = useData();

  const [complaint, setComplaint] = useState<ComplaintRecord | null>(null);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);

  // Fetch or sync complaint
  useEffect(() => {
    if (!id) return;

    const current = complaints.find(c => c.complaintId === id);
    if (current) {
      setComplaint(current);
    } else {
      complaintService.getComplaintById(id).then(c => {
        setComplaint(c);
      });
    }

    complaintService.getTimeline(id).then(t => {
      setTimeline(t);
      setIsLoading(false);
    });
  }, [id, complaints]);

  if (isLoading && !complaint) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400">Loading complaint timeline...</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Complaint Not Found</h2>
        <p className="text-xs text-slate-400">The ticket {id} does not exist or has been archived.</p>
        <Link to="/map" className="inline-block px-4 py-2 rounded-lg bg-sky-500 text-white text-xs font-semibold">
          Return to Campus Map
        </Link>
      </div>
    );
  }

  const isAuthor = currentUser.userId === complaint.reporterId;
  const canWithdraw = isAuthor && complaint.status === 'PENDING_VERIFICATION';

  const handleWithdraw = async () => {
    if (!window.confirm('Are you sure you want to withdraw this pending complaint?')) return;
    setIsWithdrawing(true);
    try {
      await updateStatus(
        complaint.complaintId,
        'WITHDRAWN',
        { remarks: 'Withdrawn by the author before verification.' }
      );
    } catch (err) {
      console.error(err);
      alert('Failed to withdraw complaint.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <Link to="/map" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Campus Map
        </Link>

        {isAdmin && (
          <Link
            to={`/admin/review/${complaint.complaintId}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/50 text-xs font-semibold transition-all"
          >
            Open in Admin Desk
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Primary Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Header Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-bold text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded border border-sky-500/30">
                {complaint.complaintId}
              </span>
              <StatusBadge status={complaint.status} />
              <PriorityBadge priority={complaint.priority} />
              <span className="text-xs px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                {complaint.category}
              </span>
              {complaint.visibility === 'private' && (
                <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
                  Private Record
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {complaint.title}
            </h1>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>{complaint.buildingId.toUpperCase()}</span>
              <span>•</span>
              <span>{complaint.floorId.split('-')[1]?.toUpperCase()}</span>
              <span>•</span>
              <span className="text-slate-300 font-medium">{complaint.exactLocation}</span>
            </div>
          </div>

          {/* Withdrawal CTA */}
          {canWithdraw && (
            <button
              onClick={handleWithdraw}
              disabled={isWithdrawing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-all disabled:opacity-50 self-start sm:self-auto"
            >
              <Undo2 className="w-3.5 h-3.5" />
              {isWithdrawing ? 'Withdrawing...' : 'Withdraw Complaint'}
            </button>
          )}
        </div>

        {/* Detailed Description */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</h3>
          <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            {complaint.description}
          </p>
        </div>

        {/* Photo Preview if present */}
        {complaint.imageUrl && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-sky-400" /> Attached Photo Evidence
            </h3>
            <div className="rounded-xl overflow-hidden border border-slate-800 max-w-md">
              <img src={complaint.imageUrl} alt="Evidence" className="w-full h-auto object-cover" />
            </div>
          </div>
        )}

        {/* Work & ETA Panel (if assigned or in progress) */}
        {(complaint.assignedTeamId || complaint.expectedResolutionAt || complaint.resolutionNote) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs">
            {complaint.assignedTeamId && (
              <div className="space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Wrench className="w-3.5 h-3.5 text-orange-400" /> Assigned Maintenance Team
                </span>
                <p className="text-sm font-bold text-white capitalize">{complaint.assignedTeamId.replace('team-', '')} Team</p>
                {complaint.assignedTo && <p className="text-slate-400 text-[11px]">Staff: {complaint.assignedTo}</p>}
              </div>
            )}

            {complaint.expectedResolutionAt && (
              <div className="space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" /> Expected Resolution (ETA)
                </span>
                <p className="text-sm font-bold text-sky-400">
                  {new Date(complaint.expectedResolutionAt).toLocaleString()}
                </p>
              </div>
            )}

            {complaint.resolutionNote && (
              <div className="col-span-full pt-2 border-t border-slate-800/80 space-y-1">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Resolution Details
                </span>
                <p className="text-slate-300 text-xs leading-relaxed">{complaint.resolutionNote}</p>
              </div>
            )}
          </div>
        )}

        {/* Possible Duplicate Link Warnings */}
        {complaint.possibleDuplicateOf && complaint.possibleDuplicateOf.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 text-xs text-amber-300 space-y-1">
            <span className="font-bold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Referenced Possible Duplicate:
            </span>
            <p className="text-[11px] text-amber-200/80">
              This report was submitted after acknowledging existing active tickets: {complaint.possibleDuplicateOf.join(', ')}
            </p>
          </div>
        )}

      </div>

      {/* Chronological Audit Stepper */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Chronological Progress Stepper</h2>
          <p className="text-xs text-slate-400">
            Immutable audit trail of all administrator verifications, team dispatches, and resident updates
          </p>
        </div>

        <TimelineStepper timeline={timeline} />
      </div>

    </div>
  );
};
