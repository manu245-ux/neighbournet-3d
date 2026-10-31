import React, { useState } from 'react';
import { ComplaintRecord } from '../../types';

interface CampusMapProps {
  complaints: ComplaintRecord[];
  onSelectBuilding: (buildingId: string) => void;
  selectedBuildingId?: string;
}

export const CampusSvgMap: React.FC<CampusMapProps> = ({
  complaints,
  onSelectBuilding,
  selectedBuildingId
}) => {
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);

  const buildings = [
    { id: 'bldg-a', name: 'Building A', x: 80, y: 70, width: 220, height: 170 },
    { id: 'bldg-b', name: 'Building B', x: 500, y: 70, width: 220, height: 170 },
    { id: 'bldg-c', name: 'Building C', x: 80, y: 350, width: 220, height: 170 },
    { id: 'bldg-d', name: 'Building D', x: 500, y: 350, width: 220, height: 170 },
  ];

  const getActiveCount = (bldgId: string) => {
    return complaints.filter(
      c => c.buildingId === bldgId && !['RESOLVED', 'REJECTED', 'WITHDRAWN'].includes(c.status)
    ).length;
  };

  const getSeverityBadgeColor = (bldgId: string) => {
    const active = complaints.filter(
      c => c.buildingId === bldgId && !['RESOLVED', 'REJECTED', 'WITHDRAWN'].includes(c.status)
    );
    if (active.some(c => c.priority === 'urgent' || c.priority === 'high')) return '#EF4444'; // Red
    if (active.some(c => c.status === 'IN_PROGRESS')) return '#F97316'; // Orange
    if (active.some(c => c.status === 'PENDING_VERIFICATION')) return '#EAB308'; // Yellow
    if (active.length > 0) return '#3B82F6'; // Blue
    return '#10B981'; // Green
  };

  return (
    <div className="relative w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 p-2 sm:p-4">
      {/* HUD Info */}
      <div className="absolute top-4 left-4 z-10 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-slate-700/80 text-xs text-slate-300 shadow-md">
        <span className="font-semibold text-white">Green Valley Residency</span> • Campus Vector View
      </div>

      <svg viewBox="0 0 800 600" className="w-full h-auto select-none">
        <defs>
          <linearGradient id="roadFill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
          <pattern id="lawn" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="#064E3B" fillOpacity="0.35" />
            <circle cx="2" cy="2" r="1.5" fill="#047857" fillOpacity="0.6" />
          </pattern>
        </defs>

        {/* Campus Base Lawn */}
        <rect width="800" height="600" fill="url(#lawn)" rx="16" />

        {/* Internal Roads */}
        <path d="M 350 0 L 450 0 L 450 600 L 350 600 Z" fill="url(#roadFill)" />
        <path d="M 0 270 L 800 270 L 800 330 L 0 330 Z" fill="url(#roadFill)" />
        <circle cx="400" cy="300" r="46" fill="#1E293B" stroke="#475569" strokeWidth="3" />

        {/* Central Fountain & Green Island */}
        <rect x="365" y="265" width="70" height="70" rx="35" fill="#059669" />
        <text x="400" y="304" textAnchor="middle" fill="#ECFDF5" fontSize="10" fontWeight="bold">GARDEN</text>

        {/* Main Entrance Gate & Security */}
        <rect x="360" y="555" width="80" height="35" rx="4" fill="#475569" stroke="#94A3B8" strokeWidth="1.5" />
        <text x="400" y="577" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">MAIN GATE</text>

        {/* Buildings */}
        {buildings.map((b) => {
          const count = getActiveCount(b.id);
          const badgeColor = getSeverityBadgeColor(b.id);
          const isSelected = selectedBuildingId === b.id;
          const isHovered = hoveredBuilding === b.id;

          return (
            <g
              key={b.id}
              className="cursor-pointer transition-all duration-200"
              onClick={() => onSelectBuilding(b.id)}
              onMouseEnter={() => setHoveredBuilding(b.id)}
              onMouseLeave={() => setHoveredBuilding(null)}
            >
              {/* Drop Shadow */}
              <rect
                x={b.x + 6}
                y={b.y + 6}
                width={b.width}
                height={b.height}
                rx="12"
                fill="#020617"
                fillOpacity="0.7"
              />

              {/* Building Base */}
              <rect
                x={b.x}
                y={b.y}
                width={b.width}
                height={b.height}
                rx="12"
                fill={isSelected ? '#1E293B' : isHovered ? '#334155' : '#1E293B'}
                stroke={isSelected ? '#38BDF8' : isHovered ? '#94A3B8' : '#475569'}
                strokeWidth={isSelected ? 3.5 : 1.5}
              />

              {/* Architectural accent lines */}
              <line x1={b.x + 16} y1={b.y + 20} x2={b.x + b.width - 16} y2={b.y + 20} stroke="#475569" strokeDasharray="3 3" />
              <line x1={b.x + 16} y1={b.y + b.height - 20} x2={b.x + b.width - 16} y2={b.y + b.height - 20} stroke="#475569" strokeDasharray="3 3" />

              <text x={b.x + b.width / 2} y={b.y + 52} textAnchor="middle" fill="#F8FAFC" fontSize="17" fontWeight="bold">
                {b.name}
              </text>
              <text x={b.x + b.width / 2} y={b.y + 75} textAnchor="middle" fill="#94A3B8" fontSize="12">
                5 Floors • 20 Flats
              </text>

              {/* Status Pill Badge */}
              <g transform={`translate(${b.x + b.width / 2 - 48}, ${b.y + 105})`}>
                <rect width="96" height="28" rx="14" fill={badgeColor} fillOpacity="0.25" stroke={badgeColor} strokeWidth="1.5" />
                <circle cx="16" cy="14" r="5" fill={badgeColor} />
                <text x="54" y="18" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="600">
                  {count === 0 ? 'All Clear' : `${count} Active`}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
