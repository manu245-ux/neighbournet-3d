import React from 'react';
import { AlertTriangle, PhoneCall } from 'lucide-react';

interface EmergencyBannerProps {
  category: string;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ category }) => {
  const isEmergency = [
    'Theft or Suspicious Activity',
    'Security Concern',
    'Fire or Safety Hazard'
  ].includes(category);

  if (!isEmergency) return null;

  return (
    <div className="bg-rose-950/70 border-2 border-rose-600/70 rounded-2xl p-4 sm:p-5 text-rose-200 shadow-xl shadow-rose-950/50 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-2.5 text-rose-300 font-bold text-sm sm:text-base">
        <span className="p-1.5 rounded-lg bg-rose-600/30 text-rose-300">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
        </span>
        CRITICAL ADVISORY: Emergency Services Notice
      </div>
      <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed">
        This platform does <strong>not</strong> replace official emergency services. For active fires, burglaries, physical threats, or immediate life danger, please contact local emergency authorities immediately before logging this ticket.
      </p>
      <div className="flex items-center gap-4 text-xs font-semibold pt-1">
        <span className="flex items-center gap-1.5 text-rose-300">
          <PhoneCall className="w-3.5 h-3.5" /> Police / Emergency: <strong>112</strong>
        </span>
        <span className="flex items-center gap-1.5 text-rose-300">
          <PhoneCall className="w-3.5 h-3.5" /> Fire Brigade: <strong>101</strong>
        </span>
        <span className="flex items-center gap-1.5 text-rose-300">
          <PhoneCall className="w-3.5 h-3.5" /> Society Guard Desk: <strong>Ext. 100</strong>
        </span>
      </div>
    </div>
  );
};
