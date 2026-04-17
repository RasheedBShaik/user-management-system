"use client";

import { useState } from "react";
import { Search, ArrowRight, Calendar, User, Layers, Shield, Zap, X } from "lucide-react";

export default function ProjectGrid({ projects, onSelect }: any) {
  const [filter, setFilter] = useState("");

  const filtered = projects.filter((p: any) =>
    p.projectName?.toLowerCase().includes(filter.toLowerCase())
  );

  const getStatusConfig = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "active") return { label: "PLANNING", color: "amber", pulse: false };
    if (s === "in progress") return { label: "ACTIVE/RUNNING", color: "blue", pulse: true };
    if (s === "pending") return { label: "COMPLETED", color: "emerald", pulse: false };
    if (s === "closed") return { label: "CANCELLED", color: "red", pulse: false };
    return { label: "UNKNOWN", color: "gray", pulse: false };
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* SEARCH COMMAND BAR */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-2xl group">
          {/* OUTER GLOW EFFECT */}
          <div className="absolute -inset-1 bg-linear-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition duration-1000"></div>

          {/* MAIN CONTAINER */}
          <div className="relative flex items-center bg-[#050505] border border-white/10 rounded-2xl px-6 py-4 shadow-2xl">
            <Search className="w-5 h-5 text-blue-500/50 group-focus-within:text-blue-400 transition-colors" />

            <input
              placeholder="ENCRYPTED SEARCH..."
              className="bg-transparent border-none w-full ml-4 outline-none text-[11px] font-mono tracking-[0.3em] text-white placeholder:text-gray-700"
              value={filter} // Essential for the clear button to work
              onChange={(e) => setFilter(e.target.value)}
            />

            {/* DELETE / CLEAR OPTION (Now inside the container) */}
            {filter && (
              <button
                onClick={() => setFilter("")}
                className="ml-2 p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300 group/clear"
                title="Clear Search"
              >
                <X size={14} className="group-hover/clear:rotate-90 transition-transform duration-300" />
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
                className="group relative h-95 cursor-pointer"
              >
                {/* BACKDROP GLOW */}
                <div className={`absolute -inset-0.5 bg-linear-to-b from-${config.color}-500/20 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition duration-500 blur-xl`}></div>

                <div className="relative h-full bg-[#0a0a0a] border border-white/5 group-hover:border-white/20 rounded-[2.5rem] p-8 flex flex-col transition-all duration-500 group-hover:-translate-y-2 overflow-hidden">

                  {/* SCANLINE EFFECT */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%]"></div>

                  {/* TOP ROW */}
                  <div className="flex justify-between items-start mb-6">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border border-${config.color}-500/20 bg-${config.color}-500/5`}>
                      <span className={`w-1.5 h-1.5 rounded-full bg-${config.color}-500 ${config.pulse ? 'animate-pulse' : ''}`} />
                      <span className={`text-[9px] font-black tracking-widest text-${config.color}-500 uppercase`}>{config.label}</span>
                    </div>
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 group-hover:rotate-12 transition-transform">
                      <Layers size={16} className="text-blue-500" />
                    </div>
                  </div>

                  {/* PROJECT INFO */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors leading-tight mb-4 uppercase tracking-tighter">
                      {p.projectName}
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                          <Shield size={14} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-[8px] font-mono text-gray-600 uppercase tracking-widest">Team Lead</p>
                          <p className="text-xs font-bold text-gray-300">{p.teamLead?.name || "UNASSIGNED"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PERSONNEL STACK */}
                  <div className="py-6 border-t border-white/5 mt-auto">
                    <div className="flex -space-x-3">
                      {p.team?.slice(0, 4).map((m: any, idx: number) => (
                        <div key={idx} className="w-9 h-9 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center text-[10px] font-bold text-blue-400 shadow-xl ring-2 ring-[#0a0a0a]">
                          {m.member?.name?.[0] || "?"}
                        </div>
                      ))}
                      {p.team?.length > 4 && (
                        <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[9px] font-black text-blue-500 ring-2 ring-[#0a0a0a]">
                          +{p.team.length - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* FOOTER BUTTON */}
                  <div className="flex items-center justify-between group/btn">
                    <span className="text-[10px] font-mono text-gray-700 tracking-tighter uppercase">ACCESS_LEVEL: OPT_04</span>
                    <div className="flex items-center gap-2 text-blue-500 text-[10px] font-black tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-all">
                      VIEW_DATA <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/1">
          <Zap size={32} className="text-gray-800 animate-pulse mb-4" />
          <p className="text-gray-700 font-mono text-xs tracking-widest">ZERO OPERATIONS DETECTED</p>
        </div>
      )}
    </div>
  );
}