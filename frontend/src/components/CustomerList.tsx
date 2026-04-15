"use client";

import { useState } from "react";
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
    if (!confirm("Confirm Permanent Deletion?")) return;
    try {
      setDeletingId(id);
      await API.delete(`/customers/${id}`);
      onRefresh();
    } catch (err) {
      console.error("Delete Failed", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-gray-800 rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-white/5 flex justify-between items-center bg-white/1">
        <div>
          <h2 className="text-lg sm:text-xl font-black uppercase text-white">Customer Link</h2>
          
        </div>
        <div className="flex gap-2 sm:gap-4">
            <button 
                onClick={() => { setSelectedCustomer(null); setIsModalOpen(true); }}
                className="text-[9px] sm:text-[10px] font-black bg-blue-600 text-white px-3 py-2 rounded-lg uppercase tracking-widest hover:bg-blue-500 transition-all"
            >
                Add
            </button>
            <button onClick={onRefresh} className="text-[9px] sm:text-[10px] font-black text-gray-500 hover:text-white transition-all uppercase tracking-widest px-2">
            [ refresh ]
            </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-black/20 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">
              <th className="px-4 sm:px-6 py-5">Cutomer Name</th>
              <th className="px-6 py-5 hidden md:table-cell">Organization</th>
              <th className="px-6 py-5 hidden sm:table-cell">Mail</th>
              <th className="px-4 sm:px-6 py-5">Status</th>
              <th className="px-4 sm:px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {customers.map((c) => {
              const safeId = (c._id || c.id || "000000").toString();
              return (
                <tr key={safeId} className="hover:bg-white/2 transition-colors group">
                  <td className="px-4 sm:px-6 py-4">
                    <p className="text-sm font-bold text-white leading-tight">{c.name}</p>
                    <p className="text-[9px] text-gray-600 font-mono mt-1">ID: {safeId.slice(-6)}</p>
                    {/* Inline mobile organization info */}
                    <p className="text-[10px] text-gray-500 md:hidden mt-1">{c.company}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 hidden md:table-cell">{c.company}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">{c.email}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[8px] sm:text-[9px] font-black uppercase tracking-tighter ${
                      c.status === 'active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-gray-500/10 text-gray-500'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    {/* FIXED: Removed opacity-0 for mobile, kept for large screens */}
                    <div className="flex justify-end gap-3 sm:gap-4">
                      <button 
                        onClick={() => handleEdit(c)}
                        className="text-[10px] font-black text-blue-500 hover:text-blue-300 uppercase p-1"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(safeId)}
                        disabled={deletingId === safeId}
                        className="text-[10px] font-black text-red-500 hover:text-red-400 uppercase disabled:opacity-30 p-1"
                      >
                        {deletingId === safeId ? "..." : "Del"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Integration */}
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