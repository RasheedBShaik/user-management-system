"use client";

import { useState, useEffect } from "react";
import { X, Command, Shield, Activity, Save, UserPlus, Trash2 } from "lucide-react";
import API from "../services/api";

export default function ProjectModal({ project, users, onClose, onRefresh }: any) {
  const [formData, setFormData] = useState({
    projectName: "",
    teamLead: "",
    status: "Active",
    team: [{ member: "", role: "Developer", module: "" }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        projectName: project.projectName || "",
        teamLead: project.teamLead?._id || project.teamLead || "",
        status: project.status || "Active",
        team: project.team?.length > 0 ? project.team.map((t: any) => ({
          member: t.member?._id || t.member || "",
          role: t.role || "Developer",
          module: t.module || ""
        })) : [{ member: "", role: "Developer", module: "" }]
      });
    }
  }, [project]);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double-clicks
    if (isSubmitting) return; 
    setIsSubmitting(true);

    try {
      // CLEANUP: Only send team members that actually have a user selected
      // This prevents the backend from receiving empty strings and crashing
      const cleanedTeam = formData.team.filter(m => m.member !== "");
      
      const payload = {
        ...formData,
        team: cleanedTeam
      };

      if (project?._id) {
        await API.put(`/projects/${project._id}`, payload);
      } else {
        await API.post("/projects", payload);
      }

      await onRefresh();
      onClose();
    } catch (err: any) {
      console.error("Transmission Error:", err);
      alert(err.response?.data?.message || "CRITICAL_SYSTEM_ERROR: Data Sync Failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-100 flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="bg-[#050505] border border-white/10 w-full max-w-5xl rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,1)] relative flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* INTERFACE GLOW */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-linear-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_20px_#3b82f6]"></div>

        {/* HEADER */}
        <div className="px-10 py-10 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl border border-blue-500/30 flex items-center justify-center shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]">
              <Command className="text-blue-500" size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
                {project ? "Edit Operation" : "New Operation"}
              </h2>
              <p className="text-[10px] font-mono text-gray-500 mt-2 tracking-[0.3em]">SECURE_DATA_TRANSMISSION_PROTOCOL_ACTIVE</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 text-gray-500 hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-16">
          
          {/* PRIMARY DATA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-mono text-gray-500 tracking-[0.4em] uppercase">Project Name</label>
              <input
                className="w-full bg-white/3 border border-white/10 p-5 rounded-2xl text-white font-bold focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-800"
                value={formData.projectName}
                onChange={e => setFormData({...formData, projectName: e.target.value})}
                placeholder="OP_NAME_..."
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-mono text-gray-500 tracking-[0.4em] uppercase flex items-center gap-2"><Shield size={12}/> Lead</label>
              <select
                className="w-full bg-white/3 border border-white/10 p-5 rounded-2xl text-white font-bold outline-none cursor-pointer appearance-none"
                value={formData.teamLead}
                onChange={e => setFormData({...formData, teamLead: e.target.value})}
              >
                <option value="" className="bg-black">SELECT</option>
                {users.map((u: any) => <option key={u._id} value={u._id} className="bg-black">{u.name}</option>)}
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-mono text-gray-500 tracking-[0.4em] uppercase flex items-center gap-2"><Activity size={12}/> Status </label>
              <select
                className="w-full bg-white/3 border border-white/10 p-5 rounded-2xl text-white font-bold outline-none cursor-pointer appearance-none"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="Active" className="bg-black">PLANNING</option>
                <option value="In Progress" className="bg-black">ACTIVE/RUNNING</option>
                <option value="Pending" className="bg-black">COMPLETED</option>
                <option value="Closed" className="bg-black">CANCELLED</option>
              </select>
            </div>
          </div>

          {/* ROSTER SECTION */}
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <h3 className="text-sm font-black text-blue-500 tracking-[0.4em] uppercase">Team Members</h3>
              <button
                type="button"
                onClick={() => setFormData({...formData, team: [...formData.team, { member: "", role: "Developer", module: "" }]})}
                className="flex items-center gap-3 px-6 py-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[10px] font-black text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
              >
                <UserPlus size={14}/> ADD
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {formData.team.map((m, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-6 bg-white/1 border border-white/5 p-8 rounded-4xl hover:border-white/10 transition-all group">
                   <div className="flex-1 space-y-3">
                      <p className="text-[8px] font-mono text-gray-700 uppercase tracking-widest">Identity</p>
                      <select 
                        className="w-full bg-transparent border-b border-white/10 p-2 text-white outline-none"
                        value={m.member}
                        onChange={e => {
                          const newTeam = [...formData.team];
                          newTeam[idx].member = e.target.value;
                          setFormData({...formData, team: newTeam});
                        }}
                      >
                        <option value="" className="bg-black">SELECT</option>
                        {users.map((u: any) => <option key={u._id} value={u._id} className="bg-black">{u.name}</option>)}
                      </select>
                   </div>
                   <div className="flex-2 space-y-3">
                      <p className="text-[8px] font-mono text-gray-700 uppercase tracking-widest">Module Assignment</p>
                      <input 
                        className="w-full bg-transparent border-b border-white/10 p-2 text-blue-400 outline-none placeholder:text-gray-900"
                        placeholder="ENTER_FUNCTION..."
                        value={m.module}
                        onChange={e => {
                          const newTeam = [...formData.team];
                          newTeam[idx].module = e.target.value;
                          setFormData({...formData, team: newTeam});
                        }}
                      />
                   </div>
                   <button 
                    type="button"
                    onClick={() => setFormData({...formData, team: formData.team.filter((_, i) => i !== idx)})}
                    className="p-4 text-gray-700 hover:text-red-500 transition-colors self-end"
                   >
                    <Trash2 size={18}/>
                   </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* SUBMISSION FOOTER */}
        <div className="p-10 border-t border-white/5 bg-white/1">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-6 rounded-4xl text-[12px] font-black uppercase tracking-[0.5em] transition-all shadow-[0_0_40px_rgba(0,0,0,0.5)] flex items-center justify-center gap-4
              ${isSubmitting ? "bg-gray-900 text-gray-700 animate-pulse" : "bg-blue-600 hover:bg-blue-500 text-white active:scale-95 shadow-blue-500/20"}
            `}
          >
            {isSubmitting ? "TRANSMITTING..." : (
              <><Save size={18}/> {project ? "UPDATE DATA" : "INITIATE_OPERATION"}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}