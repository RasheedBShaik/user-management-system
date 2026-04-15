"use client";

import { useMemo } from "react";

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
    const projectProgress = projects.length > 0 ? Math.min((projects.length / 20) * 100, 100) : 0; // Assuming 20 is a goal
    const customerProgress = customers.length > 0 ? Math.min((customers.length / 10) * 100, 100) : 0;

    return [
      {
        label: "Active Users",
        value: activeUsers,
        description: `${activeUsers} of ${totalUsers} users online`,
        color: "bg-green-500",
        width: `${userProgress}%`,
      },
      {
        label: "Total Projects",
        value: projects.length,
        description: "Active system tasks",
        color: "bg-blue-500",
        width: `${projectProgress}%`,
      },
      {
        label: "Total Customers",
        value: customers.length,
        description: "Registered partners",
        color: "bg-purple-500",
        width: `${customerProgress}%`,
      },
    ];
  }, [users, projects, customers]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className="bg-gray-800 p-6 rounded-2xl border border-white/5 shadow-xl transition-all hover:border-white/10"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
            {stat.label}
          </p>
          
          <div className="text-4xl font-bold mb-5 tracking-tight text-white">
            {stat.value.toString().padStart(2, '0')}
          </div>

          <div className="flex flex-col gap-3">
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${stat.color} transition-all duration-1000 ease-out`} 
                style={{ width: stat.width }} 
              />
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              {stat.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}