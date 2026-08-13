"use client";

import React, { useState, useEffect, use } from "react";
import { 
  ArrowLeft, 
  Ruler, 
  ChevronRight, 
  AlertCircle, 
  Package, 
  ShoppingCart, 
  RotateCcw, 
  Check, 
  Tag 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { formatLength } from "@/lib/utils";

function getColorStyles(colorName: string) {
  const name = (colorName || "").toLowerCase().trim();
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    red: { bg: "#EF4444", text: "#FFFFFF", border: "#DC2626" },
    yellow: { bg: "#FBBF24", text: "#000000", border: "#D97706" },
    blue: { bg: "#2563EB", text: "#FFFFFF", border: "#1D4ED8" },
    green: { bg: "#10B981", text: "#FFFFFF", border: "#059669" },
    black: { bg: "#1F2937", text: "#FFFFFF", border: "#111827" },
    white: { bg: "#FFFFFF", text: "#1F2937", border: "#E5E7EB" },
  };
  return colorMap[name] || { bg: "#E5E7EB", text: "#374151", border: "#D1D5DB" };
}

type Variation = {
  id: number;
  modelId?: number | null;
  brandId?: number | null;
  thickness?: string | null;
  colors: string; // JSON array or comma-separated
  price: number;
  salePrice?: number | null;
  stock: number;
  isActive: boolean;
};

type BrandModel = {
  id: number;
  brandLengthId?: number | null;
  brandId?: number | null;
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
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function UnifiedBrandDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const addItemToCart = useCartStore((state) => state.addItem);

  const [brand, setBrand] = useState<Brand | null>(null);
  const [lengths, setLengths] = useState<BrandLength[]>([]);
  const [directModels, setDirectModels] = useState<BrandModel[]>([]);
  const [directVariations, setDirectVariations] = useState<Variation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categorySlug, setCategorySlug] = useState("general");

  // Navigation state inside page
  const [selectedLength, setSelectedLength] = useState<BrandLength | null>(null);
  const [selectedModel, setSelectedModel] = useState<BrandModel | null>(null);

  // Matrix quantities state: { [variationId_color]: quantity }
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [cartSuccess, setCartSuccess] = useState(false);



  useEffect(() => {
    async function fetchBrandDetails() {
      try {
        setLoading(true);
        setError("");

        const sessionRes = await fetch("/api/auth/session", { cache: "no-store" });
        const sessionData = await sessionRes.json();
        if (!sessionData?.authenticated) {
          router.push(`/login?callbackUrl=/brand/${resolvedParams.id}`);
          return;
        }

        const res = await fetch(`/api/brand/${resolvedParams.id}`);
        if (!res.ok) throw new Error("Brand not found");
        const data = await res.json();
        setBrand(data.brand);
        setCategorySlug(data.categorySlug || "general");
        setLengths(data.lengths || []);
        setDirectModels(data.directModels || []);
        setDirectVariations(data.directVariations || []);

        // Dynamic workflow routing state initialization:
        if (data.lengths && data.lengths.length > 0) {
          // Normal flow: length selection first
          setSelectedLength(null);
          setSelectedModel(null);
        } else if (data.directModels && data.directModels.length > 0) {
          // Skip lengths: show models directly
          setSelectedLength(null);
          setSelectedModel(null);
        } else if (data.directVariations && data.directVariations.length > 0) {
          // Skip lengths and models: show matrix directly
          setSelectedLength(null);
          setSelectedModel(null);
        }
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load brand details");
        setLoading(false);
      }
    }
    fetchBrandDetails();
  }, [resolvedParams.id, router]);

  // Auto-select "Default" model to bypass model selection if it's configured under the selected length
  useEffect(() => {
    if (selectedLength) {
      const models = selectedLength.models || [];
      const defaultModel = models.find((m) => m.name === "Default");
      if (defaultModel) {
        setSelectedModel(defaultModel);
      } else {
        setSelectedModel(null);
      }
    } else {
      setSelectedModel(null);
    }
  }, [selectedLength]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D47A1]"></div>
      </div>
    );
  }

  if (error || !brand) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-red-100 text-center space-y-4 shadow-lg">
        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Brand Not Found</h2>
        <p className="text-sm text-gray-500">{error || "Could not load brand details."}</p>
        <Link href="/" className="inline-block bg-[#0D47A1] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider">
          Return Home
        </Link>
      </div>
    );
  }

  // Active items mapping
  const hasLengths = lengths.length > 0;
  const hasDirectModels = directModels.length > 0;
  const hasDirectVariations = directVariations.length > 0;

  // Active matrix variations resolution
  let activeVariations: Variation[] = [];
  let matrixTitle = "";

  if (selectedModel) {
    activeVariations = selectedModel.variations || [];
    matrixTitle = selectedModel.name === "Default"
      ? `${brand.name} ${selectedLength ? `(${formatLength(selectedLength.lengthInMeters)})` : ""}`
      : selectedModel.name;
  } else if (selectedLength && !selectedModel) {
    // Should not render matrix if model is not selected yet
    activeVariations = [];
  } else if (!selectedLength && !selectedModel && hasDirectVariations) {
    activeVariations = directVariations;
    matrixTitle = `${brand.name} Specifications`;
  }

  const getVariationColors = (v: Variation): string[] => {
    try {
      const parsed = typeof v.colors === "string" ? JSON.parse(v.colors) : v.colors || [];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      if (typeof v.colors === "string" && v.colors.trim()) {
        return v.colors.split(",").map((c: string) => c.trim()).filter(Boolean);
      }
    }
    return ["Standard"];
  };

  const displayColors = Array.from(
    new Set(activeVariations.flatMap((v) => getVariationColors(v)))
  );
  if (displayColors.length === 0) {
    displayColors.push("Standard");
  }

  // Matrix quantities actions
  const handleQuantityChange = (variationId: number, color: string, value: string) => {
    let num = Math.max(0, parseInt(value, 10) || 0);
    if (num > 50) {
      num = 50;
    }
    const key = `${variationId}_${color}`;
    setQuantities((prev) => ({
      ...prev,
      [key]: num,
    }));
  };

  const handleResetItems = () => {
    setQuantities({});
  };

  const calculateRowStats = (v: Variation) => {
    let rowQty = 0;
    displayColors.forEach((color) => {
      const key = `${v.id}_${color}`;
      rowQty += quantities[key] || 0;
    });
    const unitPrice = v.salePrice || v.price;
    const rowAmount = rowQty * unitPrice;
    return { rowQty, unitPrice, rowAmount };
  };

  const grandTotalAmount = activeVariations.reduce((acc, v) => {
    const { rowAmount } = calculateRowStats(v);
    return acc + rowAmount;
  }, 0);

  const grandTotalItems = activeVariations.reduce((acc, v) => {
    const { rowQty } = calculateRowStats(v);
    return acc + rowQty;
  }, 0);

  const handleAddToCart = () => {
    if (grandTotalItems === 0) return;

    let itemsAdded = 0;

    activeVariations.forEach((v) => {
      const unitPrice = v.salePrice || v.price;

      displayColors.forEach((color) => {
        const key = `${v.id}_${color}`;
        const qty = quantities[key] || 0;

        if (qty > 0) {
          const cartItemId = `brand_${brand.id}` +
            (selectedLength ? `_l${selectedLength.lengthInMeters}` : "") +
            (selectedModel ? `_m${selectedModel.id}` : "") +
            `_v${v.id}_${color}`;

          const cartItemName = `${brand.name}` +
            (selectedLength ? ` (${formatLength(selectedLength.lengthInMeters)})` : "") +
            (selectedModel && selectedModel.name !== "Default" ? ` ${selectedModel.name}` : "") +
            (v.thickness ? ` - ${v.thickness}` : "");

          addItemToCart({
            id: cartItemId,
            productId: v.id,
            name: cartItemName,
            price: unitPrice,
            image: brand.imageUrl || "/images/temp_logo.png",
            quantity: qty,
            size: v.thickness || "Default Spec",
            color: color === "Standard" ? "" : color,
            customizations: {
              brandName: brand.name,
              lengthInMeters: selectedLength ? selectedLength.lengthInMeters : null,
              modelName: selectedModel && selectedModel.name !== "Default" ? selectedModel.name : null,
              thickness: v.thickness || null,
              color: color === "Standard" ? null : color,
            },
            stock: v.stock || 100,
          });

          itemsAdded += qty;
        }
      });
    });

    if (itemsAdded > 0) {
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 3000);
    }
  };

  // Back navigation handlers
  const handleGoBack = () => {
    if (selectedModel) {
      if (selectedModel.name === "Default") {
        setSelectedModel(null);
        if (hasLengths) {
          setSelectedLength(null);
        } else {
          router.push(`/category/${categorySlug}`);
        }
      } else {
        setSelectedModel(null);
      }
    } else if (selectedLength) {
      if (hasLengths) {
        setSelectedLength(null);
      } else {
        router.push(`/category/${categorySlug}`);
      }
    } else {
      router.push(`/category/${categorySlug}`);
    }
  };

  // Render view templates
  const renderBreadcrumbs = () => {
    return (
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-xs border border-gray-200/60 mb-6">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#0D47A1] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-3">
          {brand.imageUrl && (
            <img src={brand.imageUrl} alt={brand.name} className="h-8 max-w-[100px] object-contain" />
          )}
          <div className="text-right sm:text-left">
            <h1 className="text-sm font-black text-[#0D47A1] tracking-tight">{brand.name}</h1>
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider justify-end sm:justify-start">
              <span>{brand.category}</span>
              {selectedLength && (
                <>
                  <ChevronRight size={10} className="stroke-[3]" />
                  <span className="text-[#FF9800]">{formatLength(selectedLength.lengthInMeters)}</span>
                </>
              )}
              {selectedModel && selectedModel.name !== "Default" && (
                <>
                  <ChevronRight size={10} className="stroke-[3]" />
                  <span className="text-[#FF9800]">{selectedModel.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // LAYOUT 1: SELECT LENGTH
  if (hasLengths && !selectedLength) {
    return (
      <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
        {renderBreadcrumbs()}

        <div className="space-y-4">
          <div className="text-center py-2">
            <h2 className="text-2xl font-playfair font-bold text-[#0D47A1]">Select Wire / Cable Length</h2>
            <p className="text-xs text-gray-500 mt-1">Choose an available coil length for {brand.name}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {lengths.map((length) => (
              <button
                key={length.id}
                onClick={() => setSelectedLength(length)}
                className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#FF9800]/50 transition-all duration-300 flex items-center justify-between text-left w-full"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0D47A1]/5 group-hover:bg-[#FF9800]/10 text-[#0D47A1] group-hover:text-[#FF9800] flex items-center justify-center transition-colors">
                    <Ruler size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#0D47A1] group-hover:text-[#FF9800] transition-colors">
                      {formatLength(length.lengthInMeters)}
                    </h3>
                    <p className="text-[10px] font-semibold text-gray-400">Available Length</p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#FF9800] text-gray-400 group-hover:text-white flex items-center justify-center transition-all duration-300">
                  <ChevronRight size={16} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // LAYOUT 2: SELECT MODEL (LENGTH -> MODEL OR DIRECT MODEL FLOW)
  const modelsToRender = selectedLength ? selectedLength.models : directModels;
  const isDirectModelFlow = !selectedLength && hasDirectModels;

  if ((selectedLength && !selectedModel) || (isDirectModelFlow && !selectedModel)) {
    return (
      <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
        {renderBreadcrumbs()}

        <div className="space-y-4">
          <div className="text-center py-2">
            <h2 className="text-2xl font-playfair font-bold text-[#0D47A1]">Select Material / Model</h2>
            <p className="text-xs text-gray-500 mt-1">
              Showing available types for <span className="font-bold text-[#0D47A1]">{brand.name}</span>
              {selectedLength && ` (${formatLength(selectedLength.lengthInMeters)})`}
            </p>
          </div>

          {modelsToRender.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-2xl border border-gray-200 text-gray-400 text-xs">
              No models/materials configured yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {modelsToRender.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model)}
                  className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#FF9800]/50 transition-all duration-300 flex items-center justify-between text-left w-full"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-[#0D47A1]/5 group-hover:bg-[#FF9800]/10 text-[#0D47A1] group-hover:text-[#FF9800] flex items-center justify-center shrink-0 transition-colors">
                      <Package size={24} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-black text-[#0D47A1] group-hover:text-[#FF9800] transition-colors truncate">
                        {model.name}
                      </h3>
                      <p className="text-[10px] font-semibold text-gray-400 truncate">
                        {model.description || "Specifications Ordering Grid"}
                      </p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#FF9800] text-gray-400 group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-300 ml-2">
                    <ChevronRight size={16} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // LAYOUT 3: DIRECT VARIATIONS GRID OR MODEL MATRIX GRID
  const matrixSubtext = selectedLength 
    ? `${brand.name} • ${formatLength(selectedLength.lengthInMeters)}` 
    : brand.name;

  return (
    <div className="min-h-screen bg-gray-50/50 py-6 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {renderBreadcrumbs()}

      {/* Dedicated Matrix Ordering Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden space-y-4">
        {/* Header Title */}
        <div className="bg-gray-100/80 px-6 py-3.5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-xs sm:text-sm font-black text-[#0D47A1] uppercase tracking-wide">
            Grid For <span className="text-[#FF9800]">{matrixTitle}</span>
          </h2>
          <span className="text-[10px] font-bold text-gray-400 uppercase">{matrixSubtext}</span>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-black text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4 border-r border-gray-200 w-36">Size / Gauge</th>
                <th className="py-3 px-3 border-r border-gray-200 text-center w-24">Price (₹)</th>
                {displayColors.map((color) => {
                  const style = getColorStyles(color);
                  return (
                    <th key={color} className="py-3 px-2 border-r border-gray-200 text-center min-w-[80px]">
                      <span 
                        style={{ backgroundColor: style.bg, color: style.text, borderColor: style.border }} 
                        className="inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-xs"
                      >
                        {color}
                      </span>
                    </th>
                  );
                })}
                <th className="py-3 px-3 border-r border-gray-200 text-center w-28">Coils / Qty</th>
                <th className="py-3 px-4 text-right w-32">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-bold">
              {activeVariations.length === 0 ? (
                <tr>
                  <td colSpan={displayColors.length + 4} className="py-8 text-center text-gray-400">
                    No specifications configured.
                  </td>
                </tr>
              ) : (
                activeVariations.map((v) => {
                  const { rowQty, unitPrice, rowAmount } = calculateRowStats(v);

                  return (
                    <tr key={v.id} className="hover:bg-blue-50/20 transition-colors">
                      {/* Size Column */}
                      <td className="py-3 px-4 font-black text-[#0D47A1] border-r border-gray-200 whitespace-nowrap">
                        {v.thickness || "Default Spec"}
                      </td>

                      {/* Price Column */}
                      <td className="py-3 px-3 text-center text-gray-700 border-r border-gray-200">
                        ₹{unitPrice.toLocaleString()}
                      </td>

                      {/* Color Input Cells */}
                      {displayColors.map((color) => {
                        const key = `${v.id}_${color}`;
                        const currentVal = quantities[key] ?? "";
                        const isSupported = getVariationColors(v).includes(color);

                        return (
                          <td key={color} className="py-2 px-1.5 border-r border-gray-200 text-center">
                            {isSupported ? (
                              <input
                                type="number"
                                min="0"
                                max="50"
                                placeholder="0"
                                value={currentVal}
                                onChange={(e) => handleQuantityChange(v.id, color, e.target.value)}
                                className={`w-full max-w-[65px] mx-auto text-center py-1.5 px-1 rounded-lg border text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#0D47A1] ${
                                  Number(currentVal) > 0
                                    ? "border-[#0D47A1] bg-[#0D47A1]/10 text-[#0D47A1] font-black shadow-xs"
                                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                }`}
                              />
                            ) : (
                              <span className="text-gray-300 font-normal">-</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Row Total Quantity Column */}
                      <td className="py-3 px-3 text-center border-r border-gray-200">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-black ${rowQty > 0 ? "bg-amber-100 text-[#FF9800]" : "text-gray-400"}`}>
                          {rowQty}
                        </span>
                      </td>

                      {/* Row Amount Column */}
                      <td className="py-3 px-4 text-right text-[#0D47A1] font-black">
                        ₹{rowAmount.toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Action Footer Bar */}
        <div className="bg-gray-100/90 p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Grand Total Display */}
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider block">Grand Total Amount</span>
              <span className="text-2xl font-black text-[#0D47A1] tracking-tight">₹{grandTotalAmount.toLocaleString()}</span>
            </div>
            {grandTotalItems > 0 && (
              <span className="bg-[#FF9800]/15 text-[#FF9800] border border-[#FF9800]/30 px-3 py-1 rounded-full text-xs font-bold">
                {grandTotalItems} Coils Selected
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleResetItems}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-200 text-xs font-bold transition-all cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Reset Items</span>
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={grandTotalItems === 0}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer ${
                grandTotalItems > 0
                  ? "bg-[#0D47A1] hover:bg-[#0A3880] text-white hover:scale-102"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <ShoppingCart size={15} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {cartSuccess && (
          <div className="bg-emerald-500 text-white p-3 text-center text-xs font-bold flex items-center justify-center gap-2 animate-fade-in">
            <Check size={16} />
            <span>Items added to your cart successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
}
