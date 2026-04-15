"use client";

import { useState, useMemo } from "react";
import API from "../services/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  assignedProjects?: any[];
}

export default function UserTable({ users, onRefresh }: { users: User[], onRefresh: () => void }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // 1. PIN ADMIN TO TOP + SORTING LOGIC
  const sortedUsers = useMemo(() => {
    return [...users]
      .sort((a, b) => {
        // Priority: admin (1), manager (2), user (3)
        const priority: Record<string, number> = { admin: 1, manager: 2, user: 3 };
        const aP = priority[a.role.toLowerCase()] || 4;
        const bP = priority[b.role.toLowerCase()] || 4;
        
        if (aP !== bP) return aP - bP;
        return a.name.localeCompare(b.name); // Alphabetical secondary sort
      })
      .filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) || 
        u.email.toLowerCase().includes(search.toLowerCase())
      );
  }, [users, search]);

  // 2. BACKEND STATUS UPDATE (PUT METHOD)
  const updateStatus = async (id: string, newStatus: "active" | "inactive") => {
    setLoadingId(id);
    try {
      // We use PUT and send the status in the body
      // Ensure your backend controller handles req.body.status
      await API.put(`/users/${id}`, { status: newStatus });
      onRefresh(); 
    } catch (err: any) {
      console.error("Backend Error:", err.response?.data || err.message);
      alert("Backend Failed to Update Status. Check console for error details.");
    } finally {
      setLoadingId(null);
    }
  };

  // 3. DELETE/WIPE LOGIC
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`PERMANENTLY WIPE OPERATIVE: ${name.toUpperCase()}?`)) return;
    try {
      await API.delete(`/users/${id}`);
      onRefresh();
    } catch (err) {
      alert("Delete Protocol Failed.");
    }
  };

  return (
    <div className="space-y-6">
      {/* SEARCH BAR */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-10 group-hover:opacity-25 transition duration-1000"></div>
        <input 
          placeholder="SEARCH_OPERATIVES..."
          className="relative w-full border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500 font-mono text-xs tracking-widest transition-all"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-gray-900/20 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            <tr>
              <th className="px-8 py-6">Operative_Identity</th>
              <th className="px-8 py-6">Access_Level</th>
              <th className="px-8 py-6">Status_Override</th>
              <th className="px-8 py-6 text-right">Commands</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedUsers.map((user) => (
              <tr 
                key={user._id} 
                className={`group transition-all hover:bg-white/2 ${
                  user.role === 'admin' ? 'bg-blue-500/3' : ''
                }`}
              >
                {/* IDENTITY */}
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center font-bold transition-all duration-500 ${
                      user.role === 'admin' 
                      ? 'border-blue-500/50 text-blue-400 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                      : 'border-white/10 text-gray-500'
                    }`}>
                      {user.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`font-black tracking-tight ${user.role === 'admin' ? 'text-white' : 'text-gray-300'}`}>
                          {user.name}
                        </p>
                        {user.role === 'admin' && (
                          <span className="text-[7px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-black uppercase">Root_System</span>
                        )}
                      </div>
                      <p className="text-[10px] font-mono text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>

                {/* ROLE */}
                <td className="px-8 py-6">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    user.role === 'admin' ? 'text-blue-500' : 'text-gray-500'
                  }`}>
                    {user.role}
                  </span>
                </td>

                {/* DUAL ACTION CONTROLS */}
                <td className="px-8 py-6">
                  {user.role === 'admin' ? (
                    <div className="flex items-center gap-2 text-blue-500/40">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Permanent_Auth</span>
                    </div>
                  ) : (
                    <div className="flex gap-1 bg-black/40 p-1.5 rounded-2xl border border-white/5 w-fit">
                      <button
                        onClick={() => updateStatus(user._id, "active")}
                        disabled={loadingId === user._id || user.status === "active"}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${
                          user.status === "active" 
                          ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                          : "text-gray-600 hover:text-emerald-400"
                        }`}
                      >
                        Activate
                      </button>
                      <button
                        onClick={() => updateStatus(user._id, "inactive")}
                        disabled={loadingId === user._id || user.status === "inactive"}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${
                          user.status === "inactive" 
                          ? "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]" 
                          : "text-gray-600 hover:text-red-400"
                        }`}
                      >
                        Deactivate
                      </button>
                    </div>
                  )}
                </td>

                {/* ACTIONS */}
                <td className="px-8 py-6 text-right">
                  {user.role !== 'admin' ? (
                    <button 
                      onClick={() => handleDelete(user._id, user.name)}
                      className="text-gray-600 hover:text-red-500 transition-all p-3 hover:bg-red-500/10 rounded-2xl group/btn"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover/btn:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  ) : (
                    <div className="text-[9px] font-mono text-gray-800 tracking-tighter uppercase border border-gray-800/50 px-3 py-1 rounded-lg italic">
                      Locked
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}