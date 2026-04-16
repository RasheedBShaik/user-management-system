"use client";

import { useMemo } from "react";
import { Activity, Briefcase, Users as UsersIcon } from "lucide-react";

// Define the types for our data
interface User {
  status: string;
}

interface Project {
  _id: string;
}

interface Customer {
  id: string | number;
}

interface StatGridProps {
  users: User[];
  projects: Project[];
  customers: Customer[];
}

export default function StatGrid({ users = [], projects = [], customers = [] }: StatGridProps) {
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === "active").length;
    
    // Dynamic progress calculation
    const userProgress = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
    const projectProgress = projects.length > 0 ? Math.min((projects.length / 20) * 100, 100) : 0; 
    const customerProgress = customers.length > 0 ? Math.min((customers.length / 10) * 100, 100) : 0;

    return [
      {
        label: "Active Users/Employees",
        value: activeUsers,
        description: `${activeUsers} / ${totalUsers} Nodes Online`,
        color: "bg-emerald-500",
        shadow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
        width: `${userProgress}%`,
        icon: <UsersIcon size={14} className="text-emerald-500" />,
      },
      {
        label: "Projects",
        value: projects.length,
        description: "Active System Threads",
        color: "bg-blue-600",
        shadow: "shadow-[0_0_15px_rgba(37,99,235,0.3)]",
        width: `${projectProgress}%`,
        icon: <Briefcase size={14} className="text-blue-500" />,
      },
      {
        label: "Costomers",
        value: customers.length,
        description: "Verified Data Links",
        color: "bg-purple-600",
        shadow: "shadow-[0_0_15px_rgba(147,51,234,0.3)]",
        width: `${customerProgress}%`,
        icon: <Activity size={14} className="text-purple-500" />,
      },
    ];
  }, [users, projects, customers]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className="group relative bg-[#0b0d11] p-8 rounded-4xl border border-white/5 shadow-2xl overflow-hidden transition-all hover:border-white/10 hover:-translate-y-1 duration-500"
        >
          {/* Subtle Background Glow */}
          <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 blur-3xl ${stat.color}`} />

          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col gap-1">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">
                {stat.label}
              </p>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                 <span className="text-[7px] font-mono text-gray-700 uppercase tracking-tighter">Live_Telemetry</span>
              </div>
            </div>
            <div className="p-2.5 bg-white/3 border border-white/5 rounded-xl">
              {stat.icon}
            </div>
          </div>
          
          <div className="text-5xl font-black mb-8 tracking-tighter text-white">
            {stat.value.toString().padStart(2, '0')}
            <span className="text-xs text-gray-700 ml-2 font-mono tracking-normal opacity-50">.SYS</span>
          </div>

          <div className="space-y-4">
            <div className="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              {/* Animated Scanner Effect */}
              <div 
                className={`absolute top-0 left-0 h-full rounded-full ${stat.color} ${stat.shadow} transition-all duration-1000 ease-out z-10`} 
                style={{ width: stat.width }} 
              />
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent w-full h-full animate-scan-fast" />
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.15em]">
                {stat.description}
              </p>
              <span className="text-[10px] font-mono text-white/40">{Math.round(parseFloat(stat.width))}%</span>
            </div>
          </div>

          {/* Decorative Corner Detail */}
          <div className="absolute bottom-0 right-0 w-8 h-8 opacity-10">
            <div className="absolute bottom-3 right-3 w-0.5 h-0.5 bg-white rounded-full" />
            <div className="absolute bottom-3 right-6 w-0.5 h-0.5 bg-white rounded-full" />
            <div className="absolute bottom-6 right-3 w-0.5 h-0.5 bg-white rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}