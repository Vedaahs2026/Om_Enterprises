"use client";

import React, { useEffect, useState } from "react";
import { 
  Package, 
  TrendingUp, 
  AlertCircle, 
  Truck, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Filter,
  Loader2,
  Box,
  Image as ImageIcon
} from "lucide-react";

interface ProductStats {
  id: number;
  name: string;
  category: string;
  basePrice: number;
  sold: number;
  remaining: number;
  toBeDelivered: number;
  image: string | null;
  variations: {
    id: number;
    size: string;
    color?: string | null;
    stock: number;
    sold: number;
    toBeDelivered: number;
    remaining: number;
  }[];
}

const resolveColorCSS = (colorName: string): string => {
  const normalized = colorName.trim().toUpperCase();
  if (normalized.startsWith("#")) return normalized;
  
  const map: Record<string, string> = {
    "BLACK": "#000000",
    "WHITE": "#FAFAFA",
    "NAVY": "#1B2A4A",
    "FOREST GREEN": "#1C3B2B",
    "MAROON": "#7D1C1C",
    "BEIGE": "#F2E8D5",
    "GOLD": "#C5A059",
    "RED": "#E53935",
    "SKY BLUE": "#63C2DE",
    "PINK": "#E83E8C",
    "GREY": "#8F9BA6",
    "BROWN": "#8B4513",
  };
  
  return map[normalized] || colorName;
};

export default function InventoryPage() {
  const [data, setData] = useState<Record<string, ProductStats[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "most-selling" | "low-stock" | "out-of-stock">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/admin/inventory");
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch inventory", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    const container = document.getElementById('admin-scroll-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' }); // fallback
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const allProducts = Object.values(data).flat();

  let filteredProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply Tab Filters
  if (activeTab === "most-selling") {
    // For Most Selling, products must have at least 1 sale
    filteredProducts = filteredProducts.filter(p => (p.sold + p.toBeDelivered) > 0);
  } else if (activeTab === "low-stock") {
    filteredProducts = filteredProducts.filter(p => 
      (p.remaining < 10 && p.remaining > 0) || 
      (p.variations && p.variations.some(v => v.remaining < 10 && v.remaining > 0))
    );
  } else if (activeTab === "out-of-stock") {
    filteredProducts = filteredProducts.filter(p => 
      p.remaining === 0 || 
      (p.variations && p.variations.some(v => v.remaining === 0))
    );
  }

  // Sort alphabetically as requested
  filteredProducts.sort((a, b) => a.name.localeCompare(b.name));

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const currentProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="animate-spin text-brand-accent mb-4" size={40} />
        <p className="text-brand/40 font-bold uppercase tracking-widest text-xs">Syncing Inventory...</p>
      </div>
    );
  }

  const tabs = [
    { id: "all", label: "All Products", icon: Package },
    { id: "most-selling", label: "Most Selling", icon: TrendingUp },
    { id: "low-stock", label: "Near Out of Stock", icon: AlertCircle },
    { id: "out-of-stock", label: "Out of Stock", icon: Box },
  ];

  return (
    <div className="pb-20 px-8 pt-8">
      {/* Header section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-playfair font-bold text-brand">Inventory Management</h1>
          <p className="mt-2 text-brand/60 font-medium">Real-time stock tracking and fulfillment metrics.</p>
        </div>

        <div className="relative group min-w-[350px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand/30 group-focus-within:text-[#FF9800] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search products or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-brand/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-brand focus:outline-none focus:ring-4 focus:ring-[#FF9800]/5 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-10 p-1.5 bg-brand/5 rounded-2xl w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                ${isActive 
                  ? "bg-brand text-brand-accent shadow-lg shadow-brand/20 scale-105" 
                  : "text-brand/40 hover:text-brand hover:bg-white"
                }
              `}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-brand-accent ml-1" />}
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      <div className="space-y-8">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 shadow-sm border border-brand/5 text-center">
            <div className="w-20 h-20 bg-brand/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Box size={40} className="text-brand/20" />
            </div>
            <h3 className="text-2xl font-playfair font-bold text-brand mb-2">No products found</h3>
            <p className="text-brand/60 font-medium max-w-sm mx-auto">Try adjusting your search terms to find specific inventory items.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
              {currentProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-[2rem] border border-brand/5 p-5 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                  {/* Product Header */}
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-20 h-20 bg-brand/5 rounded-2xl overflow-hidden flex-shrink-0 border border-brand/5">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand/20">
                          <ImageIcon size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-brand truncate mb-1">{product.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black text-[#FF9800] uppercase tracking-widest">₹{product.basePrice.toLocaleString()}</span>
                        <span className="text-brand/10">|</span>
                        <span className="text-[10px] font-bold text-brand/40 uppercase tracking-widest truncate">{product.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100/50 text-center">
                      <p className="text-[8px] font-black text-green-600 uppercase tracking-widest mb-1">Sold</p>
                      <div className="flex items-center justify-center space-x-1">
                        <TrendingUp size={12} className="text-green-500" />
                        <p className="text-lg font-black text-green-700">{product.sold}</p>
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-2xl border text-center ${product.remaining < 10 ? 'bg-red-50/50 border-red-100/50' : 'bg-brand/5 border-brand/5'}`}>
                      <p className={`text-[8px] font-black uppercase tracking-widest mb-1 ${product.remaining < 10 ? 'text-red-600' : 'text-brand/40'}`}>Remaining</p>
                      <div className="flex items-center justify-center space-x-1">
                        {product.remaining < 10 && <AlertCircle size={12} className="text-red-500" />}
                        <p className={`text-lg font-black ${product.remaining < 10 ? 'text-red-700' : 'text-brand'}`}>{product.remaining}</p>
                      </div>
                    </div>

                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 text-center">
                      <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-1">To be Deliver</p>
                      <div className="flex items-center justify-center space-x-1">
                        <Truck size={12} className="text-blue-500" />
                        <p className="text-lg font-black text-blue-700">{product.toBeDelivered}</p>
                      </div>
                    </div>
                  </div>

                  {/* Variations Breakdown */}
                  {(() => {
                    const groupedVariations = product.variations ? product.variations.reduce((acc: any[], v) => {
                      let group = acc.find(g => g.size === v.size);
                      if (!group) {
                        group = { size: v.size, items: [] };
                        acc.push(group);
                      }
                      group.items.push(v);
                      return acc;
                    }, []) : [];

                    if (groupedVariations.length === 0) return null;

                    return (
                      <div className="mt-6 pt-6 border-t border-brand/5">
                        <p className="text-[10px] font-black text-brand uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Box size={12} className="text-[#FF9800]" />
                          Variations Stock
                        </p>
                        <div className="space-y-4">
                          {groupedVariations.map((group: any) => (
                            <div key={group.size} className="bg-brand/[0.01] rounded-2xl border border-brand/5 p-4 w-full">
                              {/* Header Row (Grid) */}
                              <div className="grid grid-cols-[1fr_52px_36px_56px] gap-x-2 items-center pb-3">
                                {/* Size Badge */}
                                <span className="px-3 py-1 text-xs font-black text-brand bg-white border border-brand/10 rounded-xl shadow-sm justify-self-start">
                                  {group.size}
                                </span>

                                {/* Header Labels and Summed Values */}
                                <div className="text-right">
                                  <p className="text-[6.5px] font-black text-red-500 uppercase tracking-widest mb-0.5 leading-tight">STOCK<br/>LEFT</p>
                                  <p className="text-xs font-black text-red-600 leading-none">
                                    {group.items.reduce((sum: number, item: any) => sum + (item.remaining || 0), 0)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[6.5px] font-black text-green-600 uppercase tracking-widest mb-0.5 leading-tight">SOLD</p>
                                  <p className="text-xs font-black text-green-700 leading-none">
                                    {group.items.reduce((sum: number, item: any) => sum + (item.sold || 0), 0)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[6.5px] font-black text-blue-600 uppercase tracking-widest mb-0.5 leading-tight">TO<br/>DELIVER</p>
                                  <p className="text-xs font-black text-blue-700 leading-none">
                                    {group.items.reduce((sum: number, item: any) => sum + (item.toBeDelivered || 0), 0)}
                                  </p>
                                </div>
                              </div>

                              {/* Dotted Separator */}
                              <div className="border-t border-dashed border-brand/10 my-3" />

                              {/* Color Rows List */}
                              <div className="space-y-3">
                                {group.items.map((v: any) => (
                                  <div key={v.id} className="grid grid-cols-[1fr_52px_36px_56px] gap-x-2 items-center py-1">
                                    {/* Color Label */}
                                    <div className="flex items-center gap-2">
                                      {v.color ? (
                                        <>
                                          <span 
                                            className="w-2.5 h-2.5 rounded-full border border-brand/10 shadow-inner shrink-0" 
                                            style={{ backgroundColor: resolveColorCSS(v.color) }}
                                          />
                                          <span className="text-[11px] font-semibold text-brand/80 truncate">
                                            {v.color}
                                          </span>
                                        </>
                                      ) : (
                                        <span className="text-[11px] font-semibold text-brand/40 italic">
                                          No Color
                                        </span>
                                      )}
                                    </div>

                                    {/* Stock Stats Aligned Underneath Headers */}
                                    <div className="text-right">
                                      <span className="text-[9px] font-bold text-red-500 whitespace-nowrap">
                                        {v.remaining} left
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-[9px] font-bold text-green-600 whitespace-nowrap">
                                        {v.sold} sold
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-[9px] font-bold text-blue-500 whitespace-nowrap">
                                        {v.toBeDelivered} pending
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Low Stock Warning */}
                  {product.remaining < 10 && product.remaining > 0 && (
                    <div className="mt-4 py-2 px-3 bg-red-600 text-white rounded-xl flex items-center justify-center space-x-2 animate-pulse">
                      <AlertCircle size={12} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Low Stock Warning</span>
                    </div>
                  )}
                  
                  {product.remaining === 0 && (
                    <div className="mt-4 py-2 px-3 bg-gray-900 text-white rounded-xl flex items-center justify-center space-x-2">
                      <Box size={12} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Out of Stock</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center space-x-2">
                <button
                  onClick={() => {
                    setCurrentPage(p => Math.max(1, p - 1));
                    scrollToTop();
                  }}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-full border border-brand/10 flex items-center justify-center text-brand/50 hover:bg-brand/5 hover:text-brand disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronDown size={18} className="rotate-90" />
                </button>
                
                <div className="flex items-center space-x-1 px-2 overflow-x-auto no-scrollbar max-w-full">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    // Show first, last, current, and surrounding pages
                    if (
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => {
                            setCurrentPage(page);
                            scrollToTop();
                          }}
                          className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                            currentPage === page 
                              ? 'bg-brand text-[#FF9800] shadow-md scale-110' 
                              : 'text-brand/50 hover:bg-brand/5 hover:text-brand border border-transparent'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 || 
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="text-brand/30 px-1">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => {
                    setCurrentPage(p => Math.min(totalPages, p + 1));
                    scrollToTop();
                  }}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-full border border-brand/10 flex items-center justify-center text-brand/50 hover:bg-brand/5 hover:text-brand disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronDown size={18} className="-rotate-90" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
