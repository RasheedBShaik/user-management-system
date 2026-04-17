"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ArrowLeft, Lock, Mail, Activity, User, UserPlus, Phone } from "lucide-react";
import API from "../../services/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // Added Phone State
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await API.post("/auth/register", {
        name,
        email,
        phone, // Added Phone to API payload
        password,
        role,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/user");
      }
    } catch (err: any) {
      setError(err.response?.data?.msg || "REGISTRATION_FAILED: System Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#050505] overflow-hidden text-white">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent opacity-50" />

      {/* --- BACK BUTTON --- */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-white transition-colors group px-4 py-2 rounded-xl border border-white/5 hover:bg-white/5"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Home</span>
      </button>

      {/* --- REGISTER CARD --- */}
      <div className="relative group w-full max-w-md px-4">
        <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-cyan-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>

        <div className="relative bg-[#0d0d0d] border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              <UserPlus className="text-blue-500" size={32} />
            </div>
            <h1 className="text-xl font-black text-white tracking-[0.3em] uppercase">
              New Instance
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Activity size={10} className="text-emerald-500 animate-pulse" />
              <span className="text-[8px] font-mono text-gray-600 uppercase tracking-widest">
                Identity Registration
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Name Input */}
            <div className="relative group/input">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-blue-500 transition-colors" size={16} />
              <input
                type="text"
                placeholder="FULL NAME"
                className="w-full bg-white/3 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-blue-500/50 focus:bg-blue-500/5 font-mono text-xs tracking-widest transition-all placeholder:text-gray-700"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email Input */}
            <div className="relative group/input">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-blue-500 transition-colors" size={16} />
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="w-full bg-white/3 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-blue-500/50 focus:bg-blue-500/5 font-mono text-xs tracking-widest transition-all placeholder:text-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Phone Input */}
            <div className="relative group/input">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-blue-500 transition-colors" size={16} />
              <input
                type="tel"
                placeholder="PHONE NUMBER"
                className="w-full bg-white/3 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-blue-500/50 focus:bg-blue-500/5 font-mono text-xs tracking-widest transition-all placeholder:text-gray-700"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="relative group/input">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-blue-500 transition-colors" size={16} />
              <input
                type="password"
                placeholder="PASSWORD"
                className="w-full bg-white/3 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-blue-500/50 focus:bg-blue-500/5 font-mono text-xs tracking-widest transition-all placeholder:text-gray-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Role Select */}
            <div className="relative group/input">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-blue-500 transition-colors" size={16} />
              <select
                className="w-full bg-white/3 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-blue-500/50 focus:bg-blue-500/5 font-mono text-xs tracking-widest transition-all appearance-none cursor-pointer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user" className="bg-[#0d0d0d]">ROLE: USER</option>
                <option value="admin" className="bg-[#0d0d0d]">ROLE: ADMIN</option>
              </select>
            </div>

            {/* Register Button */}
            <button
              onClick={handleRegister}
              disabled={loading}
              className={`relative w-full overflow-hidden group/btn flex items-center justify-center py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all active:scale-95 ${
                loading
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-white text-black hover:bg-blue-600 hover:text-white"
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 border-2 border-t-transparent border-current rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl">
                <p className="text-red-500 text-[9px] font-black uppercase tracking-widest text-center">
                  Error: {error}
                </p>
              </div>
            )}
          </div>

          {/* Footer Detail */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <p className="text-[7px] font-mono text-gray-700 uppercase tracking-widest">
              Secure Protocol Alpha-01
            </p>
            <button 
              onClick={() => router.push("/login")}
              className="text-[9px] font-black text-blue-500/60 hover:text-blue-400 uppercase tracking-[0.2em] transition-colors"
            >
              Have ACcount? Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}