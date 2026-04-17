"use client";

import { useState } from "react";
import { Search, ArrowRight, Layers, Shield, Zap, X, Terminal, Cpu } from "lucide-react";

export default function ProjectGrid({ projects, onSelect }: any) {
  const [filter, setFilter] = useState("");

  const filtered = projects.filter((p: any) =>
    p.projectName?.toLowerCase().includes(filter.toLowerCase())
  );

  const getStatusConfig = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "active") return { label: "PLANNING", color: "yellow", pulse: false, glow: "shadow-yellow-500/10" };
    if (s === "in progress") return { label: "ACTIVE/RUNNING", color: "blue", pulse: true, glow: "shadow-blue-500/20" };
    if (s === "pending") return { label: "COMPLETED", color: "emerald", pulse: false, glow: "shadow-emerald-500/10" };
    if (s === "closed") return { label: "CANCELLED", color: "red", pulse: false, glow: "shadow-red-500/10" };
    return { label: "UNKNOWN", color: "gray", pulse: false, glow: "" };
  };

  const getRoleStyle = (role: string) => {
    const r = role?.toLowerCase();
    if (r === "designer") return "text-purple-400 border-purple-500/30 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]";
    if (r === "qa tester") return "text-orange-400 border-orange-500/30 bg-orange-500/10 shadow-[0_0_15px_rgba(251,146,60,0.15)]";
    if (r === "intern") return "text-gray-500 border-white/10 bg-white/5";
    if (r === "backend developer") return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_15px_rgba(52,211,153,0.15)]";
    return "text-blue-400 border-blue-500/30 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.15)]";
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">ALL PROJECTS</h2>
          <div className="flex items-center gap-3 text-blue-500 font-mono text-[10px] tracking-[0.3em]">
            <Terminal size={12} /> SYSTEM STATUS:  TOTAL {projects.length} PROJECTS
          </div>
        </div>

        {/* SEARCH COMMAND BAR */}
        <div className="relative w-full max-w-md group">
          <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
          <div className="relative flex items-center bg-white/3 border border-white/10 rounded-2xl px-5 py-3.5 focus-within:border-blue-500/50 transition-all">
            <Search className="w-4 h-4 text-gray-600 group-focus-within:text-blue-400 transition-colors" />
            <input
              placeholder="ENTER PROJECT NAME..."
              className="bg-transparent border-none w-full ml-4 outline-none text-[10px] font-mono tracking-[0.2em] text-white placeholder:text-gray-700"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            {filter && (
              <button onClick={() => setFilter("")} className="ml-2 text-gray-600 hover:text-white transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* THE GRID */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((p: any) => {
            const config = getStatusConfig(p.status);
            return (
              <div
                key={p._id}
                onClick={() => onSelect(p)}
                className="group relative h-105 cursor-pointer"
              >
                {/* ACTIVE GLOW EFFECT */}
                <div className={`absolute inset-0 bg-${config.color}-500/5 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                <div className="relative h-112.5 bg-linear-to-b from-[#0f0f0f] via-[#0a0a0a] to-[#080808] border border-white/8 group-hover:border-white/20 rounded-[3rem] p-10 flex flex-col transition-all duration-500 ease-out group-hover:-translate-y-3 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden">

                  {/* SCANLINE / NOISE OVERLAY */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

                  {/* TOP ROW */}
                  <div className="flex justify-between items-start mb-8 shrink-0">
                    <div className={`flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-${config.color}-500/20 bg-${config.color}-500/5 ${config.glow}`}>
                      <span className={`w-1.5 h-1.5 rounded-full bg-${config.color}-500 ${config.pulse ? 'animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]' : ''}`} />
                      <span className={`text-[9px] font-black tracking-[0.2em] text-${config.color}-500 uppercase`}>{config.label}</span>
                    </div>
                    <div className="w-12 h-12 bg-white/3 rounded-2xl border border-white/5 flex items-center justify-center text-gray-600 group-hover:text-blue-500 group-hover:border-blue-500/30 transition-all duration-500 shrink-0">
                      <Cpu size={20} />
                    </div>
                  </div>

                  {/* PROJECT INFO - flex-1 pushes everything below it to the bottom */}
                  <div className="flex-1 min-h-0">
                    <h3 className="text-3xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-white group-hover:to-blue-400 transition-all duration-500 leading-tight mb-6 uppercase tracking-tighter line-clamp-2">
                      {p.projectName}
                    </h3>

                    <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-white/2 border border-white/5 group-hover:bg-white/4 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
                        <Shield size={16} className="text-blue-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[8px] font-mono text-gray-600 uppercase tracking-widest truncate">Lead Investigator</p>
                        <p className="text-sm font-bold text-gray-200 truncate">{p.teamLead?.name || "UNASSIGNED"}</p>
                      </div>
                    </div>
                  </div>

                  {/* PERSONNEL STACK - UNIFIED SPACING */}
                  <div className="py-6 border-t border-white/5 shrink-0 mt-6">
                    <div className="mx-4 flex items-center gap-2">
                      
                        {/* Logic: Show max 3 members + count to keep layout clean */}
                        {p.team?.slice(0, 3).map((m: any, idx: number) => (
                          <div
                            key={idx}
                            className={`group/member relative w-11 h-11 rounded-xl border flex items-center justify-center text-[11px] font-black shadow-2xl ring-4 ring-[#0a0a0a] transition-all duration-300 hover:-translate-y-2 hover:z-50 bg-[#111] ${getRoleStyle(m.role)}`}
                          >
                            {m.member?.name?.[0] || "?"}

                            {/* LARGE TOOLTIP */}
                            <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/95 border border-white/20 rounded-xl text-[11px] font-mono whitespace-nowrap opacity-0 group-hover/member:opacity-100 pointer-events-none transition-all scale-90 group-hover/member:scale-100 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-100">
                              <span className="text-white font-bold block mb-1">{m.member?.name}</span>
                              <span className="text-blue-400 text-[9px] uppercase tracking-widest font-black">{m.role || 'Contributor'}</span>
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-x-[6px] border-x-transparent border-t-[6px] border-t-black" />
                            </div>
                          </div>
                        ))}
                        {p.team?.length > 3 && (
                          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[10px] font-black text-blue-500 ring-4 ring-[#0a0a0a] relative z-0">
                            +{p.team.length - 3}
                          </div>
                        )}
                      

                    </div>
                  </div>

                  {/* FOOTER ACTION */}
                  <div className="flex items-center justify-between pt-6 group/btn border-t border-white/4 shrink-0">
                    <span className="text-[9px] font-mono text-gray-800 tracking-widest uppercase">Secured_Entry</span>
                    <div className="flex items-center gap-2 text-blue-500 text-[10px] font-black tracking-[0.2em] group-hover:text-blue-400 transition-all">
                      EDIT <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform duration-500" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-80 flex flex-col items-center justify-center border border-white/5 rounded-[3rem] bg-white/1 border-dashed">
          <Zap size={40} className="text-gray-800 animate-pulse mb-6" />
          <h3 className="text-white font-black uppercase text-xl">No Projects Found</h3>
          <p className="text-gray-700 font-mono text-[10px] tracking-[0.4em] mt-2">ADJUST SEARCH PARAMETERS</p>
        </div>
      )}
    </div>
  );
}