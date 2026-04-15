"use client";

import { useState } from "react";

export default function ProjectGrid({ projects, onSelect, onCreate }: any) {
  const [filter, setFilter] = useState("");

  const filtered = projects.filter((p: any) =>
    p.projectName?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96 group">
          <input
            placeholder="FILTER_OPERATIONS..."
            className="w-full bg-transparent border-b border-white/10 p-2 outline-none focus:border-blue-500 font-mono text-xs uppercase text-white transition-all"
            onChange={(e) => setFilter(e.target.value)}
          />
          <div className="absolute bottom-0 left-0 h-px w-0 bg-blue-500 group-focus-within:w-full transition-all duration-500"></div>
        </div>

        <button
          onClick={onCreate}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all active:scale-95 text-white"
        >
          Initialize New Project
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((p: any) => (
          <div
            key={p._id}
            onClick={() => onSelect(p)}
            className="relative group cursor-pointer"
          >
            {/* Hover Glow Effect */}
            <div className="absolute -inset-0.5 bg-linear-to-r from-blue-600 to-cyan-500 rounded-[2.5rem] opacity-0 group-hover:opacity-10 blur-xl transition duration-500"></div>

            <div className="relative bg-[#0b0d11] border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md group-hover:border-white/20 transition-all h-full flex flex-col shadow-2xl">
              
              {/* Top Meta Row */}
              <div className="flex justify-between items-center mb-6">
                <span className={`px-3 py-1 rounded-full text-[8px] font-black tracking-widest uppercase ${
                  p.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                  p.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                  'bg-red-500/10 text-red-500 border border-red-500/20'
                }`}>
                  {p.status || "UNKNOWN"}
                </span>
                <span className="text-[9px] font-mono text-gray-600">
                  Project ID: {p._id?.slice(-8).toUpperCase()}
                </span>
              </div>

              {/* Title Section */}
              <div className="mb-6">
                <h3 className="text-2xl font-black mb-1 text-white group-hover:text-blue-400 transition-colors uppercase">
                  {p.projectName}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Lead: <span className="text-white">{p.teamLead?.name || "UNASSIGNED"}</span>
                  </p>
                </div>
              </div>

              {/* Detail Roster Section */}
              <div className="space-y-4 mb-8 grow">
                <p className="text-[8px] font-black text-blue-500/50 uppercase tracking-[0.3em] border-b border-white/5 pb-2">
                  Team
                </p>
                
                <div className="space-y-3">
                  {p.team?.length > 0 ? (
                    p.team.map((m: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-white/2 p-3 rounded-xl border border-white/5 group-hover:bg-white/4 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-lg bg-blue-600/20 flex items-center justify-center text-[10px] font-black text-blue-400 border border-blue-500/20">
                            {m.member?.name?.[0] || "?"}
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-white leading-none">
                              {m.member?.name || "Unknown"}
                            </p>
                            <p className="text-[8px] text-gray-500 uppercase font-black tracking-tighter">
                              {m.role || "Developer"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] font-mono text-blue-500/80 uppercase">
                            MOD_{m.module || "GEN"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center border border-dashed border-white/5 rounded-xl">
                      <p className="text-[9px] text-gray-600 font-black italic uppercase tracking-widest">No Operatives Deployed</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress/Footer */}
              <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Created on</p>
                  <p className="text-[10px] font-mono text-gray-400">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all">
                  Edit
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}