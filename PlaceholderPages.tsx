import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Shield, AlertCircle, PlusCircle, LayoutDashboard, MapPin, Radio, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { loginAsResidentDemo, loginAsAdminDemo } = useAuth();

  return (
    <div className="py-16 px-4 max-w-5xl mx-auto text-center space-y-8">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
        <Building2 className="w-4 h-4" />
        Interactive Digital Society & Community Safety Management
      </div>
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
        Your neighbourhood. <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
          Your voice. Your safety.
        </span>
      </h1>
      <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400">
        Say goodbye to lost complaints in WhatsApp groups. NeighbourNet 3D ties every report to a specific building and floor with complete transparency and real-time tracking.
      </p>

      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <Link
          to="/map"
          className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold shadow-lg shadow-sky-500/25 flex items-center gap-2 transition-all"
        >
          <MapPin className="w-5 h-5" />
          Explore Campus Map
        </Link>
        <Link
          to="/dashboard"
          onClick={loginAsResidentDemo}
          className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold border border-slate-700 flex items-center gap-2 transition-all"
        >
          <LayoutDashboard className="w-5 h-5 text-sky-400" />
          Resident Portal (Demo)
        </Link>
        <Link
          to="/admin"
          onClick={loginAsAdminDemo}
          className="px-6 py-3 rounded-xl bg-purple-900/40 hover:bg-purple-800/50 text-purple-200 font-semibold border border-purple-700/50 flex items-center gap-2 transition-all"
        >
          <Shield className="w-5 h-5 text-purple-400" />
          Admin Console (Demo)
        </Link>
      </div>
    </div>
  );
};

export const LoginPage: React.FC = () => {
  const { loginAsResidentDemo, loginAsAdminDemo } = useAuth();

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Sign In to NeighbourNet 3D</h2>
          <p className="text-xs text-slate-400">Select a pre-configured persona for instant testing</p>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            to="/dashboard"
            onClick={loginAsResidentDemo}
            className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/20"
          >
            Sign in as Resident (Kavita Sharma)
          </Link>
          <Link
            to="/admin"
            onClick={loginAsAdminDemo}
            className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-600/20"
          >
            Sign in as Admin (Major Vikram Rathore)
          </Link>
        </div>
      </div>
    </div>
  );
};

export const NotFoundPage: React.FC = () => (
  <div className="py-24 text-center space-y-4">
    <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
    <h2 className="text-2xl font-bold text-white">404 — Page Not Found</h2>
    <p className="text-slate-400 text-sm">The requested route does not exist in Green Valley Residency portal.</p>
    <Link to="/" className="inline-block px-4 py-2 rounded-lg bg-sky-500 text-white text-xs font-semibold">
      Return to Home
    </Link>
  </div>
);
