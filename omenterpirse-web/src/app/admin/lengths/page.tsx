"use client";

import React, { useState, useEffect } from "react";
import { Ruler, Plus, Trash2, CheckCircle, XCircle, RefreshCw, AlertTriangle, X, Award } from "lucide-react";

type Brand = {
  id: number;
  name: string;
  category: string;
  imageUrl?: string | null;
  isActive: boolean;
};

type BrandLength = {
  id: number;
  brandId: number;
  lengthInMeters: number;
  isActive: boolean;
  createdAt: string;
  brandName?: string;
  brandCategory?: string;
  brandImageUrl?: string | null;
};

export default function BrandLengthsPage() {
  const [lengths, setLengths] = useState<BrandLength[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [lengthInMeters, setLengthInMeters] = useState<string>("");
  const [isActive, setIsActive] = useState(true);

  // Delete modal state
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [lengthsRes, brandsRes] = await Promise.all([
        fetch("/api/admin/lengths"),
        fetch("/api/admin/brands"),
      ]);

      if (lengthsRes.ok) {
        const json = await lengthsRes.json();
        const lengthList = Array.isArray(json) ? json : (json.data || []);
        setLengths(lengthList);
      }
      if (brandsRes.ok) {
        const json = await brandsRes.json();
        const brandList = Array.isArray(json) ? json : (json.data || []);
        setBrands(brandList.filter((b: Brand) => b.isActive));
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrandId) {
      setError("Please select a brand from the dropdown.");
      return;
    }
    if (!lengthInMeters || isNaN(Number(lengthInMeters)) || Number(lengthInMeters) <= 0) {
      setError("Please enter a valid length in metres (e.g. 90, 100, 180).");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/lengths", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandId: Number(selectedBrandId),
          lengthInMeters: Number(lengthInMeters),
          isActive,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add length.");
      }

      setSuccess("Brand length added successfully!");
      setSelectedBrandId("");
      setLengthInMeters("");
      setIsActive(true);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (item: BrandLength) => {
    try {
      const res = await fetch("/api/admin/lengths", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          isActive: !item.isActive,
        }),
      });

      if (res.ok) {
        setLengths(lengths.map(l => l.id === item.id ? { ...l, isActive: !l.isActive } : l));
      }
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/lengths?id=${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setLengths(lengths.filter(l => l.id !== deleteId));
        setDeleteId(null);
        setSuccess("Length deleted successfully.");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete.");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#0D47A1]/10 pb-6">
        <div>
          <h1 className="text-3xl font-black text-[#0D47A1] tracking-tight flex items-center gap-3">
            <Ruler className="text-[#FF9800]" size={32} />
            Brand Lengths Management
          </h1>
          <p className="text-[#0D47A1]/60 text-sm mt-1">
            Specify wire/cable available lengths in metres for your registered brands.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="self-start md:self-auto flex items-center gap-2 bg-[#0D47A1]/5 hover:bg-[#0D47A1]/10 text-[#0D47A1] px-4 py-2.5 rounded-xl font-bold text-xs transition-colors"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-2xl text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")}><X size={16} /></button>
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 text-emerald-600 border border-emerald-200 p-4 rounded-2xl text-sm flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess("")}><X size={16} /></button>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 space-y-6">
        <h2 className="text-xl font-bold text-[#0D47A1] flex items-center gap-2">
          <Plus className="text-[#FF9800]" size={20} />
          Add Brand Length Option
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Select Brand Dropdown */}
          <div className="space-y-2 md:col-span-1">
            <label className="text-xs font-black uppercase tracking-wider text-[#0D47A1]/70">
              Select Brand *
            </label>
            <select
              value={selectedBrandId}
              onChange={(e) => setSelectedBrandId(e.target.value)}
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-[#0D47A1] focus:outline-none focus:border-[#FF9800] focus:bg-white transition-all"
            >
              <option value="">-- Choose Brand --</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.category})
                </option>
              ))}
            </select>
          </div>

          {/* Length input */}
          <div className="space-y-2 md:col-span-1">
            <label className="text-xs font-black uppercase tracking-wider text-[#0D47A1]/70">
              Length (in metres) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.1"
                placeholder="e.g. 90, 100, 180, 200"
                value={lengthInMeters}
                onChange={(e) => setLengthInMeters(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-[#0D47A1] focus:outline-none focus:border-[#FF9800] focus:bg-white transition-all pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 uppercase">
                Metres
              </span>
            </div>
          </div>

          {/* Active toggle & Submit Button */}
          <div className="flex items-center gap-4 md:col-span-1">
            <label className="flex items-center gap-2 cursor-pointer py-3">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-[#FF9800] rounded focus:ring-[#FF9800]"
              />
              <span className="text-xs font-bold text-[#0D47A1]">Active Option</span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-[#FF9800] hover:bg-[#F57C00] text-white font-bold text-xs uppercase tracking-widest py-3.5 px-6 rounded-2xl shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Add Length"}
            </button>
          </div>
        </form>
      </div>

      {/* Lengths Table */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-xl font-bold text-[#0D47A1]">Configured Lengths ({lengths.length})</h2>
        </div>

        {loading ? (
          <div className="py-12 text-center text-[#0D47A1]/40 text-sm">Loading brand lengths...</div>
        ) : lengths.length === 0 ? (
          <div className="py-12 text-center text-[#0D47A1]/40 text-sm">
            No brand lengths added yet. Select a brand above and specify its length in metres.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-black uppercase tracking-wider text-[#0D47A1]/40">
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Length</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {lengths.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-[#0D47A1]">
                      <div className="flex items-center gap-3">
                        {item.brandImageUrl ? (
                          <img
                            src={item.brandImageUrl}
                            alt={item.brandName || "Brand"}
                            className="w-8 h-8 rounded-lg object-contain bg-gray-50 p-1 border border-gray-100"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-[#0D47A1]/5 flex items-center justify-center text-[#0D47A1]">
                            <Award size={16} />
                          </div>
                        )}
                        <span>{item.brandName || `Brand #${item.brandId}`}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-500">
                      <span className="bg-[#0D47A1]/5 text-[#0D47A1] text-xs px-2.5 py-1 rounded-full font-bold">
                        {item.brandCategory || "General"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-black text-[#0D47A1] text-base">
                        {item.lengthInMeters} <span className="text-xs font-semibold text-gray-400">metres</span>
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full transition-colors ${
                          item.isActive
                            ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        }`}
                      >
                        {item.isActive ? (
                          <>
                            <CheckCircle size={12} /> Active
                          </>
                        ) : (
                          <>
                            <XCircle size={12} /> Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D47A1]/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#0D47A1]">Confirm Delete</h3>
            <p className="text-xs text-gray-500">
              Are you sure you want to remove this length option?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
