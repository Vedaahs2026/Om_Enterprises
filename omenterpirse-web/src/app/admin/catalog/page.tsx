"use client";

import React, { useState, useEffect } from "react";
import { 
  Layers, 
  Award, 
  Ruler, 
  Package, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  RefreshCw, 
  ChevronRight, 
  Sparkles, 
  Tag, 
  DollarSign,
  AlertTriangle,
  Grid
} from "lucide-react";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type Variation = {
  id: number;
  modelId: number;
  thickness: string;
  colors: string; // JSON string
  price: number;
  salePrice?: number | null;
  stock: number;
  isActive: boolean;
};

type BrandModel = {
  id: number;
  brandLengthId: number;
  name: string;
  description?: string | null;
  isActive: boolean;
  variations: Variation[];
};

type BrandLength = {
  id: number;
  brandId: number;
  lengthInMeters: number;
  isActive: boolean;
  models: BrandModel[];
};

type Brand = {
  id: number;
  name: string;
  category: string;
  imageUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
  lengths: BrandLength[];
};

export default function MasterCatalogPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [catalog, setCatalog] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Current Selections for step-by-step editing
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [selectedLengthId, setSelectedLengthId] = useState<number | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);

  // Modal / Form state
  const [activeModal, setActiveModal] = useState<"brand" | "length" | "model" | "variation" | null>(null);

  // Form Fields
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandImage, setNewBrandImage] = useState("");
  const [newLength, setNewLength] = useState("");
  const [newModelName, setNewModelName] = useState("");
  const [newModelDesc, setNewModelDesc] = useState("");
  
  // Variation Form Fields
  const [varThickness, setVarThickness] = useState("");
  const [varColors, setVarColors] = useState<string[]>(["Red", "Yellow", "Blue", "Black", "Green"]);
  const [colorInput, setColorInput] = useState("");
  const [varPrice, setVarPrice] = useState("");
  const [varSalePrice, setVarSalePrice] = useState("");
  const [varStock, setVarStock] = useState("100");

  const fetchCatalog = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/catalog");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
        setCatalog(data.catalog || []);
        if (!selectedCategory && data.categories?.length > 0) {
          setSelectedCategory(data.categories[0].name);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load catalog data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  // Filtered lists based on selections
  const filteredBrands = catalog.filter((b) => 
    !selectedCategory || b.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  const selectedBrand = catalog.find((b) => b.id === selectedBrandId) || filteredBrands[0] || null;
  const availableLengths = selectedBrand ? selectedBrand.lengths : [];

  const selectedLength = availableLengths.find((l) => l.id === selectedLengthId) || availableLengths[0] || null;
  const availableModels = selectedLength ? selectedLength.models : [];

  const selectedModel = availableModels.find((m) => m.id === selectedModelId) || availableModels[0] || null;
  const availableVariations = selectedModel ? selectedModel.variations : [];

  // Handlers
  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    try {
      const res = await fetch("/api/admin/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "brand",
          name: newBrandName,
          category: selectedCategory || "Electrical Wires",
          imageUrl: newBrandImage || null,
        }),
      });
      if (res.ok) {
        setSuccess("Brand added!");
        setNewBrandName("");
        setNewBrandImage("");
        setActiveModal(null);
        fetchCatalog();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLength = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrand || !newLength) return;
    try {
      const res = await fetch("/api/admin/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "length",
          brandId: selectedBrand.id,
          lengthInMeters: Number(newLength),
        }),
      });
      if (res.ok) {
        setSuccess("Length option added!");
        setNewLength("");
        setActiveModal(null);
        fetchCatalog();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLength || !newModelName.trim()) return;
    try {
      const res = await fetch("/api/admin/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "model",
          brandLengthId: selectedLength.id,
          name: newModelName,
          description: newModelDesc,
        }),
      });
      if (res.ok) {
        setSuccess("Model added!");
        setNewModelName("");
        setNewModelDesc("");
        setActiveModal(null);
        fetchCatalog();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddVariation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModel || !varThickness || !varPrice) return;
    try {
      const res = await fetch("/api/admin/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "variation",
          modelId: selectedModel.id,
          thickness: varThickness,
          colors: varColors,
          price: Number(varPrice),
          salePrice: varSalePrice ? Number(varSalePrice) : null,
          stock: Number(varStock) || 100,
        }),
      });
      if (res.ok) {
        setSuccess("Variation added!");
        setVarThickness("");
        setVarPrice("");
        setVarSalePrice("");
        setActiveModal(null);
        fetchCatalog();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (type: string, id: number) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const res = await fetch(`/api/admin/catalog?type=${type}&id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSuccess(`${type} deleted!`);
        fetchCatalog();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddColorTag = () => {
    if (colorInput.trim() && !varColors.includes(colorInput.trim())) {
      setVarColors([...varColors, colorInput.trim()]);
      setColorInput("");
    }
  };

  const handleRemoveColorTag = (c: string) => {
    setVarColors(varColors.filter((col) => col !== c));
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#0D47A1]/10 pb-6">
        <div>
          <h1 className="text-3xl font-black text-[#0D47A1] tracking-tight flex items-center gap-3">
            <Layers className="text-[#FF9800]" size={32} />
            Master Catalog Configurator
          </h1>
          <p className="text-[#0D47A1]/60 text-sm mt-1">
            Single-page management for Category → Brands → Lengths → Models → Thicknesses, Colors & Pricing.
          </p>
        </div>
        <button
          onClick={fetchCatalog}
          className="self-start md:self-auto flex items-center gap-2 bg-[#0D47A1]/5 hover:bg-[#0D47A1]/10 text-[#0D47A1] px-4 py-2.5 rounded-xl font-bold text-xs transition-colors"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Sync Catalog
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

      {/* Step 1: Category Selector Pills */}
      <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 space-y-4">
        <label className="text-xs font-black uppercase tracking-wider text-[#0D47A1]/70 flex items-center gap-2">
          <Grid size={16} className="text-[#FF9800]" /> Select Active Category
        </label>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.name);
                setSelectedBrandId(null);
                setSelectedLengthId(null);
                setSelectedModelId(null);
              }}
              className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
                selectedCategory.toLowerCase() === cat.name.toLowerCase()
                  ? "bg-[#0D47A1] text-white shadow-lg shadow-[#0D47A1]/20 scale-105"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 4-Column Interactive Hierarchy Flow */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* COLUMN 1: BRANDS */}
        <div className="bg-white rounded-3xl p-5 shadow-xl border border-gray-100 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0D47A1] flex items-center gap-2">
              <Award size={16} className="text-[#FF9800]" />
              1. Brands ({filteredBrands.length})
            </h3>
            <button
              onClick={() => setActiveModal("brand")}
              className="p-1.5 bg-[#FF9800] text-white rounded-lg hover:bg-[#F57C00] transition-colors"
              title="Add Brand"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {filteredBrands.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No brands in {selectedCategory}. Click + to add one.</p>
            ) : (
              filteredBrands.map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    setSelectedBrandId(b.id);
                    setSelectedLengthId(null);
                    setSelectedModelId(null);
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedBrand?.id === b.id
                      ? "border-[#0D47A1] bg-[#0D47A1]/5 shadow-sm"
                      : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {b.imageUrl ? (
                      <img src={b.imageUrl} alt={b.name} className="w-7 h-7 object-contain rounded-md" />
                    ) : (
                      <Award size={18} className="text-[#0D47A1]" />
                    )}
                    <span className="text-xs font-bold text-[#0D47A1] truncate">{b.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteItem("brand", b.id); }}
                      className="text-gray-300 hover:text-red-500 p-1"
                    >
                      <Trash2 size={12} />
                    </button>
                    <ChevronRight size={14} className="text-gray-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 2: LENGTHS IN METRES */}
        <div className="bg-white rounded-3xl p-5 shadow-xl border border-gray-100 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0D47A1] flex items-center gap-2">
              <Ruler size={16} className="text-[#FF9800]" />
              2. Lengths ({availableLengths.length})
            </h3>
            {selectedBrand && (
              <button
                onClick={() => setActiveModal("length")}
                className="p-1.5 bg-[#FF9800] text-white rounded-lg hover:bg-[#F57C00] transition-colors"
                title="Add Length"
              >
                <Plus size={14} />
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {!selectedBrand ? (
              <p className="text-xs text-gray-400 py-6 text-center">Select a brand first.</p>
            ) : availableLengths.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No lengths configured for {selectedBrand.name}. Click + to add.</p>
            ) : (
              availableLengths.map((l) => (
                <div
                  key={l.id}
                  onClick={() => {
                    setSelectedLengthId(l.id);
                    setSelectedModelId(null);
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedLength?.id === l.id
                      ? "border-[#0D47A1] bg-[#0D47A1]/5 shadow-sm"
                      : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <span className="text-xs font-bold text-[#0D47A1]">
                    {l.lengthInMeters} <span className="text-[10px] text-gray-400">metres</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteItem("length", l.id); }}
                      className="text-gray-300 hover:text-red-500 p-1"
                    >
                      <Trash2 size={12} />
                    </button>
                    <ChevronRight size={14} className="text-gray-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 3: MODELS / TYPES */}
        <div className="bg-white rounded-3xl p-5 shadow-xl border border-gray-100 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0D47A1] flex items-center gap-2">
              <Package size={16} className="text-[#FF9800]" />
              3. Models ({availableModels.length})
            </h3>
            {selectedLength && (
              <button
                onClick={() => setActiveModal("model")}
                className="p-1.5 bg-[#FF9800] text-white rounded-lg hover:bg-[#F57C00] transition-colors"
                title="Add Model"
              >
                <Plus size={14} />
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {!selectedLength ? (
              <p className="text-xs text-gray-400 py-6 text-center">Select a length option first.</p>
            ) : availableModels.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No models added for {selectedLength.lengthInMeters}m. Click + to add.</p>
            ) : (
              availableModels.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedModelId(m.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedModel?.id === m.id
                      ? "border-[#0D47A1] bg-[#0D47A1]/5 shadow-sm"
                      : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <span className="text-xs font-bold text-[#0D47A1] truncate">{m.name}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteItem("model", m.id); }}
                      className="text-gray-300 hover:text-red-500 p-1"
                    >
                      <Trash2 size={12} />
                    </button>
                    <ChevronRight size={14} className="text-gray-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 4: VARIATIONS (THICKNESS, COLORS, PRICES) */}
        <div className="bg-white rounded-3xl p-5 shadow-xl border border-gray-100 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0D47A1] flex items-center gap-2">
              <Tag size={16} className="text-[#FF9800]" />
              4. Specs & Prices ({availableVariations.length})
            </h3>
            {selectedModel && (
              <button
                onClick={() => setActiveModal("variation")}
                className="p-1.5 bg-[#FF9800] text-white rounded-lg hover:bg-[#F57C00] transition-colors"
                title="Add Spec & Price"
              >
                <Plus size={14} />
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {!selectedModel ? (
              <p className="text-xs text-gray-400 py-6 text-center">Select a model first.</p>
            ) : availableVariations.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No specs/prices for {selectedModel.name}. Click + to add.</p>
            ) : (
              availableVariations.map((v) => {
                let parsedColors: string[] = [];
                try {
                  parsedColors = typeof v.colors === "string" ? JSON.parse(v.colors) : v.colors || [];
                } catch (e) {
                  parsedColors = v.colors ? v.colors.split(",") : [];
                }

                return (
                  <div key={v.id} className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#0D47A1]">{v.thickness}</span>
                      <button
                        onClick={() => handleDeleteItem("variation", v.id)}
                        className="text-gray-300 hover:text-red-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-[#0D47A1]">
                      <span>₹{v.salePrice || v.price}</span>
                      {v.salePrice && <span className="text-[10px] text-gray-400 line-through">₹{v.price}</span>}
                    </div>

                    {parsedColors.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {parsedColors.map((col, idx) => (
                          <span key={idx} className="bg-white border border-gray-200 text-gray-600 text-[9px] px-1.5 py-0.5 rounded font-medium">
                            {col}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* MODALS FOR ADDING HIERARCHICAL ITEMS */}

      {/* 1. Add Brand Modal */}
      {activeModal === "brand" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D47A1]/50 backdrop-blur-sm">
          <form onSubmit={handleAddBrand} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-[#0D47A1]">Add Brand to {selectedCategory}</h3>
            <input
              type="text"
              placeholder="Brand Name (e.g. Polycab, Havells)"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-[#0D47A1]"
              required
            />
            <input
              type="url"
              placeholder="Brand Logo Image URL (optional)"
              value={newBrandImage}
              onChange={(e) => setNewBrandImage(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-[#0D47A1]"
            />
            <div className="flex gap-3">
              <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-2.5 bg-gray-100 text-xs font-bold text-gray-600 rounded-xl">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 bg-[#FF9800] text-xs font-bold text-white rounded-xl">Add Brand</button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Add Length Modal */}
      {activeModal === "length" && selectedBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D47A1]/50 backdrop-blur-sm">
          <form onSubmit={handleAddLength} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-[#0D47A1]">Add Length to {selectedBrand.name}</h3>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                placeholder="Length in metres (e.g. 90, 180, 200)"
                value={newLength}
                onChange={(e) => setNewLength(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-[#0D47A1] pr-16"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">metres</span>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-2.5 bg-gray-100 text-xs font-bold text-gray-600 rounded-xl">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 bg-[#FF9800] text-xs font-bold text-white rounded-xl">Add Length</button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Add Model Modal */}
      {activeModal === "model" && selectedLength && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D47A1]/50 backdrop-blur-sm">
          <form onSubmit={handleAddModel} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-[#0D47A1]">Add Model ({selectedLength.lengthInMeters}m)</h3>
            <input
              type="text"
              placeholder="Model / Type Name (e.g. Flame Retardant FR, FRLSH)"
              value={newModelName}
              onChange={(e) => setNewModelName(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-[#0D47A1]"
              required
            />
            <textarea
              placeholder="Short Description (optional)"
              value={newModelDesc}
              onChange={(e) => setNewModelDesc(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-[#0D47A1]"
              rows={2}
            />
            <div className="flex gap-3">
              <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-2.5 bg-gray-100 text-xs font-bold text-gray-600 rounded-xl">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 bg-[#FF9800] text-xs font-bold text-white rounded-xl">Add Model</button>
            </div>
          </form>
        </div>
      )}

      {/* 4. Add Variation Modal (Thickness, Colors, Price) */}
      {activeModal === "variation" && selectedModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D47A1]/50 backdrop-blur-sm">
          <form onSubmit={handleAddVariation} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-[#0D47A1]">Add Spec & Price ({selectedModel.name})</h3>
            
            <div>
              <label className="text-[10px] font-black uppercase text-gray-500">Thickness / Gauge *</label>
              <input
                type="text"
                placeholder="e.g. 1.0 sq mm, 1.5 sq mm, 2.5 sq mm"
                value={varThickness}
                onChange={(e) => setVarThickness(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-[#0D47A1]"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-500">Available Colors</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add color (e.g. Red, Blue)"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#0D47A1]"
                />
                <button type="button" onClick={handleAddColorTag} className="px-3 bg-gray-200 hover:bg-gray-300 text-xs font-bold rounded-xl">+</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {varColors.map((c, idx) => (
                  <span key={idx} className="bg-gray-100 text-[#0D47A1] text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                    {c}
                    <button type="button" onClick={() => handleRemoveColorTag(c)} className="text-gray-400 hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-500">Regular Price (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  value={varPrice}
                  onChange={(e) => setVarPrice(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-[#0D47A1]"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-500">Sale Price (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 1350"
                  value={varSalePrice}
                  onChange={(e) => setVarSalePrice(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-[#0D47A1]"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-2.5 bg-gray-100 text-xs font-bold text-gray-600 rounded-xl">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 bg-[#FF9800] text-xs font-bold text-white rounded-xl">Save Specification</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
