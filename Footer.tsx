import React from 'react';
import { ShieldCheck, Sparkles, Building } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-sky-400" />
          <span className="font-semibold text-slate-300">NeighbourNet 3D</span>
          <span>• Green Valley Residency Maintenance & Safety System</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            100% Deterministic (Zero-AI)
          </span>
          <span className="inline-flex items-center gap-1 text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            24h Hackathon MVP
          </span>
        </div>
      </div>
    </footer>
  );
};
