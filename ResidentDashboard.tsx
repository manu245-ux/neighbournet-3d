import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Radio, 
  Building, 
  ArrowRight, 
  Calendar,
  ExternalLink,
  Undo2,
  Megaphone
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const ResidentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { complaints, announcements, updateStatus } = useData();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'resolved' | 'pending'>('all');

  // Filter complaints logged by this resident
  const myComplaints = complaints.filter(c => c.reporterId === currentUser.userId);

  const myActive = myComplaints.filter(
    c => !['RESOLVED', 'REJECTED', 'WITHDRAWN'].includes(c.status)
  );
  const myResolved = myComplaints.filter(c => c.status === 'RESOLVED');
  const myPending = myComplaints.filter(c => c.status === 'PENDING_VERIFICATION');

  const displayedComplaints = myComplaints.filter(c => {
    if (activeTab === 'active') return !['RESOLVED', 'REJECTED', 'WITHDRAWN'].includes(c.status);
    if (activeTab === 'resolved') return c.status === 'RESOLVED';
    if (activeTab === 'pending') return c.status === 'PENDING_VERIFICATION';
    return true;
  });

  const handleWithdraw = async (complaintId: string) => {
    if (!window.confirm('Withdraw this complaint?')) return;
    await updateStatus(
      complaintId,
      'WITHDRAWN',
      { remarks: 'Withdrawn by resident from dashboard.' }
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Resident Welcome Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
            <Building className="w-3.5 h-3.5" />
            {currentUser.building} • Flat {currentUser.apartmentNumber}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Green Valley Residency Resident Portal • Track verification, technician dispatch, and resolution.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/report"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold shadow-lg shadow-sky-500/25 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Report Issue
          </Link>
          <Link
            to="/map"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-colors"
          >
            <MapPin className="w-4 h-4 text-sky-400" />
            Campus Map
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">My Total Complaints</p>
            <p className="text-3xl font-bold text-white mt-1">{myComplaints.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800 text-sky-400">
            <LayoutDashboard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">In Progress / Active</p>
            <p className="text-3xl font-bold text-white mt-1">{myActive.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Resolved Tickets</p>
            <p className="text-3xl font-bold text-white mt-1">{myResolved.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: My Complaints (2/3) + Bulletins & Quick Links (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left: My Complaints Feed */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Header & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white tracking-tight">My Lodged Complaints</h2>
            
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  activeTab === 'all' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({myComplaints.length})
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  activeTab === 'active' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                Active ({myActive.length})
              </button>
              <button
                onClick={() => setActiveTab('resolved')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  activeTab === 'resolved' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                Resolved ({myResolved.length})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  activeTab === 'pending' ? 'bg-blue-500/20 text-blue-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pending ({myPending.length})
              </button>
            </div>
          </div>

          {/* Cards List */}
          {displayedComplaints.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-sm font-semibold text-white">No complaints found in this view</p>
              <p className="text-xs text-slate-400">Everything looks clear in your unit history.</p>
              <Link
                to="/report"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 text-white text-xs font-semibold"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Report an Issue
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedComplaints.map(c => {
                const isPending = c.status === 'PENDING_VERIFICATION';

                return (
                  <div
                    key={c.complaintId}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-md transition-all space-y-3 group"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
                          {c.complaintId}
                        </span>
                        <StatusBadge status={c.status} size="sm" />
                        <PriorityBadge priority={c.priority} />
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                        {c.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {c.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-sky-400" />
                        <span>{c.buildingId.toUpperCase()}</span>
                        <span>•</span>
                        <span>{c.exactLocation}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isPending && (
                          <button
                            onClick={() => handleWithdraw(c.complaintId)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-semibold transition-colors border border-rose-500/20"
                          >
                            <Undo2 className="w-3 h-3" />
                            Withdraw
                          </button>
                        )}
                        <Link
                          to={`/complaint/${c.complaintId}`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-xs font-semibold border border-sky-500/30 transition-colors"
                        >
                          Track Timeline
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Sidebar: Bulletins & Society Help */}
        <div className="space-y-6">
          
          {/* Announcements Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-400" />
                Society Bulletins
              </h3>
              <span className="text-[10px] uppercase font-semibold text-slate-500">Official</span>
            </div>

            <div className="space-y-3">
              {announcements.map(ann => (
                <div key={ann.announcementId} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-200">{ann.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{ann.message}</p>
                  <p className="text-[10px] text-slate-500 pt-1">
                    Posted by {ann.createdBy}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-sky-400" />
              Community Helpdesk
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Facing urgent utility disruptions? Water, lift, and electrical teams are monitored round-the-clock.
            </p>
            <div className="space-y-1.5 pt-1 text-slate-300 font-medium">
              <p>🏢 Security Guard Gate: <strong>Ext. 100</strong></p>
              <p>⚡ Maintenance Desk: <strong>Ext. 204</strong></p>
              <p>💧 Water Supply Office: <strong>Ext. 301</strong></p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
