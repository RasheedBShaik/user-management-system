"use client";

import { useState } from "react";
import { Edit3, Trash2, UserPlus, RefreshCcw, Building2, Mail, ShieldCheck } from "lucide-react";
import API from "../services/api";
import CustomerModal from "./CustomerModal";

interface Customer {
  _id?: string;
  id?: string | number;
  name: string;
  company: string;
  email: string;
  status: string;
}

interface Props {
  customers: Customer[];
  onRefresh: () => void;
}

export default function CustomerList({ customers, onRefresh }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("CONFIRM DATA PURGE?")) return;
    try {
      setDeletingId(id);
      await API.delete(`/customers/${id}`);
      onRefresh();
    } catch (err) {
      console.error("Purge Failed", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  return (
    // Added min-h-[600px] so the UI doesn't collapse with only 1 customer
    <div className="bg-[#0b0d11] rounded-[2rem] border border-white/10 shadow-2xl min-h-[600px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="p-6 sm:p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.02]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-widest text-white flex items-center gap-3">
            <div className="w-2 h-6 bg-blue-600 rounded-full" />
            Customer List
          </h2>
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-1 ml-5">
            Database Sync: {customers.length} Entries Active
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => { setSelectedCustomer(null); setIsModalOpen(true); }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-[10px] font-black bg-blue-600 text-white px-6 py-3 rounded-xl uppercase tracking-[0.2em] hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-600/20"
          >
            <UserPlus size={14} />
            ADD New
          </button>
          <button 
            onClick={onRefresh} 
            className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all group"
          >
            <RefreshCcw size={16} className="group-active:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/40 text-[9px] uppercase tracking-[0.3em] text-gray-500 font-black">
              <th className="px-8 py-6">Operative_Identity</th>
              <th className="px-6 py-6 hidden md:table-cell font-black">Organization</th>
              <th className="px-6 py-6 hidden sm:table-cell font-black">Comms_Link</th>
              <th className="px-6 py-6 font-black text-center">Status</th>
              <th className="px-8 py-6 text-right font-black">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {customers.map((c) => {
              const safeId = (c._id || c.id || "000000").toString();
              return (
                <tr key={safeId} className="hover:bg-blue-600/[0.03] transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-white group-hover:text-blue-400 transition-colors uppercase">
                        {c.name}
                      </span>
                      <span className="text-[9px] text-gray-600 font-mono mt-0.5 tracking-tighter uppercase">
                        UID // {safeId.slice(-8).toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-xs text-gray-400 font-medium hidden md:table-cell uppercase tracking-wider">
                    {c.company}
                  </td>
                  <td className="px-6 py-5 text-xs text-gray-500 font-mono hidden sm:table-cell">
                    {c.email}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      c.status.toLowerCase() === 'active' 
                        ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20' 
                        : 'bg-gray-500/5 text-gray-500 border-white/5'
                    }`}>
                      {c.status}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button onClick={() => handleEdit(c)} className="p-2.5 rounded-lg text-blue-500 hover:bg-blue-500/10 transition-all">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDelete(safeId)} disabled={deletingId === safeId} className="p-2.5 rounded-lg text-red-500 hover:bg-red-500/10 disabled:opacity-20 transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Empty State UI */}
        {customers.length === 0 && (
          <div className="h-[400px] flex flex-col items-center justify-center text-gray-600 bg-white/[0.01]">
            <ShieldCheck size={40} className="opacity-10 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Personnel Records Found</p>
          </div>
        )}
      </div>

      {/* Modal Integration - Rendered outside the flow to avoid clipping */}
      {isModalOpen && (
        <CustomerModal
          customer={selectedCustomer} 
          onClose={() => setIsModalOpen(false)} 
          onRefresh={onRefresh} 
        />
      )}
    </div>
  );
}