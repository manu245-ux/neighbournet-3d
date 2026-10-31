import React from 'react';
import { ComplaintRecord, LocationZone } from '../../types';

interface FloorSchematicProps {
  buildingName: string;
  floorName: string;
  complaints: ComplaintRecord[];
  onSelectComplaint: (complaint: ComplaintRecord) => void;
  onZoneClick: (zone: LocationZone) => void;
}

export const FloorSchematic: React.FC<FloorSchematicProps> = ({
  buildingName,
  floorName,
  complaints,
  onSelectComplaint,
  onZoneClick
}) => {
  // Center coordinates for each micro-zone
  const zoneCenters: Record<LocationZone, { x: number; y: number }> = {
    FLAT_DOOR_AREA: { x: 170, y: 110 },
    CORRIDOR: { x: 400, y: 150 },
    LIFT_LOBBY: { x: 580, y: 220 },
    STAIRCASE: { x: 220, y: 220 },
    COMMON_AREA: { x: 400, y: 310 }
  };

  // Group complaints by zone for offset calculation
  const complaintsByZone: Record<LocationZone, ComplaintRecord[]> = {
    FLAT_DOOR_AREA: [],
    CORRIDOR: [],
    LIFT_LOBBY: [],
    STAIRCASE: [],
    COMMON_AREA: []
  };

  complaints.forEach(c => {
    if (complaintsByZone[c.locationZone]) {
      complaintsByZone[c.locationZone].push(c);
    }
  });

  const getPinColor = (status: string) => {
    switch (status) {
      case 'PENDING_VERIFICATION': return '#EAB308'; // Yellow
      case 'APPROVED': return '#3B82F6';             // Blue
      case 'ASSIGNED': return '#A855F7';             // Purple
      case 'IN_PROGRESS': return '#F97316';          // Orange
      case 'RESOLVED': return '#10B981';             // Green
      default: return '#64748B';
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">{buildingName} — {floorName}</h3>
          <p className="text-xs text-slate-400">Interactive Blueprint • Click any highlighted zone or pin</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Pending</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Approved</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Progress</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Resolved</span>
        </div>
      </div>

      <svg viewBox="0 0 800 420" className="w-full h-auto select-none">
        {/* Floor Base */}
        <rect x="50" y="20" width="700" height="380" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="2" />

        {/* Flat 1 */}
        <rect x="70" y="40" width="200" height="130" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
        <text x="170" y="90" textAnchor="middle" fill="#CBD5E1" fontSize="14" fontWeight="600">Flat 01</text>
        <rect x="150" y="150" width="40" height="20" fill="#334155" rx="2" />
        <text x="170" y="164" textAnchor="middle" fill="#94A3B8" fontSize="9">DOOR</text>

        {/* Flat 2 */}
        <rect x="530" y="40" width="200" height="130" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
        <text x="630" y="90" textAnchor="middle" fill="#CBD5E1" fontSize="14" fontWeight="600">Flat 02</text>
        <rect x="610" y="150" width="40" height="20" fill="#334155" rx="2" />
        <text x="630" y="164" textAnchor="middle" fill="#94A3B8" fontSize="9">DOOR</text>

        {/* Central Corridor Zone */}
        <g className="cursor-pointer group" onClick={() => onZoneClick('CORRIDOR')}>
          <rect x="290" y="40" width="220" height="220" fill="#1E293B" fillOpacity="0.4" stroke="#64748B" strokeDasharray="4 4" rx="4" className="group-hover:fill-sky-500/10 transition-colors" />
          <text x="400" y="155" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="bold">CENTRAL CORRIDOR</text>
        </g>

        {/* Staircase (Fire Exit) */}
        <g className="cursor-pointer group" onClick={() => onZoneClick('STAIRCASE')}>
          <rect x="70" y="190" width="200" height="80" rx="6" fill="#1E293B" stroke="#EF4444" strokeWidth="1.5" className="group-hover:fill-rose-500/10 transition-colors" />
          <text x="170" y="235" textAnchor="middle" fill="#FCA5A5" fontSize="12" fontWeight="bold">STAIRCASE (FIRE EXIT)</text>
        </g>

        {/* Lift Lobby */}
        <g className="cursor-pointer group" onClick={() => onZoneClick('LIFT_LOBBY')}>
          <rect x="530" y="190" width="200" height="80" rx="6" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" className="group-hover:fill-sky-500/10 transition-colors" />
          <text x="630" y="235" textAnchor="middle" fill="#BAE6FD" fontSize="12" fontWeight="bold">ELEVATOR LOBBY</text>
        </g>

        {/* Flat 3 */}
        <rect x="70" y="290" width="200" height="90" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
        <text x="170" y="345" textAnchor="middle" fill="#CBD5E1" fontSize="14" fontWeight="600">Flat 03</text>

        {/* Utility / Common Shaft */}
        <g className="cursor-pointer group" onClick={() => onZoneClick('COMMON_AREA')}>
          <rect x="290" y="280" width="220" height="100" rx="6" fill="#1E293B" stroke="#EAB308" strokeDasharray="3 3" className="group-hover:fill-amber-500/10 transition-colors" />
          <text x="400" y="335" textAnchor="middle" fill="#FDE047" fontSize="11" fontWeight="bold">UTILITY & RISER SHAFT</text>
        </g>

        {/* Flat 4 */}
        <rect x="530" y="290" width="200" height="90" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
        <text x="630" y="345" textAnchor="middle" fill="#CBD5E1" fontSize="14" fontWeight="600">Flat 04</text>

        {/* Render Complaint Markers with Non-Overlapping Offsets */}
        {(Object.keys(complaintsByZone) as LocationZone[]).map(zone => {
          const list = complaintsByZone[zone];
          const center = zoneCenters[zone];

          return list.map((c, index) => {
            const offsetX = ((index % 3) - 1) * 24;
            const offsetY = Math.floor(index / 3) * 22;
            const posX = center.x + offsetX;
            const posY = center.y + offsetY;
            const pinColor = getPinColor(c.status);

            return (
              <g
                key={c.complaintId}
                transform={`translate(${posX}, ${posY})`}
                className="cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectComplaint(c);
                }}
              >
                {/* Ping wave for urgent/high */}
                {(c.priority === 'urgent' || c.priority === 'high') && (
                  <circle cx="0" cy="0" r="14" fill={pinColor} fillOpacity="0.3" className="animate-ping" />
                )}
                <circle cx="0" cy="0" r="11" fill={pinColor} stroke="#FFFFFF" strokeWidth="2" className="shadow-lg hover:scale-125 transition-transform origin-center" />
                <text x="0" y="3.5" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">!</text>

                {/* Micro tooltip on hover */}
                <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-30">
                  <rect x="-65" y="-36" width="130" height="24" rx="4" fill="#020617" stroke="#475569" />
                  <text x="0" y="-21" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="600">
                    {c.complaintId} • {c.category.slice(0, 10)}
                  </text>
                </g>
              </g>
            );
          });
        })}
      </svg>
    </div>
  );
};
