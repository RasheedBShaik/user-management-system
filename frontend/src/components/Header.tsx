"use client";

import { useState, useEffect } from "react";

interface HeaderProps {
  onSignOut: () => void;
}

export default function Header({ onSignOut }: HeaderProps) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          A
        </div>
        <div>
          <h1 className="text-xl font-bold  tracking-tight">Admin Dashboard</h1>
          <p className="text-xs text-gray-500 font-medium">System Management</p>
        </div>
      </div>

      {/* Actions & Clock */}
      <div className="flex items-center gap-6">
        <div className="hidden sm:block text-right border-r border-gray-200 pr-6">
          <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Current Time</p>
          <p className="text-sm font-mono text-gray-600">{time || "00:00:00"}</p>
        </div>

        <button
          onClick={onSignOut}
          className="px-5 py-2.5 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-red-600 hover:text-white transition-colors border border-red-100"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}