import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Radio, 
  MapPin, 
  ThumbsUp, 
  CheckCircle2, 
  AlertTriangle, 
  Filter, 
  Megaphone, 
  ArrowRight,
  ExternalLink,
  Building,
  Image as ImageIcon
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ComplaintCategory, ComplaintStatus } from '../types';

export const CommunityFeedPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { complaints, announcements, addConfirmation } = useData();

  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [voteFeedback, setVoteFeedback] = useState<string | null>(null);

  // Filter public verified complaints
  const publicComplaints = complaints.filter(c => {
    // Only public, verified complaints appear on the community feed
    if (c.visibility !== 'public') return false;
    if (!['APPROVED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'].includes(c.status)) return false;

    if (selectedBuilding !== 'all' && c.buildingId !== selectedBuilding) return false;
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;

    return true;
  });

  const handleVote = (complaintId: string, type: 'STILL_EXISTS' | 'RESOLVED') => {
    const success = addConfirmation(complaintId, type);
    if (success) {
      setVoteFeedback(`Vote recorded for ticket ${complaintId}. Thank you for verifying!`);
      setTimeout(() => setVoteFeedback(null), 3000);
    } else {
      setVoteFeedback(`You have already recorded your confirmation for ${complaintId}.`);
      setTimeout(() => setVoteFeedback(null), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Feed Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
          <Radio className="w-3.5 h-3.5" />
          Society Community Billboard
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Public Issues & Resident Verifications
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Transparent view of all verified community maintenance tickets in Green Valley Residency. Confirm active issues to assist management prioritization.
        </p>
      </div>

      {/* Pinned Announcements */}
      {announcements.length > 0 && (
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Megaphone className="w-4 h-4" />
            Active Society Broadcast
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map(ann => (
              <div key={ann.announcementId} className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1">
                <h3 className="text-xs font-bold text-white">{ann.title}</h3>
                <p className="text-[11px] text-slate-300 leading-relaxed">{ann.message}</p>
                <p className="text-[10px] text-slate-500 pt-1">Posted by {ann.createdBy}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vote feedback toast banner */}
      {voteFeedback && (
        <div className="bg-sky-500/20 border border-sky-500/40 text-sky-200 px-4 py-2.5 rounded-xl text-xs font-semibold animate-in fade-in duration-200">
          {voteFeedback}
        </div>
      )}

      {/* Filter Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-wrap items-center gap-3 text-xs">
        <span className="text-slate-400 font-semibold flex items-center gap-1.5 pl-1">
          <Filter className="w-3.5 h-3.5 text-sky-400" /> Filters:
        </span>

        {/* Building Filter */}
        <select
          value={selectedBuilding}
          onChange={(e) => setSelectedBuilding(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          <option value="all">All Towers (A, B, C, D)</option>
          <option value="bldg-a">Building A</option>
          <option value="bldg-b">Building B</option>
          <option value="bldg-c">Building C</option>
          <option value="bldg-d">Building D</option>
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          <option value="all">All Categories</option>
          <option value="Water Leakage">Water Leakage</option>
          <option value="Electricity Failure">Electricity Failure</option>
          <option value="Lift Malfunction">Lift Malfunction</option>
          <option value="Garbage and Sanitation">Garbage and Sanitation</option>
          <option value="Road Damage">Road Damage</option>
          <option value="Stray Animals">Stray Animals</option>
          <option value="Fire or Safety Hazard">Fire Hazard</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          <option value="all">All Statuses</option>
          <option value="APPROVED">Approved</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>

        <span className="ml-auto text-slate-500 text-[11px]">
          Showing {publicComplaints.length} tickets (PII Protected)
        </span>
      </div>

      {/* Complaints Feed List */}
      <div className="space-y-4">
        {publicComplaints.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">No active issues match the selected filters</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              All reported complaints in this selection have been resolved or are being verified.
            </p>
          </div>
        ) : (
          publicComplaints.map(c => (
            <div
              key={c.complaintId}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 shadow-md transition-all space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
                    {c.complaintId}
                  </span>
                  <StatusBadge status={c.status} size="sm" />
                  <PriorityBadge priority={c.priority} />
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                    {c.category}
                  </span>
                </div>

                <span className="text-[11px] text-slate-500">
                  Reported {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{c.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">{c.description}</p>
              </div>

              {/* Masked Location Banner (No Personal Flat / Name Exposed) */}
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>Location:</span>
                <span className="text-slate-200 font-semibold">{c.buildingId.toUpperCase()}</span>
                <span>•</span>
                <span>{c.floorId.split('-')[1]?.toUpperCase()}</span>
                <span>•</span>
                <span className="text-slate-300">{c.exactLocation}</span>
                <span className="text-[10px] text-slate-500 ml-auto">(Resident Identity Masked)</span>
              </div>

              {/* Photo Evidence if present */}
              {c.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-800 max-w-sm">
                  <img src={c.imageUrl} alt="Issue" className="w-full h-40 object-cover" />
                </div>
              )}

              {/* Action Toolbar: Resident Confirmations + Timeline Link */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
                
                {/* Voting Chips */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVote(c.complaintId, 'STILL_EXISTS')}
                    title="Confirm this issue is still active"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Still Exists ({c.confirmationCounts.stillExists})
                  </button>

                  <button
                    onClick={() => handleVote(c.complaintId, 'RESOLVED')}
                    title="Confirm this issue has been resolved"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Issue Resolved ({c.confirmationCounts.resolved})
                  </button>
                </div>

                {/* Inspect Link */}
                <Link
                  to={`/complaint/${c.complaintId}`}
                  className="inline-flex items-center gap-1 text-sky-400 hover:underline font-semibold"
                >
                  View Timeline & Status
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
