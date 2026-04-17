"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, ShieldCheck, Trash2, Fingerprint, Activity, Phone, RefreshCw, Loader2 } from "lucide-react";
import API from "../services/api";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  assignedProjects?: any[];
}

export default function UserTable({ users, onRefresh }: { users: User[], onRefresh: () => void }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [search, setSearch] = useState("");

  // --- AUTOMATIC REAL-TIME SYNC (Polling) ---
  useEffect(() => {
    // Poll the database every 5 seconds to catch user-side updates
    const interval = setInterval(() => {
      onRefresh();
    }, 5000);

    return () => clearInterval(interval); // Clean up on page close
  }, [onRefresh]);

  const handleManualRefresh = async () => {
    setIsSyncing(true);
    await onRefresh();
    setTimeout(() => setIsSyncing(false), 600);
  };

  const sortedUsers = useMemo(() => {
    return [...users]
      .sort((a, b) => {
        const priority: Record<string, number> = { admin: 1, manager: 2, user: 3 };
        const aP = priority[a.role.toLowerCase()] || 4;
        const bP = priority[b.role.toLowerCase()] || 4;
        if (aP !== bP) return aP - bP;
        return a.name.localeCompare(b.name);
      })
      .filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) || 
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.phone && u.phone.includes(search))
      );
  }, [users, search]);

  const updateStatus = async (id: string, newStatus: "active" | "inactive") => {
    setLoadingId(id);
    try {
      await API.put(`/users/${id}`, { status: newStatus });
      onRefresh(); 
    } catch (err: any) {
      console.error("Backend Error:", err.response?.data || err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`PERMANENTLY WIPE OPERATIVE: ${name.toUpperCase()}?`)) return;
    try {
      await API.delete(`/users/${id}`);
      onRefresh();
    } catch (err) {
      console.error("Delete Protocol Failed.");
    }
  };

  return (
    <div className="space-y-6">
      {/* --- SEARCH & ACTION HEADER --- */}
      <div className="flex flex-col md:flex-row gap-4 p-2 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={14} className="text-gray-500 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input 
            placeholder="SEARCH BY IDENTITY..."
            className="w-full bg-white/5 border border-white/10 pl-11 pr-4 py-4 rounded-2xl outline-none focus:border-blue-500/50 focus:bg-blue-500/5 font-mono text-[10px] tracking-[0.2em] transition-all placeholder:text-gray-600 shadow-2xl"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          {/* SYNC INDICATOR */}
          <button 
            onClick={handleManualRefresh}
            className="flex items-center gap-2 px-4 py-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl hover:bg-blue-500/20 transition-all group"
          >
            <RefreshCw size={14} className={`text-blue-400 ${isSyncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Live_Sync</span>
          </button>

          <div className="flex items-center gap-4 px-6 py-3 bg-gray-900/40 rounded-2xl border border-white/5 backdrop-blur-md">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Total Strength</span>
              <div className="h-4 w-px bg-white/10" />
              <span className="text-blue-500 font-mono text-xs font-bold">{sortedUsers.length.toString().padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* --- TABLE CONTAINER --- */}
      <div className="p-1 bg-white/2 rounded-[2.2rem] border border-white/5 shadow-inner">
        <div className="relative bg-[#0a0a0a] rounded-4xl overflow-hidden border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-white/2">
                  <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 border-b border-white/5">Operative</th>
                  <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 border-b border-white/5">Security Clearance</th>
                  <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 border-b border-white/5">Status Control</th>
                  <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 border-b border-white/5 text-right">Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/3">
                {sortedUsers.map((user) => (
                  <tr 
                    key={user._id} 
                    className={`group hover:bg-white/3 transition-all duration-300 ${
                      user.role === 'admin' ? 'bg-blue-500/2' : ''
                    }`}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                            user.role === 'admin' 
                              ? 'border-blue-500/40 bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                              : 'border-white/10 bg-white/5 text-gray-400'
                          }`}>
                            {user.role === 'admin' ? <Fingerprint size={18} /> : user.name[0]}
                          </div>
                          {user.status === 'active' && (
                            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#0a0a0a] rounded-full shadow-lg shadow-emerald-500/40" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className={`font-bold tracking-tight text-sm ${user.role === 'admin' ? 'text-blue-100' : 'text-gray-300'}`}>
                              {user.name}
                            </p>
                            {user.role === 'admin' && <ShieldCheck size={12} className="text-blue-500" />}
                          </div>
                          <div className="space-y-0.5 mt-0.5">
                            <p className="text-[10px] font-mono text-gray-600 group-hover:text-gray-400 transition-colors tracking-tight">
                              {user.email}
                            </p>
                            <div className="flex items-center gap-1.5 text-[9px] font-mono text-blue-500/60 group-hover:text-blue-400/80 transition-colors">
                              <Phone size={10} />
                              <span>{user.phone || "UNLINKED_MOBILE"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-tighter ${
                          user.role === 'admin' 
                          ? 'border-blue-500/20 bg-blue-500/10 text-blue-400' 
                          : 'border-white/10 bg-white/5 text-gray-500'
                      }`}>
                          <div className={`w-1 h-1 rounded-full ${user.role === 'admin' ? 'bg-blue-400' : 'bg-gray-600'}`} />
                          {user.role}
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      {user.role === 'admin' ? (
                        <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-blue-500/40 uppercase">
                          <Activity size={10} className="animate-pulse" /> Master_Auth
                        </div>
                      ) : (
                        <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 w-fit">
                          <button
                            onClick={() => updateStatus(user._id, "active")}
                            disabled={loadingId === user._id}
                            className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                              user.status === "active" 
                              ? "bg-emerald-500/20 text-emerald-400 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]" 
                              : "text-gray-600 hover:text-gray-300"
                            }`}
                          >
                            active
                          </button>
                          <button
                            onClick={() => updateStatus(user._id, "inactive")}
                            disabled={loadingId === user._id}
                            className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                              user.status === "inactive" 
                              ? "bg-red-500/20 text-red-400 shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]" 
                              : "text-gray-600 hover:text-gray-300"
                            }`}
                          >
                            deactive
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="px-8 py-5 text-right">
                      {user.role !== 'admin' ? (
                        <button 
                          onClick={() => handleDelete(user._id, user.name)}
                          className="text-gray-600 hover:text-red-500 transition-all p-2.5 hover:bg-red-500/10 rounded-xl group/btn active:scale-90"
                        >
                          <Trash2 size={16} className="group-hover/btn:rotate-12 transition-transform" />
                        </button>
                      ) : (
                        <span className="text-[8px] font-mono text-gray-700 uppercase px-3 py-1 border border-gray-800 rounded-md bg-white/1">
                          Protected
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}