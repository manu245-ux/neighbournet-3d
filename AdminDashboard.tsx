import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Wrench, 
  Flame, 
  Building, 
  ArrowRight, 
  BarChart3, 
  ExternalLink,
  Table,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { complaints } = useData();

  // Metric counts
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'PENDING_VERIFICATION');
  const approved = complaints.filter(c => c.status === 'APPROVED');
  const inProgress = complaints.filter(c => c.status === 'IN_PROGRESS');
  const resolved = complaints.filter(c => c.status === 'RESOLVED');
  const urgent = complaints.filter(
    c => (c.priority === 'urgent' || c.priority === 'high') && !['RESOLVED', 'REJECTED', 'WITHDRAWN'].includes(c.status)
  );

  // Chart 1: Building distribution
  const buildingData = [
    { name: 'Tower A', count: complaints.filter(c => c.buildingId === 'bldg-a').length },
    { name: 'Tower B', count: complaints.filter(c => c.buildingId === 'bldg-b').length },
    { name: 'Tower C', count: complaints.filter(c => c.buildingId === 'bldg-c').length },
    { name: 'Tower D', count: complaints.filter(c => c.buildingId === 'bldg-d').length },
  ];

  // Chart 2: Category distribution
  const categoryCounts: Record<string, number> = {};
  complaints.forEach(c => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  const categoryData = Object.entries(categoryCounts)
    .map(([cat, count]) => ({
      name: cat.length > 12 ? cat.slice(0, 12) + '...' : cat,
      count
    }))
    .slice(0, 6);

  // Needs Attention Queue: Pending longest or urgent active
  const needsAttention = complaints
    .filter(c => c.status === 'PENDING_VERIFICATION' || (c.priority === 'urgent' && c.status !== 'RESOLVED'))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(0, 5);

  const COLORS = ['#38BDF8', '#818CF8', '#A78BFA', '#F472B6', '#F59E0B', '#10B981'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            Facility Operations Desk • Admin Privileged
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Society Maintenance & Safety Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time telemetry, queue verification, and technician dispatch for Green Valley Residency.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/complaints"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/25 transition-all"
          >
            <Table className="w-4 h-4" />
            Master Operations Grid
          </Link>
          <Link
            to="/map"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <MapPin className="w-4 h-4 text-sky-400" />
            Campus Map
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total</span>
          <p className="text-2xl font-bold text-white">{total}</p>
        </div>

        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 shadow-md space-y-1">
          <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3" /> Pending
          </span>
          <p className="text-2xl font-bold text-amber-300">{pending.length}</p>
        </div>

        <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-4 shadow-md space-y-1">
          <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">Approved</span>
          <p className="text-2xl font-bold text-blue-300">{approved.length}</p>
        </div>

        <div className="bg-slate-900 border border-orange-500/30 rounded-2xl p-4 shadow-md space-y-1">
          <span className="text-[11px] font-semibold text-orange-400 uppercase tracking-wider flex items-center gap-1">
            <Wrench className="w-3 h-3" /> In Progress
          </span>
          <p className="text-2xl font-bold text-orange-300">{inProgress.length}</p>
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-4 shadow-md space-y-1">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Resolved
          </span>
          <p className="text-2xl font-bold text-emerald-300">{resolved.length}</p>
        </div>

        <div className="bg-slate-900 border border-rose-500/40 rounded-2xl p-4 shadow-md space-y-1">
          <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1">
            <Flame className="w-3 h-3" /> High / Urgent
          </span>
          <p className="text-2xl font-bold text-rose-300">{urgent.length}</p>
        </div>

      </div>

      {/* Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-400" />
              Complaints by Category (Top Categories)
            </h3>
            <span className="text-[11px] text-slate-500">Live Telemetry</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Building Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-purple-400" />
              Complaints Distribution by Tower
            </h3>
            <span className="text-[11px] text-slate-500">Green Valley Towers</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buildingData}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#A855F7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Needs Attention Priority Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Needs Immediate Attention (Pending Verification & Urgent Tickets)
            </h2>
            <p className="text-xs text-slate-400">Prioritized triage queue for facility managers</p>
          </div>

          <Link
            to="/admin/complaints"
            className="text-xs text-sky-400 hover:underline flex items-center gap-1 font-semibold"
          >
            View all tickets
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-2">
          {needsAttention.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No pending or urgent tickets require attention.</p>
          ) : (
            needsAttention.map((ticket) => (
              <div
                key={ticket.complaintId}
                className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-sky-400">{ticket.complaintId}</span>
                    <StatusBadge status={ticket.status} size="sm" />
                    <PriorityBadge priority={ticket.priority} />
                    <span className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                      {ticket.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{ticket.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin className="w-3 h-3 text-sky-400" />
                    <span>{ticket.buildingId.toUpperCase()} • {ticket.exactLocation}</span>
                  </div>
                </div>

                <Link
                  to={`/admin/review/${ticket.complaintId}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-md shadow-sky-500/20 self-start sm:self-auto"
                >
                  Review & Triage
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
