import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  PlusCircle, 
  Filter, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  X,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { FloorSchematic } from '../components/map/FloorSchematic';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { useData } from '../context/DataContext';
import { ComplaintRecord, LocationZone } from '../types';

export const FloorIssueView: React.FC = () => {
  const { floorId } = useParams<{ floorId: string }>();
  const navigate = useNavigate();
  const { complaints } = useData();

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintRecord | null>(null);

  // Parse building and floor numbers
  const currentFloorId = floorId || 'bldg-a-f2';
  const match = currentFloorId.match(/^(bldg-[a-d])-f([0-4])$/);
  const buildingId = match ? match[1] : 'bldg-a';
  const floorNum = match ? parseInt(match[2], 10) : 2;

  const buildingNames: Record<string, string> = {
    'bldg-a': 'Building A',
    'bldg-b': 'Building B',
    'bldg-c': 'Building C',
    'bldg-d': 'Building D'
  };

  const floorNames: Record<number, string> = {
    0: 'Ground Floor',
    1: 'First Floor',
    2: 'Second Floor',
    3: 'Third Floor',
    4: 'Fourth Floor'
  };

  const buildingName = buildingNames[buildingId] || 'Building A';
  const floorName = floorNames[floorNum] || 'Second Floor';

  // Get complaints for this specific floor
  const floorComplaints = complaints.filter(c => c.floorId === currentFloorId);

  // Apply filters
  const filteredComplaints = floorComplaints.filter(c => {
    if (statusFilter === 'active') {
      return !['RESOLVED', 'REJECTED', 'WITHDRAWN'].includes(c.status);
    }
    if (statusFilter === 'resolved') {
      return c.status === 'RESOLVED';
    }
    return true;
  });

  const activeCount = floorComplaints.filter(
    c => !['RESOLVED', 'REJECTED', 'WITHDRAWN'].includes(c.status)
  ).length;

  const handleZoneClick = (zone: LocationZone) => {
    navigate(`/report?building=${buildingId}&floor=${currentFloorId}&zone=${zone}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link to="/map" className="hover:text-white flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Campus Map
            </Link>
            <span>/</span>
            <span className="text-slate-300">{buildingName}</span>
            <span>/</span>
            <span className="text-sky-400 font-semibold">{floorName}</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            {buildingName} — {floorName}
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Flats {floorNum}01 to {floorNum}04
            </span>
          </h1>
        </div>

        <button
          onClick={() => navigate(`/report?building=${buildingId}&floor=${currentFloorId}`)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold shadow-lg shadow-sky-500/25 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Report Issue on this Floor
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 px-2 font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              statusFilter === 'all' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({floorComplaints.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              statusFilter === 'active' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter('resolved')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              statusFilter === 'resolved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Resolved ({floorComplaints.filter(c => c.status === 'RESOLVED').length})
          </button>
        </div>

        <div className="text-slate-400 text-xs px-2">
          Click any zone to report directly
        </div>
      </div>

      {/* Floor Schematic Canvas */}
      <FloorSchematic
        buildingName={buildingName}
        floorName={floorName}
        complaints={filteredComplaints}
        onSelectComplaint={(c) => setSelectedComplaint(c)}
        onZoneClick={handleZoneClick}
      />

      {/* Empty State Banner if 0 complaints */}
      {filteredComplaints.length === 0 && (
        <div className="text-center py-12 px-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No issues reported on this floor</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Everything looks good on {buildingName} {floorName}! If you notice any maintenance or safety concerns, let the society team know.
          </p>
          <button
            onClick={() => navigate(`/report?building=${buildingId}&floor=${currentFloorId}`)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Report Issue Here
          </button>
        </div>
      )}

      {/* Selected Complaint Floating Card / Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono text-sky-400 font-bold">{selectedComplaint.complaintId}</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{selectedComplaint.title}</h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={selectedComplaint.status} />
              <PriorityBadge priority={selectedComplaint.priority} />
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {selectedComplaint.category}
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>{selectedComplaint.exactLocation}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">{selectedComplaint.locationZone.replace('_', ' ')}</span>
              </div>
              <p className="text-slate-300 leading-relaxed pt-1">
                {selectedComplaint.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                Logged on {new Date(selectedComplaint.createdAt).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Close
                </button>
                <Link
                  to={`/complaint/${selectedComplaint.complaintId}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-md shadow-sky-500/20"
                >
                  View Full Timeline
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
