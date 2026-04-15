"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../services/api";

// --- TYPES & INTERFACES ---
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

// Fixed: Project name field must match the Backend Schema (projectName)
interface Project {
  _id: string;
  projectName: string; 
  teamLead?: any;
  team?: any[];
  status: string;
}

interface Customer {
  _id?: string;
  id: string; 
  name: string;
  company: string;
  email: string;
  status: string;
}

// --- SUB-COMPONENTS ---
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
    setLoading(true);
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
    }
  };

  const handleRefresh = () => fetchData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 animate-pulse">
            loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <Header
          onSignOut={() => {
            localStorage.clear();
            router.push("/login");
          }}
        />

        <StatGrid users={users} projects={projects} customers={customers} />

        {/* Tab Navigation */}
        <div className="flex justify-center w-full mb-10 px-4">
          <div className="flex flex-row items-center w-full md:w-fit overflow-x-auto no-scrollbar bg-gray-900/60 backdrop-blur-xl p-1.5 rounded-2xl border border-white/5 shadow-2xl">
            {(["users", "projects", "customers"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 md:flex-none whitespace-nowrap px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40"
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <main className="transition-all duration-500">
          <div className="bg-transparent rounded-2xl overflow-hidden">
            {activeTab === "users" && (
              <UserTable users={users} onRefresh={handleRefresh} />
            )}

            {activeTab === "projects" && (
              <ProjectGrid
                projects={projects}
                onSelect={(p: Project) => setSelectedProject(p)}
                onCreate={() => setIsCreating(true)}
              />
            )}

            {activeTab === "customers" && (
              <CustomerList customers={customers} onRefresh={handleRefresh} />
            )}
          </div>
        </main>

        <footer className="mt-20 text-center text-[9px] font-black text-gray-700 uppercase tracking-[0.5em]">
          Secured Admin dashbaord
        </footer>
      </div>

      {/* Modal Logic: simplified since we are only doing edit/create */}
      {(selectedProject || isCreating) && (
        <ProjectModal
          project={isCreating ? null : selectedProject}
          users={users}
          onClose={() => {
            setSelectedProject(null);
            setIsCreating(false);
          }}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
}