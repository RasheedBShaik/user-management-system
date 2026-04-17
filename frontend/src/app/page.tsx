"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Users, Zap, ArrowRight } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Only auto-redirect if a valid session exists
        if (parsed.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/user");
        }
      } catch (error) {
        console.error("Session error", error);
        setLoading(false);
      }
    } else {
      // No user found, stay on landing page
      setLoading(false);
    }
  }, [router]);

  // Loading state with a subtle spinner to prevent content flash
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-green-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        
        {/* HERO SECTION */}
        <div className="text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Management System
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-b from-white to-gray-400">
            Manage Users with <br />
            <span className="text-blue-500">Total Confidence.</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
            A production-ready <span className="text-white font-medium">MERN STACK</span> role-based access control, JWT security, and seamless UX.
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={() => router.push("/login")}
            className="group flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-blue-600/20 active:scale-95 cursor-pointer"
          >
            Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => router.push("/register")}
            className="flex items-center justify-center bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-xl font-semibold transition-all duration-200 backdrop-blur-sm cursor-pointer"
          >
            Create Account
          </button>
        </div>

        {/* FEATURES GRID */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
          <FeatureCard 
            icon={<ShieldCheck className="text-blue-500" />}
            title="Secure Auth"
            desc="Stateless authentication using JWT and encrypted HttpOnly cookies."
          />
          <FeatureCard 
            icon={<Users className="text-green-500" />}
            title="Role Access"
            desc="Granular permissions for Admins and Standard Users out of the box."
          />
          <FeatureCard 
            icon={<Zap className="text-purple-500" />}
            title="Next.js Speed"
            desc="Server-side rendering and optimized routing for blazing fast performance."
          />
        </div>

        {/* FOOTER */}
        <footer className="mt-24 text-gray-600 text-sm font-medium">
          Built with <span className="text-red-900/80">❤️</span> by the MERN Community
        </footer>
      </div>
    </div>
  );
}

// Sub-component for UI Consistency
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white/3 p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
      <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">
        {desc}
      </p>
    </div>
  );
}