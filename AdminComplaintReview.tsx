import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  Wrench, 
  Clock, 
  Calendar, 
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  MapPin,
  Image as ImageIcon
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { TimelineStepper } from '../components/common/TimelineStepper';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { complaintService } from '../services/complaintService';
import { ComplaintRecord, TimelineEntry, PriorityLevel, ComplaintStatus } from '../types';

export const AdminComplaintReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { complaints, teams, updateStatus } = useData();

  const [complaint, setComplaint] = useState<ComplaintRecord | null>(null);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [activeAction, setActiveAction] = useState<'approve' | 'reject' | 'assign' | 'progress' | 'resolve' | 'reopen' | null>(null);

  // Action Form Inputs
  const [remarks, setRemarks] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel>('high');
  const [selectedVisibility, setSelectedVisibility] = useState<'public' | 'private'>('public');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('team-plumbing');
  const [staffName, setStaffName] = useState<string>('');
  const [etaDateTime, setEtaDateTime] = useState<string>('');
  const [resolutionNote, setResolutionNote] = useState<string>('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    const current = complaints.find(c => c.complaintId === id);
    if (current) {
      setComplaint(current);
      setSelectedPriority(current.priority);
      setSelectedVisibility(current.visibility);
      if (current.assignedTeamId) setSelectedTeamId(current.assignedTeamId);
      if (current.assignedTo) setStaffName(current.assignedTo);
    }
    complaintService.getTimeline(id).then(t => setTimeline(t));
  }, [id, complaints]);

  if (!complaint) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Ticket Not Found</h2>
        <Link to="/admin/complaints" className="text-xs text-sky-400 hover:underline">
          Return to Operations Grid
        </Link>
      </div>
    );
  }

  // Handle Action Execution
  const handleExecuteAction = async () => {
    setActionError(null);
    setIsProcessing(true);

    try {
      if (activeAction === 'approve') {
        await updateStatus(
          complaint.complaintId,
          'APPROVED',
          {
            remarks: remarks.trim() || 'Verified and approved by facility administration.',
            priority: selectedPriority,
            visibility: selectedVisibility
          }
        );
      } else if (activeAction === 'reject') {
        if (remarks.trim().length < 10) {
          setActionError('Rejection reason must be at least 10 characters.');
          setIsProcessing(false);
          return;
        }
        await updateStatus(
          complaint.complaintId,
          'REJECTED',
          { remarks: remarks.trim() }
        );
      } else if (activeAction === 'assign') {
        await updateStatus(
          complaint.complaintId,
          'ASSIGNED',
          {
            teamId: selectedTeamId,
            staffName: staffName.trim() || undefined,
            remarks: `Assigned to ${selectedTeamId.replace('team-', '')} maintenance unit.`
          }
        );
      } else if (activeAction === 'progress') {
        if (!etaDateTime) {
          setActionError('Please specify an estimated resolution date & time.');
          setIsProcessing(false);
          return;
        }
        const etaDate = new Date(etaDateTime);
        if (etaDate.getTime() <= Date.now()) {
          setActionError('Estimated resolution time must strictly be in the future.');
          setIsProcessing(false);
          return;
        }
        await updateStatus(
          complaint.complaintId,
          'IN_PROGRESS',
          {
            eta: etaDate.toISOString(),
            remarks: remarks.trim() || 'Maintenance team dispatched on-site.'
          }
        );
      } else if (activeAction === 'resolve') {
        if (resolutionNote.trim().length < 5) {
          setActionError('Resolution note describing corrective action is mandatory.');
          setIsProcessing(false);
          return;
        }
        await updateStatus(
          complaint.complaintId,
          'RESOLVED',
          { resolutionNote: resolutionNote.trim() }
        );
      } else if (activeAction === 'reopen') {
        if (remarks.trim().length < 5) {
          setActionError('Please specify why this ticket is being reopened.');
          setIsProcessing(false);
          return;
        }
        await updateStatus(
          complaint.complaintId,
          'IN_PROGRESS',
          { remarks: `Reopened: ${remarks.trim()}` }
        );
      }

      setActiveAction(null);
      setRemarks('');
      setResolutionNote('');
      const updatedTimeline = await complaintService.getTimeline(complaint.complaintId);
      setTimeline(updatedTimeline);
    } catch (err) {
      console.error(err);
      setActionError('Failed to execute state transition.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <Link to="/admin/complaints" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Operations Grid
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
              Triage & Dispatch Desk
            </h1>
            <span className="font-mono text-sm font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
              {complaint.complaintId}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={complaint.status} />
          <PriorityBadge priority={complaint.priority} />
        </div>
      </div>

      {/* Main Grid: Ticket Details + Actions Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left (2/3): Full Details & Evidence */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                {complaint.category}
              </span>
              <span className="text-xs text-slate-500">
                Lodged {new Date(complaint.createdAt).toLocaleString()}
              </span>
            </div>

            <h2 className="text-xl font-bold text-white">{complaint.title}</h2>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              {complaint.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                <span className="text-slate-500 font-medium block">Spatial Location</span>
                <p className="text-slate-200 font-semibold mt-0.5">
                  {complaint.buildingId.toUpperCase()} • {complaint.floorId.split('-')[1]?.toUpperCase()}
                </p>
                <p className="text-[11px] text-slate-400">{complaint.exactLocation} ({complaint.locationZone})</p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                <span className="text-slate-500 font-medium block">Resident Confirmed Signals</span>
                <p className="text-amber-400 font-semibold mt-0.5">
                  Still Exists: {complaint.confirmationCounts?.stillExists || 0} votes
                </p>
                <p className="text-emerald-400 font-semibold">
                  Resolved: {complaint.confirmationCounts?.resolved || 0} votes
                </p>
              </div>
            </div>

            {/* Photo Attachment if any */}
            {complaint.imageUrl && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-400 block mb-1.5 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-sky-400" /> Attached Evidence
                </span>
                <img src={complaint.imageUrl} alt="Attached Evidence" className="rounded-xl border border-slate-800 max-h-60 object-cover" />
              </div>
            )}
          </div>

          {/* Chronological Timeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight">Audit Trail & Action Log</h3>
            <TimelineStepper timeline={timeline} />
          </div>

        </div>

        {/* Right (1/3): Action Execution Panel */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-purple-400" />
              Triage & Transition Commands
            </h3>

            {/* Action Selector Buttons */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setActiveAction('approve')}
                className={`p-2.5 rounded-xl font-semibold border transition-all text-center ${
                  activeAction === 'approve' 
                    ? 'bg-blue-600 text-white border-blue-400' 
                    : 'bg-slate-950 text-blue-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                Approve Ticket
              </button>

              <button
                onClick={() => setActiveAction('assign')}
                className={`p-2.5 rounded-xl font-semibold border transition-all text-center ${
                  activeAction === 'assign' 
                    ? 'bg-purple-600 text-white border-purple-400' 
                    : 'bg-slate-950 text-purple-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                Assign Team
              </button>

              <button
                onClick={() => setActiveAction('progress')}
                className={`p-2.5 rounded-xl font-semibold border transition-all text-center ${
                  activeAction === 'progress' 
                    ? 'bg-orange-600 text-white border-orange-400' 
                    : 'bg-slate-950 text-orange-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                Start / ETA
              </button>

              <button
                onClick={() => setActiveAction('resolve')}
                className={`p-2.5 rounded-xl font-semibold border transition-all text-center ${
                  activeAction === 'resolve' 
                    ? 'bg-emerald-600 text-white border-emerald-400' 
                    : 'bg-slate-950 text-emerald-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                Mark Resolved
              </button>

              <button
                onClick={() => setActiveAction('reject')}
                className={`p-2.5 rounded-xl font-semibold border transition-all text-center ${
                  activeAction === 'reject' 
                    ? 'bg-rose-600 text-white border-rose-400' 
                    : 'bg-slate-950 text-rose-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                Reject Ticket
              </button>

              {complaint.status === 'RESOLVED' && (
                <button
                  onClick={() => setActiveAction('reopen')}
                  className={`p-2.5 rounded-xl font-semibold border transition-all text-center ${
                    activeAction === 'reopen' 
                      ? 'bg-amber-600 text-white border-amber-400' 
                      : 'bg-slate-950 text-amber-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  Reopen Issue
                </button>
              )}
            </div>

            {/* Action Form Inputs */}
            {activeAction && (
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3 text-xs animate-in fade-in duration-150">
                <span className="font-bold text-white uppercase tracking-wider block border-b border-slate-800 pb-1.5">
                  Execute: {activeAction}
                </span>

                {actionError && (
                  <p className="text-xs text-rose-400 bg-rose-950/50 p-2 rounded-lg border border-rose-800">
                    {actionError}
                  </p>
                )}

                {/* Approve Form */}
                {activeAction === 'approve' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Final Admin Priority</label>
                      <select
                        value={selectedPriority}
                        onChange={(e) => setSelectedPriority(e.target.value as PriorityLevel)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Visibility</label>
                      <select
                        value={selectedVisibility}
                        onChange={(e) => setSelectedVisibility(e.target.value as 'public' | 'private')}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                      >
                        <option value="public">Public (Show on Campus Map & Feed)</option>
                        <option value="private">Private (Admin & Reporter Only)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Approval Remark (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Verified by guard on duty."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                      />
                    </div>
                  </div>
                )}

                {/* Assign Form */}
                {activeAction === 'assign' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Select Maintenance Team</label>
                      <select
                        value={selectedTeamId}
                        onChange={(e) => setSelectedTeamId(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                      >
                        {teams.map(t => (
                          <option key={t.teamId} value={t.teamId}>{t.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Assign Specific Technician (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh (Master Plumber)"
                        value={staffName}
                        onChange={(e) => setStaffName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                      />
                    </div>
                  </div>
                )}

                {/* Progress / ETA Form */}
                {activeAction === 'progress' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Expected Resolution (ETA) * (Must be in future)</label>
                      <input
                        type="datetime-local"
                        value={etaDateTime}
                        onChange={(e) => setEtaDateTime(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Progress Notes / Status Remark</label>
                      <input
                        type="text"
                        placeholder="e.g. Main water supply valve isolated. Parts arriving."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                      />
                    </div>
                  </div>
                )}

                {/* Resolve Form */}
                {activeAction === 'resolve' && (
                  <div className="space-y-2">
                    <label className="block text-slate-400 mb-1">Resolution Note * (Describe fix taken)</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Gasket replaced and pipe pressure tested successfully."
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                    />
                  </div>
                )}

                {/* Reject Form */}
                {activeAction === 'reject' && (
                  <div className="space-y-2">
                    <label className="block text-slate-400 mb-1">Rejection Reason * (Min 10 characters)</label>
                    <textarea
                      rows={3}
                      placeholder="Provide clear justification for rejection..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                    />
                  </div>
                )}

                {/* Reopen Form */}
                {activeAction === 'reopen' && (
                  <div className="space-y-2">
                    <label className="block text-slate-400 mb-1">Reason for Reopening *</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Resident reported secondary leak in same junction..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                    />
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveAction(null)}
                    className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleExecuteAction}
                    className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-semibold disabled:opacity-50"
                  >
                    {isProcessing ? 'Saving...' : 'Confirm'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
