"use client";

import { useState, useEffect } from "react";
import { X, Command, Shield, Activity, Save, UserPlus, Trash2, Briefcase } from "lucide-react";
import API from "../services/api";

export default function ProjectModal({ project, users, onClose, onRefresh }: any) {
  const [formData, setFormData] = useState({
    projectName: "",
    teamLead: "",
    status: "Active",
    team: [{ member: "", role: "Developer", module: "" }],
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const roleOptions = ['Frontend Developer', 'Backend Developer', 'Developer', 'Designer', 'Intern', 'QA Tester', 'Dev'];

  // Load project data if editing
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
    if (isSubmitting) return;

    // --- SAFETY CHECK: Prevents the BSON/ObjectId Error ---
    if (!formData.projectName.trim()) return alert("PROJECT NAME REQUIRED");
    if (!formData.teamLead) return alert("TEAM LEAD  REQUIRED");

    setIsSubmitting(true);

    try {
      // Filter out empty team rows before sending to server
      const cleanedTeam = formData.team.filter(m => m.member !== "");
      const payload = { ...formData, team: cleanedTeam };

      if (project?._id) {
        await API.put(`/projects/${project._id}`, payload);
      } else {
        await API.post("/projects", payload);
      }

      await onRefresh();
      onClose();
    } catch (err: any) {
      console.error("Transmission Error:", err);
      alert(err.response?.data?.message || "SYSTEM_ERROR: Sync Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!project?._id) return;
    setIsDeleting(true);
    try {
      await API.delete(`/projects/${project._id}`);
      await onRefresh();
      onClose();
    } catch (err: any) {
      alert("TERMINATION_FAILED: System could not purge record.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-100 flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="bg-[#050505] border border-white/10 w-full max-w-5xl rounded-[3rem] shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* TOP ACCENT LINE */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-blue-500 shadow-[0_0_15px_#3b82f6]"></div>

        {/* HEADER */}
        <div className="px-10 py-8 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center">
              <Command className="text-blue-500" size={20} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
              {project ? "Edit Project" : "New Project"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {project && (
              <div className="flex gap-2">
                {confirmDelete ? (
                  <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white text-[10px] font-bold rounded-xl uppercase tracking-widest">
                    {isDeleting ? "Purging..." : "Confirm Delete"}
                  </button>
                ) : (
                  <button onClick={() => setConfirmDelete(true)} className="p-3 text-gray-500 hover:text-red-500 transition-colors">
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            )}
            <button onClick={onClose} className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* SCROLLABLE FORM BODY */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
          
          {/* SECTION 1: MAIN DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* PROJECT NAME */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex justify-between">
                Project Title {!formData.projectName}
              </label>
              <input
                className="w-full bg-[#0d0d0d] border border-white/10 p-4 rounded-2xl text-white font-bold focus:border-blue-500 transition-all outline-none"
                value={formData.projectName}
                onChange={e => setFormData({...formData, projectName: e.target.value})}
                placeholder="Name your project..."
              />
            </div>

            {/* TEAM LEAD */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Shield size={12}/> Project Lead
              </label>
              <select
                className="w-full bg-[#0d0d0d] border border-white/10 p-4 rounded-2xl text-white font-bold outline-none appearance-none cursor-pointer"
                value={formData.teamLead}
                onChange={e => setFormData({...formData, teamLead: e.target.value})}
              >
                <option value="">Select Lead...</option>
                {users.map((u: any) => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
            </div>

            {/* STATUS */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Activity size={12}/> Progress Status
              </label>
              <select
                className="w-full bg-[#0d0d0d] border border-white/10 p-4 rounded-2xl text-white font-bold outline-none appearance-none cursor-pointer"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="Active">PLANNING</option>
                <option value="In Progress">IN PROGRESS</option>
                <option value="Pending">COMPLETED</option>
                <option value="Closed">CANCELLED</option>
              </select>
            </div>
          </div>

          {/* SECTION 2: TEAM ROSTER */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.3em]">project team</h3>
              <button
                type="button"
                onClick={() => setFormData({...formData, team: [...formData.team, { member: "", role: "Developer", module: "" }]})}
                className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[10px] font-bold text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
              >
                + ADD MEMBER
              </button>
            </div>

            <div className="space-y-4">
              {formData.team.map((m, idx) => (
                <div key={idx} className="flex flex-wrap md:flex-nowrap gap-4 bg-white/2 border border-white/5 p-6 rounded-3xl hover:border-white/10 transition-all">
                  
                  {/* MEMBER SELECT */}
                  <div className="flex-1 min-w-50 space-y-2">
                    <p className="text-[8px] font-mono text-gray-600 uppercase">Name</p>
                    <select 
                      className="w-full bg-transparent border-b border-white/10 p-2 text-white outline-none focus:border-blue-500 transition-all"
                      value={m.member}
                      onChange={e => {
                        const newTeam = [...formData.team];
                        newTeam[idx].member = e.target.value;
                        setFormData({...formData, team: newTeam});
                      }}
                    >
                      <option value="" className="bg-black">Choose Member...</option>
                      {users.map((u: any) => <option key={u._id} value={u._id} className="bg-black">{u.name}</option>)}
                    </select>
                  </div>

                  {/* ROLE SELECT */}
                  <div className="w-full md:w-48 space-y-2">
                    <p className="text-[8px] font-mono text-gray-600 uppercase flex items-center gap-2"><Briefcase size={8} /> Role</p>
                    <select 
                      className="w-full bg-transparent border-b border-white/10 p-2 text-white outline-none focus:border-blue-500 transition-all"
                      value={m.role}
                      onChange={e => {
                        const newTeam = [...formData.team];
                        newTeam[idx].role = e.target.value;
                        setFormData({...formData, team: newTeam});
                      }}
                    >
                      {roleOptions.map(role => <option key={role} value={role} className="bg-black">{role}</option>)}
                    </select>
                  </div>

                  {/* MODULE INPUT */}
                  <div className="flex-1 min-w-50 space-y-2">
                    <p className="text-[8px] font-mono text-gray-600 uppercase">Module</p>
                    <input 
                      className="w-full bg-transparent border-b border-white/10 p-2 text-blue-400 outline-none placeholder:text-gray-800 focus:border-blue-500 transition-all"
                      placeholder="Specify Assignment..."
                      value={m.module}
                      onChange={e => {
                        const newTeam = [...formData.team];
                        newTeam[idx].module = e.target.value;
                        setFormData({...formData, team: newTeam});
                      }}
                    />
                  </div>

                  {/* REMOVE BUTTON */}
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, team: formData.team.filter((_, i) => i !== idx)})}
                    className="p-2 text-gray-600 hover:text-red-500 transition-all self-end"
                  >
                    <Trash2 size={16}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* FOOTER ACTION */}
        <div className="p-8 border-t border-white/5">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3
              ${isSubmitting ? "bg-gray-800 text-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"}
            `}
          >
            {isSubmitting ? "Processing..." : <><Save size={18}/> {project ? "Save Changes" : "Create New Project"}</>}
          </button>
        </div>
      </div>
    </div>
  );
}