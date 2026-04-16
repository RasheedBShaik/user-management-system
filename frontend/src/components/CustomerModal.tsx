"use client";

import { useState, useEffect } from "react";
import { X, Save, ShieldAlert, Fingerprint, Globe, Building2, Mail, Terminal } from "lucide-react";
import API from "../services/api";

export default function CustomerModal({ customer, onClose, onRefresh }: any) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    status: "active",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        company: customer.company || "",
        email: customer.email || "",
        status: customer.status || "active",
      });
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (customer?._id) {
        await API.put(`/customers/${customer._id}`, formData);
      } else {
        await API.post("/customers", formData);
      }
      onRefresh();
      onClose();
    } catch (err: any) {
      console.error("Transmission Error:", err.response?.data || err.message);
      alert("CRITICAL_FAILURE: Database connection severed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[200] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-[#080a0f] border border-white/10 w-full max-w-xl rounded-[2.5rem] shadow-[0_0_80px_rgba(37,99,235,0.15)] relative overflow-hidden">
        
        {/* Visual Top Accent */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-blue-500/50 animate-pulse"></div>

        {/* Modal Header */}
        <div className="p-8 pb-4 flex justify-between items-start">
          <div className="flex gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-500">
              <Fingerprint size={28} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                <span className="text-blue-500">/</span> {customer ? "Modify_Entity" : "Register_Entity"}
              </h2>
              <p className="text-[9px] font-mono text-gray-500 uppercase tracking-[0.2em] mt-1">
                Directory_Ref: {customer?._id?.slice(-8).toUpperCase() || "NEW_ALLOCATION"}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
          
          {/* Main Attributes */}
          <div className="space-y-4">
            <div className="relative group">
               <label className="absolute -top-2 left-4 px-2 bg-[#080a0f] text-[8px] font-black text-blue-500 uppercase tracking-widest z-10">Legal_Identity</label>
               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors">
                  <Terminal size={14} />
               </div>
               <input 
                className="w-full bg-white/[0.03] border border-white/10 p-4 pl-12 rounded-2xl text-sm font-bold text-white outline-none focus:border-blue-500/50 focus:bg-blue-600/[0.02] transition-all placeholder:text-gray-700"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Building2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input 
                  className="w-full bg-white/[0.03] border border-white/10 p-4 pl-12 rounded-2xl text-sm font-bold text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-700"
                  placeholder="Organization"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  required
                />
              </div>

              <div className="relative">
                <select 
                  className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl text-sm font-bold text-white outline-none appearance-none cursor-pointer focus:border-blue-500/50"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="active" className="bg-[#0f1115]">STATUS: ACTIVE</option>
                  <option value="inactive" className="bg-[#0f1115]">STATUS: OFFLINE</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div>
              </div>
            </div>

            <div className="relative group">
              <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
              <input 
                className="w-full bg-white/[0.03] border border-white/10 p-4 pl-12 rounded-2xl text-sm font-bold text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-700"
                placeholder="Comms_Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Warning Banner */}
          <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-3">
             <ShieldAlert size={16} className="text-blue-500 shrink-0 mt-0.5" />
             <p className="text-[9px] text-gray-400 font-mono leading-relaxed uppercase">
                Notice: All entity modifications are logged to the security audit trail. verify integrity before commit.
             </p>
          </div>

          {/* Submission Group */}
          <div className="flex gap-4 pt-2">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`flex-1 flex items-center justify-center gap-2 py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.3em] transition-all
                ${isSubmitting ? 'bg-gray-800 text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-600/20 active:scale-95'}
              `}
            >
              <Save size={16} />
              {isSubmitting ? "Syncing..." : "Save Data"}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="px-8 bg-white/5 text-gray-500 font-black py-5 rounded-[1.5rem] uppercase text-[10px] tracking-widest hover:text-white hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}