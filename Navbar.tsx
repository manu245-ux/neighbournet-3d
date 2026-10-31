import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  LayoutDashboard, 
  Radio, 
  ShieldCheck, 
  Bell, 
  RotateCcw, 
  UserCheck,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { currentUser, isAdmin, loginAsResidentDemo, loginAsAdminDemo, logout } = useAuth();
  const { unreadNotificationCount, resetDemoData } = useData();

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-sky-400 bg-sky-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60';
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                NeighbourNet <span className="text-sky-400 text-xs px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/30">3D</span>
              </span>
              <p className="text-[10px] text-slate-400 leading-none">Green Valley Residency</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link to="/map" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${isActive('/map')}`}>
              <MapPin className="w-4 h-4" />
              Campus Map
            </Link>
            <Link to="/dashboard" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${isActive('/dashboard')}`}>
              <LayoutDashboard className="w-4 h-4" />
              Resident Hub
            </Link>
            <Link to="/feed" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${isActive('/feed')}`}>
              <Radio className="w-4 h-4" />
              Community Feed
            </Link>
            {isAdmin && (
              <Link to="/admin" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${location.pathname.startsWith('/admin') ? 'text-purple-400 bg-purple-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}>
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                Admin Console
              </Link>
            )}
          </nav>
        </div>

        {/* Right Section: Persona Switcher, Reset, Notifications */}
        <div className="flex items-center gap-3">
          
          {/* Demo Mode Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Demo Mode Active
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demo data back to clean initial state?')) {
                resetDemoData();
              }
            }}
            title="Reset seed data to initial state"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Reset Data</span>
          </button>

          {/* Quick Persona Switcher for Judges */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={loginAsResidentDemo}
              className={`px-2.5 py-1 rounded-md transition-all ${!isAdmin ? 'bg-sky-500 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              Resident
            </button>
            <button
              onClick={loginAsAdminDemo}
              className={`px-2.5 py-1 rounded-md transition-all ${isAdmin ? 'bg-purple-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              Admin
            </button>
          </div>

          {/* Notification Bell */}
          <Link
            to="/notifications"
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="In-app notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-slate-950">
                {unreadNotificationCount}
              </span>
            )}
          </Link>

          {/* Profile / User */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800 text-xs text-slate-400">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-bold">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden xl:block">
              <p className="text-white font-medium truncate max-w-[100px]">{currentUser?.name}</p>
              <p className="text-[10px] capitalize text-slate-400">{currentUser?.role}</p>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
