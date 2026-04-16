"use client";

import { useState, useEffect } from "react";
import {
  X,
  UserPlus,
  Trash2,
  Command,
  Shield,
  Activity,
  Save,
} from "lucide-react";
import API from "../services/api";

interface Member {
  member: string;
  role: string;
  module: string;
}

export default function ProjectModal({
  project,
  users,
  onClose,
  onRefresh,
}: any) {
  const [formData, setFormData] = useState({
    projectName: "",
    teamLead: "",
    status: "Active",
    team: [{ member: "", role: "Developer", module: "" }] as Member[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        projectName: project.projectName || "",
        teamLead: project.teamLead?._id || project.teamLead || "",
        status: project.status || "Active",
        team:
          project.team?.length > 0
            ? project.team.map((t: any) => ({
                member: t.member?._id || t.member || "",
                role: t.role || "Developer",
                module: t.module || "",
              }))
            : [{ member: "", role: "Developer", module: "" }],
      });
    } else {
      setFormData({
        projectName: "",
        teamLead: "",
        status: "Active",
        team: [{ member: "", role: "Developer", module: "" }],
      });
    }
  }, [project]);

  const addMember = () => {
    setFormData((prev) => ({
      ...prev,
      team: [...prev.team, { member: "", role: "Developer", module: "" }],
    }));
  };

  const removeMember = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      team: prev.team.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      projectName: formData.projectName,
      teamLead: formData.teamLead || undefined,
      status: formData.status,
      team: formData.team
        .filter((t) => t.member !== "")
        .map((t) => ({
          member: t.member,
          role: t.role,
          module: t.module || "General",
        })),
    };

    try {
      if (project?._id) {
        await API.put(`/projects/${project._id}`, payload);
      } else {
        await API.post("/projects", payload);
      }
      onRefresh();
      onClose();
    } catch (err: any) {
      alert(`System Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-[#0a0c10] border border-white/10 w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] relative flex flex-col max-h-[90vh]">
        {/* TOP ACCENT BAR */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600"></div>

        {/* HEADER */}
        <div className="px-8 py-8 md:px-12 flex justify-between items-center border-b border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
              <Command className="text-blue-500" size={20} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest text-white leading-none">
                {project ? "Update Project" : "New Project"}
              </h2>
              <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mt-1">
                Status: Ready for Transmission
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-white/5"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM BODY */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 custom-scrollbar"
        >
          {/* PRIMARY ATTRIBUTES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Activity size={12} className="text-blue-500" /> Identifier
              </label>
              <input
                required
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500 focus:bg-blue-500/5 text-sm font-bold text-white transition-all placeholder:text-gray-700"
                value={formData.projectName}
                onChange={(e) =>
                  setFormData({ ...formData, projectName: e.target.value })
                }
                placeholder="OPERATION_NAME"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Shield size={12} className="text-blue-500" /> Commander
              </label>
              <select
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none text-sm font-bold text-white cursor-pointer focus:border-blue-500 transition-all appearance-none"
                value={formData.teamLead}
                onChange={(e) =>
                  setFormData({ ...formData, teamLead: e.target.value })
                }
              >
                <option value="" className="bg-[#0a0c10]">
                  UNASSIGNED
                </option>
                {users.map((u: any) => (
                  <option key={u._id} value={u._id} className="bg-[#0a0c10]">
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Activity size={12} className="text-blue-500" /> Protocol
              </label>
              <select
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none text-sm font-bold text-white cursor-pointer focus:border-blue-500 transition-all appearance-none"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Active" className="bg-[#0a0c10]">
                  PLANNING
                </option>
                <option value="In Progress" className="bg-[#0a0c10]">
                  ACTIVE/RUNNING
                </option>
                <option value="Pending" className="bg-[#0a0c10]">
                  PENDING
                </option>
                <option value="Closed" className="bg-[#0a0c10]">
                  CANCELLED
                </option>
              </select>
            </div>
          </div>

          {/* ROSTER SECTION */}
          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <div>
                <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.3em]">
                  TEAM MEMBERS
                </h3>
                <p className="text-[9px] text-gray-600 uppercase font-mono mt-1">
                  Deploy units to the field
                </p>
              </div>
              <button
                type="button"
                onClick={addMember}
                className="flex items-center gap-2 text-[9px] font-black bg-blue-500/10 text-blue-400 px-5 py-2.5 rounded-xl hover:bg-blue-500 hover:text-white transition-all active:scale-95 border border-blue-500/20"
              >
                <UserPlus size={14} /> ADD MEMBER
              </button>
            </div>

            <div className="space-y-3 pr-2 overflow-visible">
              {formData.team.map((member, idx) => (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row gap-6 bg-white/[0.02] p-6 rounded-[2rem] border border-white/5 relative group hover:border-blue-500/30 transition-all animate-in slide-in-from-right-4 duration-300"
                >
                  <div className="flex-1 space-y-2">
                    <label className="text-[8px] text-gray-600 uppercase font-black tracking-widest ml-1">
                      Identity
                    </label>
                    <select
                      className="w-full bg-transparent text-sm font-bold text-white outline-none cursor-pointer border-b border-white/10 focus:border-blue-500 pb-2 transition-all"
                      value={member.member}
                      onChange={(e) => {
                        const newTeam = [...formData.team];
                        newTeam[idx].member = e.target.value;
                        setFormData({ ...formData, team: newTeam });
                      }}
                    >
                      <option value="" className="bg-[#0a0c10]">
                        Select Unit...
                      </option>
                      {users.map((u: any) => (
                        <option
                          key={u._id}
                          value={u._id}
                          className="bg-[#0a0c10]"
                        >
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-[1.5] space-y-2">
                    <label className="text-[8px] text-gray-600 uppercase font-black tracking-widest ml-1">
                      Functional_Module
                    </label>
                    <input
                      placeholder="Enter specific role or module..."
                      className="w-full bg-transparent text-sm text-blue-100 border-b border-white/10 focus:border-blue-500 outline-none pb-2 transition-all placeholder:text-gray-800"
                      value={member.module}
                      onChange={(e) => {
                        const newTeam = [...formData.team];
                        newTeam[idx].module = e.target.value;
                        setFormData({ ...formData, team: newTeam });
                      }}
                    />
                  </div>

                  <div className="flex items-end pb-1">
                    <button
                      type="button"
                      onClick={() => removeMember(idx)}
                      className="p-3 rounded-xl text-gray-700 hover:bg-red-500/10 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* SUBMISSION FOOTER */}
        <div className="px-8 py-8 md:px-12 border-t border-white/5 bg-white/1">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-5 rounded-3xl font-black uppercase text-[10px] tracking-[0.4em] transition-all text-white flex items-center justify-center gap-3
              ${isSubmitting ? "bg-gray-800 animate-pulse cursor-wait" : "bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-900/20 active:scale-[0.98]"}
            `}
          >
            {isSubmitting ? (
              "SYNCHRONIZING..."
            ) : (
              <>
                <Save size={16} />
                {project ? "Update Changes" : "Start Project"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
