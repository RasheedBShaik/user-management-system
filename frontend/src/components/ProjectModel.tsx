"use client";

import { useState, useEffect } from "react";
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

  // Sync state with incoming project data
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
      // Reset for creation mode
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

    // CLEAN THE DATA: Ensure we don't send empty strings for ObjectIDs
    const payload = {
      projectName: formData.projectName,
      teamLead: formData.teamLead || undefined,
      status: formData.status,
      team: formData.team
        .filter((t) => t.member !== "") // Only send rows with a member selected
        .map((t) => ({
          member: t.member,
          role: t.role,
          module: t.module || "General",
        })),
    };

    try {
      if (project?._id) {
        // UPDATE EXISTING
        await API.put(`/projects/${project._id}`, payload);
        console.log("🚀 Project Updated Successfully");
      } else {
        // CREATE NEW
        await API.post("/projects", payload);
        console.log("🚀 Project Created Successfully");
      }

      onRefresh();
      onClose();
    } catch (err: any) {
      console.error("❌ TRANSMISSION FAILED");
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Unknown Connection Error";
      alert(`System Error: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-100 flex items-center justify-center p-4">
      <div className="bg-[#080a0f] border border-white/10 w-full max-w-4xl rounded-[2.5rem] p-6 md:p-10 overflow-y-auto max-h-[90vh] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-600 via-cyan-400 to-blue-600"></div>

        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase text-white">
              {project ? "Sync Existing Core" : "Deploy New Project"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors font-black text-[10px] px-4 py-2 border border-white/5 rounded-xl hover:bg-white/5"
          >
            CLOSE ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Main Attributes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">
                Project Identifier
              </label>
              <input
                required
                className="w-full bg-white/3 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500 text-white font-bold transition-all focus:bg-white/5"
                value={formData.projectName}
                onChange={(e) =>
                  setFormData({ ...formData, projectName: e.target.value })
                }
                placeholder="Enter project name..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">
                Unit Commander
              </label>
              <select
                className="w-full bg-[#11141b] border border-white/10 p-4 rounded-2xl outline-none text-white font-bold appearance-none cursor-pointer focus:border-blue-500"
                value={formData.teamLead}
                onChange={(e) =>
                  setFormData({ ...formData, teamLead: e.target.value })
                }
              >
                <option value="">-- UNASSIGNED --</option>
                {users.map((u: any) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">
                Operation Status
              </label>
              <select
                className="w-full bg-[#11141b] border border-white/10 p-4 rounded-2xl outline-none text-white font-bold appearance-none cursor-pointer focus:border-blue-500"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Active">🟢 ACTIVE</option>
                <option value="In Progress">🔵 IN PROGRESS</option>
                <option value="Pending">🟡 PENDING</option>
                <option value="Closed">🔴 CANCELLED</option>
              </select>
            </div>
          </div>

          {/* Team Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                Operative Roster
              </h3>
              <button
                type="button"
                onClick={addMember}
                className="text-[9px] font-black bg-blue-500/10 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition-all"
              >
                ADD MEMBER
              </button>
            </div>

            <div className="space-y-4 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
              {formData.team.map((member, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white/2 p-5 rounded-3xl border border-white/5 relative group hover:border-blue-500/30 transition-all"
                >
                  <div className="md:col-span-5 space-y-1">
                    <label className="text-[8px] text-gray-600 uppercase font-black ml-1">
                      Identity
                    </label>
                    <select
                      className="w-full bg-transparent text-sm font-bold text-white outline-none cursor-pointer"
                      value={member.member}
                      onChange={(e) => {
                        const newTeam = [...formData.team];
                        newTeam[idx].member = e.target.value;
                        setFormData({ ...formData, team: newTeam });
                      }}
                    >
                      <option value="" className="bg-[#0c0e12]">
                        Assign team member...
                      </option>
                      {users.map((u: any) => (
                        <option
                          key={u._id}
                          value={u._id}
                          className="bg-[#0c0e12]"
                        >
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-6 space-y-1">
                    <label className="text-[8px] text-gray-600 uppercase font-black ml-1">
                      Functional Module
                    </label>
                    <input
                      placeholder="e.g. Neural Link Interface"
                      className="w-full bg-transparent text-sm text-blue-100 border-b border-white/5 focus:border-blue-500 outline-none pb-1 transition-all"
                      value={member.module}
                      onChange={(e) => {
                        const newTeam = [...formData.team];
                        newTeam[idx].module = e.target.value;
                        setFormData({ ...formData, team: newTeam });
                      }}
                    />
                  </div>
                  <div className="md:col-span-1 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => removeMember(idx)}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-red-500/10 hover:text-red-500 transition-all"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submission */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-6 rounded-2xl font-black uppercase text-[11px] tracking-[0.5em] transition-all text-white shadow-xl shadow-blue-500/20
              ${isSubmitting ? "bg-gray-700 animate-pulse cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 hover:-translate-y-1"}
            `}
          >
            {isSubmitting ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
}
