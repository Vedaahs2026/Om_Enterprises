"use client";

import React, { useState, useEffect, use } from "react";
import { 
  ArrowLeft, 
  ShoppingCart, 
  RotateCcw, 
  Check, 
  AlertCircle,
  Package,
  Ruler
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";

function getColorStyles(colorName: string) {
  const name = (colorName || "").toLowerCase().trim();
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    red: { bg: "#EF4444", text: "#FFFFFF", border: "#DC2626" },
    yellow: { bg: "#FBBF24", text: "#000000", border: "#D97706" },
    blue: { bg: "#2563EB", text: "#FFFFFF", border: "#1D4ED8" },
    green: { bg: "#10B981", text: "#FFFFFF", border: "#059669" },
    black: { bg: "#1F2937", text: "#FFFFFF", border: "#111827" },
    white: { bg: "#FFFFFF", text: "#1F2937", border: "#E5E7EB" },
    grey: { bg: "#9CA3AF", text: "#FFFFFF", border: "#7B808A" },
    gray: { bg: "#9CA3AF", text: "#FFFFFF", border: "#7B808A" },
    orange: { bg: "#F97316", text: "#FFFFFF", border: "#EA580C" },
    pink: { bg: "#EC4899", text: "#FFFFFF", border: "#DB2777" },
    purple: { bg: "#8B5CF6", text: "#FFFFFF", border: "#7C3AED" },
    brown: { bg: "#78350F", text: "#FFFFFF", border: "#451A03" },
  };
  return colorMap[name] || { bg: "#E5E7EB", text: "#374151", border: "#D1D5DB" };
}

type Variation = {
  id: number;
  modelId: number;
  thickness: string;
  colors: string; // JSON string or comma-separated
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
};

interface PageProps {
  params: Promise<{ id: string; lengthId: string; modelId: string }>;
}

export default function DedicatedMatrixOrderPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const addItemToCart = useCartStore((state) => state.addItem);

  const [brand, setBrand] = useState<Brand | null>(null);
  const [lengthObj, setLengthObj] = useState<BrandLength | null>(null);
  const [modelObj, setModelObj] = useState<BrandModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartSuccess, setCartSuccess] = useState(false);

  // Matrix quantities state: { [variationId_color]: quantity }
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const sessionRes = await fetch("/api/auth/session", { cache: "no-store" });
        const sessionData = await sessionRes.json();
        if (!sessionData?.authenticated) {
          router.push(`/login?callbackUrl=/brand/${resolvedParams.id}/length/${resolvedParams.lengthId}/model/${resolvedParams.modelId}`);
          return;
        }

        const res = await fetch(`/api/brand/${resolvedParams.id}`);
        if (!res.ok) throw new Error("Brand catalog not found");
        const data = await res.json();
        setBrand(data.brand);

        const foundLength = (data.lengths || []).find(
          (l: BrandLength) => l.id === Number(resolvedParams.lengthId)
        );

        if (!foundLength) throw new Error("Length option not found");
        setLengthObj(foundLength);

        const foundModel = (foundLength.models || []).find(
          (m: BrandModel) => m.id === Number(resolvedParams.modelId)
        );

        if (!foundModel) throw new Error("Model option not found");
        setModelObj(foundModel);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load order matrix");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [resolvedParams.id, resolvedParams.lengthId, resolvedParams.modelId, router]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D47A1]"></div>
      </div>
    );
  }

  if (error || !brand || !lengthObj || !modelObj) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-red-100 text-center space-y-4 shadow-lg">
        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Order Grid Not Found</h2>
        <p className="text-sm text-gray-500">{error || "Could not load matrix grid."}</p>
        <Link href={`/brand/${resolvedParams.id}`} className="inline-block bg-[#0D47A1] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider">
          Back to Brand
        </Link>
      </div>
    );
  }

  const variations = modelObj.variations || [];

  // Extract all unique colors across variations for the selected model
  const allColors = Array.from(
    new Set(
      variations.flatMap((v) => {
        try {
          return typeof v.colors === "string" ? JSON.parse(v.colors) : v.colors || [];
        } catch (e) {
          return v.colors ? v.colors.split(",").map((c) => c.trim()) : [];
        }
      })
    )
  );

  const displayColors = allColors.length > 0 ? allColors : ["BLACK", "BLUE", "GREEN", "RED", "YELLOW", "WHITE"];

  // Quantity Change Handler
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

  // Reset all quantities
  const handleResetItems = () => {
    setQuantities({});
  };

  // Calculate Row Stats
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

  const grandTotalAmount = variations.reduce((acc, v) => {
    const { rowAmount } = calculateRowStats(v);
    return acc + rowAmount;
  }, 0);

  const grandTotalItems = variations.reduce((acc, v) => {
    const { rowQty } = calculateRowStats(v);
    return acc + rowQty;
  }, 0);

  // Add to Cart Action
  const handleAddToCart = () => {
    if (grandTotalItems === 0) return;

    let itemsAdded = 0;

    variations.forEach((v) => {
      const unitPrice = v.salePrice || v.price;

      displayColors.forEach((color) => {
        const key = `${v.id}_${color}`;
        const qty = quantities[key] || 0;

        if (qty > 0) {
          const cartItemId = `brand_${brand.id}_l${lengthObj.lengthInMeters}_m${modelObj.id}_v${v.id}_${color}`;

          addItemToCart({
            id: cartItemId,
            productId: v.id,
            name: `${brand.name} ${modelObj.name} (${lengthObj.lengthInMeters}m)`,
            price: unitPrice,
            image: brand.imageUrl || "/images/temp_logo.png",
            quantity: qty,
            size: v.thickness,
            color: color,
            customizations: {
              brandName: brand.name,
              lengthInMeters: lengthObj.lengthInMeters,
              modelName: modelObj.name,
              thickness: v.thickness,
              color: color,
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

  return (
    <div className="min-h-screen bg-gray-50/50 py-6 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-xs border border-gray-200/60">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#0D47A1] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Models</span>
        </button>

        <div className="flex items-center gap-3 text-right">
          {brand.imageUrl && (
            <img src={brand.imageUrl} alt={brand.name} className="h-8 max-w-[100px] object-contain" />
          )}
          <div>
            <h1 className="text-lg font-black text-[#0D47A1] tracking-tight">{brand.name}</h1>
            <span className="text-[10px] font-bold text-[#FF9800] uppercase tracking-wider block">
              {modelObj.name} • {lengthObj.lengthInMeters} MTR
            </span>
          </div>
        </div>
      </div>

      {/* Dedicated Matrix Ordering Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden space-y-4">
        {/* Header Title */}
        <div className="bg-gray-100/80 px-6 py-3.5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-xs sm:text-sm font-black text-[#0D47A1] uppercase tracking-wide">
            Grid For <span className="text-[#FF9800]">{modelObj.name}</span> - {lengthObj.lengthInMeters} MTR
          </h2>
          <span className="text-[10px] font-bold text-gray-400 uppercase">Enter Quantities per Color</span>
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
            <tbody className="divide-y divide-gray-100 text-xs">
              {variations.length === 0 ? (
                <tr>
                  <td colSpan={displayColors.length + 4} className="py-8 text-center text-gray-400">
                    No size specifications configured for this model.
                  </td>
                </tr>
              ) : (
                variations.map((v) => {
                  const { rowQty, unitPrice, rowAmount } = calculateRowStats(v);

                  return (
                    <tr key={v.id} className="hover:bg-blue-50/20 transition-colors">
                      {/* Size Column */}
                      <td className="py-3 px-4 font-bold text-[#0D47A1] border-r border-gray-200 whitespace-nowrap">
                        {v.thickness}
                      </td>

                      {/* Price Column */}
                      <td className="py-3 px-3 text-center font-bold text-gray-700 border-r border-gray-200">
                        ₹{unitPrice.toLocaleString()}
                      </td>

                      {/* Color Input Cells */}
                      {displayColors.map((color) => {
                        const key = `${v.id}_${color}`;
                        const currentVal = quantities[key] ?? "";

                        return (
                          <td key={color} className="py-2 px-1.5 border-r border-gray-200 text-center">
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
                          </td>
                        );
                      })}

                      {/* Row Total Quantity Column */}
                      <td className="py-3 px-3 text-center font-bold border-r border-gray-200">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-black ${rowQty > 0 ? "bg-amber-100 text-[#FF9800]" : "text-gray-400"}`}>
                          {rowQty}
                        </span>
                      </td>

                      {/* Row Amount Column */}
                      <td className="py-3 px-4 text-right font-black text-[#0D47A1]">
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
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-200 text-xs font-bold transition-all"
            >
              <RotateCcw size={14} />
              <span>Reset Items</span>
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={grandTotalItems === 0}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md ${
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
