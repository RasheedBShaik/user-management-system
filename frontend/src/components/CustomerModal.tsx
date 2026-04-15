"use client";
import { useState, useEffect } from "react";
import API from "../services/api";

export default function CustomerModal({ customer, onClose, onRefresh }: any) {
  const [formData, setFormData] = useState({
    name: "", company: "", email: "", status: "active"
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        company: customer.company || "",
        email: customer.email || "",
        status: customer.status || "active"
      });
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (customer?._id) {
        await API.put(`/customers/${customer._id}`, formData);
      } else {
        await API.post("/customers", formData);
      }
      onRefresh(); // Refresh the AdminPage state
      onClose();   // Close modal
    } catch (err: any) {
      console.error("Transmission Error:", err.response?.data || err.message);
      alert("Save Failed: Server Unreachable or Database Error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-200 flex items-center justify-center p-4">
      <div className="bg-[#0f1115] border border-white/10 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative">
        <h2 className="text-2xl font-black text-white uppercase italic mb-6">
          {customer ? "Modify_Entity" : "Register_Entity"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-500"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input 
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-500"
            placeholder="Company"
            value={formData.company}
            onChange={(e) => setFormData({...formData, company: e.target.value})}
            required
          />
          <input 
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-500"
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <select 
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-xl uppercase text-xs tracking-widest hover:bg-blue-500">Save</button>
            <button type="button" onClick={onClose} className="px-6 bg-white/5 text-gray-400 font-bold py-4 rounded-xl uppercase text-xs tracking-widest">Abort</button>
          </div>
        </form>
      </div>
    </div>
  );
}