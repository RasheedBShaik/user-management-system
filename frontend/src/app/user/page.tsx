"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../services/api";
import { 
  User, Lock, Mail, Shield, LogOut, Home as HomeIcon, 
  Calendar, CheckCircle, Loader2, Briefcase, Clock, 
  Layers, ChevronRight, AlertCircle, Award, X, Edit3, Save
} from "lucide-react";

export default function UserPage() {
  const router = useRouter();

  // State
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Modal State
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    loadData();
  }, [router]);

  // AUTO-REFRESH CORE LOGIC
  const loadData = async () => {
    try {
      setLoading(true);
      const [userRes, projectsRes] = await Promise.all([
        API.get("/users/me"),
        API.get("/projects")
      ]);

      const currentUser = userRes.data;
      setUser(currentUser);
      setName(currentUser.name);

      const userId = currentUser._id;
      const filtered = projectsRes.data.filter((proj: any) => {
        const isLead = (proj.teamLead?._id || proj.teamLead) === userId;
        const isMember = proj.team?.some((t: any) => (t.member?._id || t.member) === userId);
        return isLead || isMember;
      });
      setProjects(filtered);

      // If a modal is open, update the selectedProject state with new data
      if (isModalOpen && selectedProject) {
        const updatedSelected = filtered.find((p: any) => p._id === selectedProject._id);
        if (updatedSelected) setSelectedProject(updatedSelected);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = (proj: any) => {
    setSelectedProject(proj);
    setIsModalOpen(true);
  };

  const updateProfile = async () => {
    if (!name.trim()) return;
    try {
      setUpdating(true);
      const res = await API.put(`/users/${user._id}`, { name });
      setUser(res.data);
      showToast("success", "Profile updated successfully!");
    } catch (err: any) {
      showToast("error", err.response?.data?.msg || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const showToast = (type: string, text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 4000);
  };

  if (loading && !user) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] gap-4">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      <p className="text-gray-500 animate-pulse font-medium">Synchronizing...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30 pb-20">
      <div className="fixed top-0 left-0 w-full h-64 bg-linear-to-b from-blue-600/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">
        
        {/* TOP NAV BAR */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">User Dashboard</h1>
              <p className="text-gray-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                Logged in as <span className="text-gray-200 font-semibold">{user?.name}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/")} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 flex items-center gap-2 text-sm font-medium cursor-pointer">
              <HomeIcon className="w-4 h-4" /> Home
            </button>
            <button 
              onClick={() => { localStorage.clear(); router.push("/login"); }}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all text-sm font-medium flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </header>

        {/* QUICK STATS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard title="Active Projects" value={projects.length} icon={<Layers className="text-blue-400" />} color="blue" />
          <StatCard title="Role Status" value={user?.role} icon={<Shield className="text-emerald-400" />} color="emerald" />
          <StatCard title="Total Modules" value={projects.reduce((acc, p) => acc + (p.team?.length || 0), 0)} icon={<Award className="text-purple-400" />} color="purple" />
          <StatCard title="Member Since" value={user ? new Date(user.createdAt).getFullYear() : "----"} icon={<Calendar className="text-orange-400" />} color="orange" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <aside className="lg:col-span-4 space-y-6">
            <nav className="bg-white/3 border border-white/5 rounded-3xl p-3 backdrop-blur-md">
              <TabBtn active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<User size={18} />} label="Profile Overview" />
              <TabBtn active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} icon={<Briefcase size={18} />} label="My Assignments" />
              <TabBtn active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={<Lock size={18} />} label="Account Security" />
            </nav>

            <div className="bg-linear-to-br from-blue-600/20 to-purple-600/20 border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Verified Profile</p>
                <h3 className="text-2xl font-bold mb-1">{user?.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{user?.email}</p>
                <div className="inline-block px-3 py-1 bg-white/10 rounded-lg text-xs font-mono">ID: {user?._id.slice(-6)}</div>
              </div>
              <Shield className="absolute -bottom-4 -right-4 w-32 h-32 text-white/3 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            </div>
          </aside>

          <main className="lg:col-span-8">
            {activeTab === 'overview' && (
              <section className="bg-white/3 border border-white/5 rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">General Information</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Display Name</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all hover:bg-white/[0.07]"
                        value={name} onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Email (Primary)</label>
                      <input className="w-full bg-white/2 border border-white/5 p-4 rounded-2xl text-gray-500 cursor-not-allowed" value={user?.email} disabled />
                    </div>
                  </div>
                  <button 
                    onClick={updateProfile} disabled={updating}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
                  >
                    {updating ? <Loader2 className="animate-spin w-5 h-5" /> : <CheckCircle size={20} />}
                    Save Profile Changes
                  </button>
                </div>
              </section>
            )}

            {activeTab === 'projects' && (
              <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {projects.length > 0 ? (
                  projects.map((proj) => (
                    <ProjectCard 
                      key={proj._id} 
                      proj={proj} 
                      userId={user?._id} 
                      onOpenDetails={handleOpenDetails}
                    />
                  ))
                ) : (
                  <div className="bg-white/3 border border-white/5 rounded-3xl p-12 text-center">
                    <Briefcase className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-400">No active assignments</h3>
                    <p className="text-gray-600">When you are added to a team, projects will appear here.</p>
                  </div>
                )}
              </section>
            )}

            {activeTab === 'security' && (
              <section className="bg-white/3 border border-white/5 rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-yellow-500"><Lock size={20} /> Security Settings</h2>
                <div className="max-w-md space-y-4">
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-start gap-3 mb-6">
                    <AlertCircle className="text-yellow-500 shrink-0" size={18} />
                    <p className="text-xs text-yellow-200/70">Changing your password will require you to log back in on all other devices.</p>
                  </div>
                  <input type="password" placeholder="Current Password" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all" />
                  <input type="password" placeholder="New Secure Password" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all" />
                  <button className="bg-white text-black font-bold py-4 px-8 rounded-2xl hover:bg-gray-200 transition-all active:scale-95 cursor-pointer">Update Security</button>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>

      {/* PROJECT DETAILS MODAL */}
      <ProjectDetailsModal 
        proj={selectedProject} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        currentUserId={user?._id}
        onRefresh={loadData}
        showToast={showToast}
      />

      {/* TOAST NOTIFICATION */}
      {msg.text && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in zoom-in slide-in-from-bottom-10 border z-110 ${
          msg.type === "success" ? "bg-emerald-600 border-emerald-400 text-white" : "bg-red-600 border-red-400 text-white"
        }`}>
          {msg.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-bold">{msg.text}</span>
        </div>
      )}
    </div>
  );
}

// MODAL COMPONENT (WITH AUTO-REFRESH LOGIC)
function ProjectDetailsModal({ proj, isOpen, onClose, currentUserId, onRefresh, showToast }: any) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newModule, setNewModule] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !proj) return null;

  const isLeadOfProject = (proj.teamLead?._id || proj.teamLead) === currentUserId;

  const handleUpdateModule = async (memberId: string) => {
    if (!newModule.trim()) return;
    try {
      setIsSaving(true);
      
      // 1. Sanitize Data: Ensure we only send ID strings to the backend
      const sanitizedTeam = proj.team.map((t: any) => {
        const id = t.member?._id || t.member;
        return {
          member: id,
          module: id === memberId ? newModule : t.module,
          role: t.role || "Member"
        };
      });

      const updatePayload = {
        projectName: proj.projectName,
        team: sanitizedTeam,
        teamLead: proj.teamLead?._id || proj.teamLead
      };

      // 2. Perform API Update
      await API.put(`/projects/${proj._id}`, updatePayload);
      
      // 3. UI Auto-Reset
      showToast("success", "Module updated successfully!");
      setEditingId(null);
      setNewModule("");
      
      // 4. TRIGGER AUTO-REFRESH
      await onRefresh(); 
      
    } catch (err: any) {
      console.error("Critical Update Error:", err);
      showToast("error", err.response?.data?.error || "Server Error: Check Console");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative bg-[#111] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="sticky top-0 bg-[#111]/90 backdrop-blur-md p-6 border-b border-white/5 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">{proj.projectName}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-gray-500 text-xs flex items-center gap-1">
                <Clock size={12} /> {new Date(proj.createdAt).toLocaleDateString()}
              </span>
              <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/20 uppercase">
                {proj.status}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="bg-blue-600/5 p-6 rounded-2xl border border-blue-500/10">
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Shield size={12} /> Project Authority
            </p>
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/20">
                 <User className="text-blue-500" size={20} />
               </div>
               <div>
                 <p className="font-bold text-lg">{proj.teamLead?.name || "Unassigned"}</p>
                 <p className="text-sm text-gray-500">{proj.teamLead?.email || "No email available"}</p>
               </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4 ml-1">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Team Composition</h3>
              {isLeadOfProject && (
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/10 uppercase">
                  Lead Access Granted
                </span>
              )}
            </div>
            
            <div className="space-y-3">
              {proj.team && proj.team.length > 0 ? proj.team.map((member: any, idx: number) => {
                const mId = member.member?._id || member.member;
                const isEditing = editingId === mId;

                return (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white/2 border border-white/5 rounded-2xl group/member hover:bg-white/4 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold border border-white/5">
                        {member.member?.name?.charAt(0) || "?" }
                      </div>
                      <div>
                        <p className="font-bold text-gray-200">{member.member?.name || "System User"}</p>
                        {isLeadOfProject ? (
                           <p className="text-xs text-blue-400 font-medium flex items-center gap-1">
                             <Mail size={12} /> {member.member?.email}
                           </p>
                        ) : (
                          <p className="text-xs text-gray-600 italic">Member</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right flex flex-col items-end gap-2">
                      {isEditing ? (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                          <input 
                            autoFocus
                            className="bg-white/10 border border-blue-500/50 rounded-lg px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500 text-white"
                            value={newModule}
                            onChange={(e) => setNewModule(e.target.value)}
                            placeholder="New module name..."
                          />
                          <button 
                            disabled={isSaving}
                            onClick={() => handleUpdateModule(mId)}
                            className="p-1.5 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50"
                          >
                            {isSaving ? <Loader2 size={14} className="animate-spin text-white" /> : <Save size={14} className="text-white" />}
                          </button>
                          <button 
                            onClick={() => { setEditingId(null); setNewModule(""); }}
                            className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20"
                          >
                            <X size={14} className="text-white" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="bg-purple-500/5 border border-purple-500/10 px-3 py-1 rounded-lg">
                            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">Module</p>
                            <p className="text-xs font-bold text-purple-400">{member.module}</p>
                          </div>
                          {isLeadOfProject && (
                            <button 
                              className="text-[10px] flex items-center gap-1 text-gray-400 hover:text-white transition-colors cursor-pointer group-hover/member:text-blue-400"
                              onClick={() => {
                                setEditingId(mId);
                                setNewModule(member.module);
                              }}
                            >
                              <Edit3 size={10} /> Edit Module
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              }) : (
                <p className="text-gray-600 text-sm italic">No additional team members assigned.</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/5 bg-white/1 flex justify-center items-center gap-2">
            <Lock size={12} className="text-gray-700" />
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
              {isLeadOfProject ? "Authenticated Management View" : "Restricted Member View"}
            </p>
        </div>
      </div>
    </div>
  );
}

// HELPER COMPONENTS
function StatCard({ title, value, icon, color }: any) {
  const colorMap: any = {
    blue: "from-blue-500/20",
    emerald: "from-emerald-500/20",
    purple: "from-purple-500/20",
    orange: "from-orange-500/20"
  };
  return (
    <div className={`bg-white/3 border border-white/5 p-6 rounded-3xl bg-linear-to-br ${colorMap[color]} to-transparent shadow-xl`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-white/5 rounded-xl">{icon}</div>
      </div>
      <p className="text-3xl font-bold mb-1">{value || 0}</p>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</p>
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-medium mb-1 cursor-pointer ${
      active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
    }`}>
      {icon} {label}
    </button>
  );
}

function ProjectCard({ proj, userId, onOpenDetails }: any) {
  const isLead = (proj.teamLead?._id || proj.teamLead) === userId;
  const memberInfo = proj.team?.find((t: any) => (t.member?._id || t.member) === userId);

  return (
    <div className="group bg-white/3 hover:bg-white/5 border border-white/5 hover:border-blue-500/30 p-8 rounded-3xl transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h4 className="text-2xl font-bold group-hover:text-blue-400 transition-colors mb-2">{proj.projectName}</h4>
          <div className="flex flex-wrap gap-2">
            <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
              proj.status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
              proj.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-gray-500/10 text-gray-400'
            }`}>
              {proj.status}
            </span>
            {isLead && <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 flex items-center gap-1"><Shield size={10} /> Team Lead</span>}
          </div>
        </div>
        <div className="bg-white/5 px-6 py-3 rounded-2xl text-right border border-white/5 min-w-35">
          <p className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">Your Module</p>
          <p className="text-lg font-bold text-blue-100">{memberInfo?.module || "General"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-white/5">
        <IconStat icon={<Clock size={16} />} label="Assigned Role" value={isLead ? "Management" : (memberInfo?.role || "Developer")} />
        <IconStat icon={<Layers size={16} />} label="Team Size" value={`${proj.team?.length || 0} Collaborators`} />
        <div className="flex justify-end items-center">
          <button 
            onClick={() => onOpenDetails(proj)}
            className="flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer group/btn"
          >
            Manage Project <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

function IconStat({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-gray-600">{icon}</div>
      <div>
        <p className="text-[10px] uppercase font-bold text-gray-600 tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-gray-300">{value}</p>
      </div>
    </div>
  );
}