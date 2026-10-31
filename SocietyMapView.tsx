import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  Layers, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  PlusCircle, 
  Info,
  MapPin
} from 'lucide-react';
import { CampusSvgMap } from '../components/map/CampusSvgMap';
import { useData } from '../context/DataContext';

export const SocietyMapView: React.FC = () => {
  const navigate = useNavigate();
  const { complaints } = useData();
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('bldg-a');

  const buildingNames: Record<string, string> = {
    'bldg-a': 'Building A',
    'bldg-b': 'Building B',
    'bldg-c': 'Building C',
    'bldg-d': 'Building D'
  };

  const currentBuildingName = buildingNames[selectedBuildingId] || 'Building A';

  // Calculate building stats
  const buildingComplaints = complaints.filter(c => c.buildingId === selectedBuildingId);
  const activeBuildingComplaints = buildingComplaints.filter(
    c => !['RESOLVED', 'REJECTED', 'WITHDRAWN'].includes(c.status)
  );
  const resolvedBuildingComplaints = buildingComplaints.filter(c => c.status === 'RESOLVED');

  // Floors: 4, 3, 2, 1, 0 (Ground)
  const floors = [
    { num: 4, label: 'Fourth Floor', id: `${selectedBuildingId}-f4` },
    { num: 3, label: 'Third Floor', id: `${selectedBuildingId}-f3` },
    { num: 2, label: 'Second Floor', id: `${selectedBuildingId}-f2` },
    { num: 1, label: 'First Floor', id: `${selectedBuildingId}-f1` },
    { num: 0, label: 'Ground Floor', id: `${selectedBuildingId}-f0` }
  ];

  const getFloorActiveCount = (floorId: string) => {
    return complaints.filter(
      c => c.floorId === floorId && !['RESOLVED', 'REJECTED', 'WITHDRAWN'].includes(c.status)
    ).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <MapPin className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Interactive Society Campus</h1>
              <p className="text-xs text-slate-400">Green Valley Residency • Select a building to inspect floor schematics</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate(`/report?building=${selectedBuildingId}`)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold shadow-lg shadow-sky-500/25 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Report Issue Here
        </button>
      </div>

      {/* Main Grid: SVG Canvas (2/3) + Building Details Inspector (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left: Interactive Canvas */}
        <div className="lg:col-span-2">
          <CampusSvgMap
            complaints={complaints}
            selectedBuildingId={selectedBuildingId}
            onSelectBuilding={(id) => setSelectedBuildingId(id)}
          />
        </div>

        {/* Right: Building Inspector Drawer / Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider">
                <Building className="w-4 h-4" />
                Active Building Selection
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">{currentBuildingName}</h2>
              <p className="text-xs text-slate-400">5 Floors • 20 Residential Units</p>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300">
              {selectedBuildingId.toUpperCase()}
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                Active Issues
              </div>
              <p className="text-2xl font-bold text-white mt-1">{activeBuildingComplaints.length}</p>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Resolved
              </div>
              <p className="text-2xl font-bold text-white mt-1">{resolvedBuildingComplaints.length}</p>
            </div>
          </div>

          {/* Floor Selection List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Select Floor Schematic
              </span>
              <span>Active Issues</span>
            </div>

            <div className="space-y-2">
              {floors.map((floor) => {
                const count = getFloorActiveCount(floor.id);
                return (
                  <button
                    key={floor.id}
                    onClick={() => navigate(`/map/floor/${floor.id}`)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all text-left group"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-200 group-hover:text-sky-400 transition-colors">
                        {floor.label}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Flats {floor.num}01 to {floor.num}04
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        count > 0 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {count > 0 ? `${count} Issues` : 'Clear'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Direct CTA */}
          <button
            onClick={() => navigate(`/report?building=${selectedBuildingId}`)}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-sky-400" />
            Report Issue in {currentBuildingName}
          </button>

        </div>

      </div>

    </div>
  );
};
