import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  ExternalLink, 
  Table, 
  ShieldCheck, 
  MapPin,
  ChevronRight
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { useData } from '../context/DataContext';
import { ComplaintCategory, ComplaintStatus, PriorityLevel } from '../types';

export const AdminComplaintTable: React.FC = () => {
  const { complaints } = useData();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterBuilding, setFilterBuilding] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = complaints.filter(c => {
    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchId = c.complaintId.toLowerCase().includes(term);
      const matchTitle = c.title.toLowerCase().includes(term);
      const matchCat = c.category.toLowerCase().includes(term);
      const matchLoc = c.exactLocation.toLowerCase().includes(term);
      if (!matchId && !matchTitle && !matchCat && !matchLoc) return false;
    }

    // Dropdown filters
    if (filterBuilding !== 'all' && c.buildingId !== filterBuilding) return false;
    if (filterCategory !== 'all' && c.category !== filterCategory) return false;
    if (filterPriority !== 'all' && c.priority !== filterPriority) return false;
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Admin Console
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Table className="w-6 h-6 text-purple-400" />
            Master Operations Management Grid
          </h1>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 font-semibold self-start sm:self-auto">
          {filtered.length} Records Found
        </span>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by ticket ID (e.g. NN-2026-0001), keyword, or location landmark..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1 pl-1">
            <Filter className="w-3.5 h-3.5 text-purple-400" /> Filter:
          </span>

          <select
            value={filterBuilding}
            onChange={(e) => setFilterBuilding(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="all">All Towers</option>
            <option value="bldg-a">Tower A</option>
            <option value="bldg-b">Tower B</option>
            <option value="bldg-c">Tower C</option>
            <option value="bldg-d">Tower D</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="all">All Categories</option>
            <option value="Water Leakage">Water Leakage</option>
            <option value="Electricity Failure">Electricity Failure</option>
            <option value="Lift Malfunction">Lift Malfunction</option>
            <option value="Garbage and Sanitation">Garbage and Sanitation</option>
            <option value="Security Concern">Security Concern</option>
            <option value="Theft or Suspicious Activity">Theft / Suspicious</option>
            <option value="Road Damage">Road Damage</option>
            <option value="Fire or Safety Hazard">Fire Hazard</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING_VERIFICATION">Pending Verification</option>
            <option value="APPROVED">Approved</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          {(searchTerm || filterBuilding !== 'all' || filterCategory !== 'all' || filterPriority !== 'all' || filterStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterBuilding('all');
                setFilterCategory('all');
                setFilterPriority('all');
                setFilterStatus('all');
              }}
              className="text-xs text-rose-400 hover:underline pl-2"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Operations Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Title & Category</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Submitted</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No tickets found matching the specified search or filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(c => (
                  <tr key={c.complaintId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-sky-400 whitespace-nowrap">
                      {c.complaintId}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-white truncate max-w-xs">{c.title}</p>
                      <p className="text-[11px] text-slate-400">{c.category}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-sky-400" />
                        <span>{c.buildingId.toUpperCase()} • {c.floorId.split('-')[1]?.toUpperCase()}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate max-w-[140px]">{c.exactLocation}</p>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Link
                        to={`/admin/review/${c.complaintId}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 font-semibold border border-sky-500/30 transition-colors"
                      >
                        Review
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
