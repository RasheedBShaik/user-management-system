"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../services/api";
import { Plus, Users, LayoutGrid, Building2, RefreshCw } from "lucide-react"; // Modern Icons

// --- TYPES ---
interface User { _id: string; name: string; email: string; role: string; status: "active" | "inactive"; }
interface Project { _id: string; projectName: string; teamLead?: any; team?: any[]; status: string; }
interface Customer { _id?: string; id: string; name: string; company: string; email: string; status: string; }

// --- COMPONENTS ---
import UserTable from "@/components/UserTable";
import ProjectGrid from "@/components/ProjectGrid";
import ProjectModal from "@/components/ProjectModel";
import StatGrid from "@/components/StatGrid";
import Header from "@/components/Header";
import CustomerList from "@/components/CustomerList";

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"users" | "projects" | "customers">("users");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user || user.role !== "admin") {
      router.push("/login");
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const results = await Promise.allSettled([
        API.get("/users"),
        API.get("/projects"),
        API.get("/customers"),
      ]);

      if (results[0].status === "fulfilled") setUsers(results[0].value.data || []);
      if (results[1].status === "fulfilled") setProjects(results[1].value.data || []);
      if (results[2].status === "fulfilled") {
        const rawCustomers = results[2].value.data || [];
        setCustomers(rawCustomers.map((c: any) => ({
          ...c,
          id: c._id || c.id || String(Math.random()),
        })));
      }
    } catch (err) {
      console.error("Global Sync Error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
        <div className="relative flex items-center justify-center">
          <div className="w-20 h-20 border-t-2 border-l-2 border-blue-500 rounded-full animate-spin"></div>
          <div className="absolute w-12 h-12 border-b-2 border-r-2 border-purple-500 rounded-full animate-spin-slow"></div>
        </div>
        <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.5em] text-gray-500">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 pb-20">
      {/* Subtle Background Glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 pt-8 relative z-10">
        <Header onSignOut={() => { localStorage.clear(); router.push("/login"); }} />

        <div className="mt-12">
           <StatGrid users={users} projects={projects} customers={customers} />
        </div>

        {/* --- NAVIGATION & ACTIONS --- */}
        <div className="mt-16 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex bg-gray-900/40 backdrop-blur-md p-1 rounded-2xl border border-white/5 shadow-inner">
            <TabButton 
                active={activeTab === "users"} 
                onClick={() => setActiveTab("users")} 
                icon={<Users size={14}/>} 
                label="Users" 
            />
            <TabButton 
                active={activeTab === "projects"} 
                onClick={() => setActiveTab("projects")} 
                icon={<LayoutGrid size={14}/>} 
                label="Projects" 
            />
            <TabButton 
                active={activeTab === "customers"} 
                onClick={() => setActiveTab("customers")} 
                icon={<Building2 size={14}/>} 
                label="Customers" 
            />
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchData}
              className={`p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all ${refreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw size={18} className="text-gray-400" />
            </button>

            {activeTab === "projects" && (
              <button 
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95"
              >
                <Plus size={16} /> New Project
              </button>
            )}
          </div>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="min-h-[400px] animate-in fade-in slide-in-from-bottom-4 duration-700">
            {activeTab === "users" && (
                <div className="bg-gray-900/20 border border-white/5 rounded-3xl backdrop-blur-sm overflow-hidden">
                    <UserTable users={users} onRefresh={fetchData} />
                </div>
            )}

            {activeTab === "projects" && (
                <ProjectGrid
                    projects={projects}
                    onSelect={(p: Project) => setSelectedProject(p)}
                    onCreate={() => setIsCreating(true)}
                />
            )}

            {activeTab === "customers" && (
                <div className="bg-gray-900/20 border border-white/5 rounded-3xl backdrop-blur-sm overflow-hidden">
                    <CustomerList customers={customers} onRefresh={fetchData} />
                </div>
            )}
        </main>

        <footer className="mt-32 pb-10 flex flex-col items-center justify-center gap-4 opacity-30">
          <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-gray-500 to-transparent" />
          <p className="text-[9px] font-black uppercase tracking-[0.8em]">
            Secured Admin Ecosystem
          </p>
        </footer>
      </div>

      {/* MODALS */}
      {(selectedProject || isCreating) && (
        <ProjectModal
          project={isCreating ? null : selectedProject}
          users={users}
          onClose={() => {
            setSelectedProject(null);
            setIsCreating(false);
          }}
          onRefresh={fetchData}
        />
      )}
    </div>
  );
}

// --- HELPER SUB-COMPONENT FOR TABS ---
function TabButton({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
        active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
          : "text-gray-500 hover:text-white hover:bg-white/5"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}