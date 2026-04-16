"use client";

import { useState } from "react";
import { Plus, Search, ArrowRight, Calendar, User, Layers, Shield } from "lucide-react";

export default function ProjectGrid({ projects, onSelect, onCreate }: any) {
  const [filter, setFilter] = useState("");

  const filtered = projects.filter((p: any) =>
    p.projectName?.toLowerCase().includes(filter.toLowerCase())
  );

  // Helper to determine status styles based on project state
  const getStatusConfig = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "active") {
      return {
        bg: "bg-emerald-500/5 text-emerald-500 border-emerald-500/20",
        dot: "bg-emerald-500 shadow-[0_0_8px_#10b981]",
        pulse: true
      };
    }
    if(s === "in progress"){
      return {
        bg: "bg-blue-500/5 text-blue-500 border-blue-500/20",
        dot: "bg-blue-500 shadow-[0_0_8px_#10b981]",
        pulse: true
      };
    }
    if (s === "pending") {
      return {
        bg: "bg-amber-500/5 text-amber-500 border-amber-500/20",
        dot: "bg-amber-500",
        pulse: false
      };
    }
    if (s === "closed") {
      return {
        bg: "bg-red-500/5 text-red-400 border-red-500/20",
        dot: "bg-red-400",
        pulse: false
      };
    }
    // Default / Error state
    return {
      bg: "bg-red-500/5 text-red-500 border-red-500/20",
      dot: "bg-red-500",
      pulse: false
    };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* --- ACTION BAR --- */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
          <input
            placeholder="SEARCH Projects..."
            className="w-full bg-transparent border-b border-white/10 pl-8 pr-2 py-3 outline-none focus:border-blue-500 font-mono text-[10px] tracking-widest uppercase text-white transition-all placeholder:text-gray-700"
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

      </div>

      {/* --- GRID --- */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p: any) => {
            const statusConfig = getStatusConfig(p.status);
            
            return (
              <div
                key={p._id}
                onClick={() => onSelect(p)}
                className="group relative cursor-pointer list-none"
              >
                {/* Outer Glow */}
                <div className="absolute -inset-0.5 bg-linear-to-br from-blue-600 to-purple-600 rounded-[2.5rem] opacity-0 group-hover:opacity-20 blur-xl transition duration-500"></div>

                <div className="relative bg-[#0d0d0d] border border-white/5 p-7 rounded-[2.5rem] backdrop-blur-3xl group-hover:border-white/20 group-hover:-translate-y-1 transition-all duration-300 h-full flex flex-col shadow-2xl">
                  
                  {/* Header: Status & ID */}
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[8px] font-mono text-gray-600 tracking-tighter uppercase">
                        ID // {p._id?.slice(-8).toUpperCase()}
                      </span>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit border ${statusConfig.bg}`}>
                        <span className={`w-1 h-1 rounded-full ${statusConfig.dot} ${statusConfig.pulse ? 'animate-pulse' : ''}`} />
                        <span className="text-[8px] font-black tracking-widest uppercase">{p.status || "UNKNOWN"}</span>
                      </div>
                    </div>
                    <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                      <Layers size={14} className="text-blue-500" />
                    </div>
                  </div>

                  {/* Body: Title & Lead */}
                  <div className="mb-8">
                    <h3 className="text-xl font-black mb-3 text-white group-hover:text-blue-400 transition-colors uppercase leading-tight tracking-tight">
                      {p.projectName}
                    </h3>
                    <div className="flex items-center gap-3 bg-white/3 p-3 rounded-2xl border border-white/5">
                      <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-600 to-blue-800 flex items-center justify-center text-[10px] font-bold text-white">
                         {p.teamLead?.name?.[0] || <User size={12} />}
                      </div>
                      <div>
                        <p className="text-[7px] text-gray-500 font-black uppercase tracking-widest">Team Lead</p>
                        <p className="text-[11px] text-white font-bold">{p.teamLead?.name || "Unassigned"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Team Roster: Advanced Avatar Stack */}
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center">
                      <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2">
                        <Shield size={10} className="text-blue-500" /> 
                        Team members
                      </p>
                      <div className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                        <span className="text-[9px] font-mono text-blue-400">{p.team?.length || 0} OPERATIVE(S)</span>
                      </div>
                    </div>

                    <div className="flex items-center group/stack">
                      <div className="flex -space-x-3 overflow-visible">
                        {p.team?.length > 0 ? (
                          <>
                            {p.team.slice(0, 5).map((m: any, idx: number) => (
                              <div
                                key={idx}
                                className="relative transition-all duration-500 ease-out"
                                style={{ 
                                  transitionDelay: `${idx * 50}ms`,
                                  zIndex: 10 + idx 
                                }}
                              >
                                <div
                                  title={`${m.member?.name} — ${m.role || 'Operative'}`}
                                  className="relative h-10 w-10 rounded-xl ring-[3px] ring-[#0d0d0d] bg-[#151515] border border-white/10 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover/stack:mr-1 group-hover/stack:scale-110 group-hover/stack:border-blue-500/50 cursor-crosshair shadow-lg"
                                >
                                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent" />
                                  <span className="relative text-[10px] font-black text-white group-hover/stack:text-blue-400 transition-colors">
                                    {m.member?.name?.[0]}
                                  </span>
                                  <div className="absolute top-0 left-0 w-full h-px bg-blue-500/40 animate-scan pointer-events-none" />
                                </div>
                              </div>
                            ))}
                            {p.team.length > 5 && (
                              <div className="z-30 relative h-10 w-10 rounded-xl ring-[3px] ring-[#0d0d0d] bg-[#1a1a1a] border border-white/5 flex flex-col items-center justify-center backdrop-blur-md">
                                <span className="text-[8px] font-black text-blue-500 leading-none">+{p.team.length - 5}</span>
                                <span className="text-[6px] font-mono text-gray-600 uppercase">More</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-dashed border-white/5 bg-white/1 w-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                            <p className="text-[9px] text-gray-700 font-bold uppercase tracking-widest">Personnel_Standby</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer: Date & CTA */}
                  <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={12} />
                      <span className="text-[10px] font-mono">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : '---'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-blue-500 font-black text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all">
                      Access File
                      <ArrowRight size={14} />
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/1">
          <div className="p-4 bg-white/5 rounded-full mb-4">
            <Search size={24} className="text-gray-600" />
          </div>
          <p className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.3em]">No matching operations found</p>
        </div>
      )}
    </div>
  );
}