"use client";

import React, { useState, useEffect, use } from "react";
import { ArrowLeft, Package, ChevronRight, AlertCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type BrandModel = {
  id: number;
  brandLengthId: number;
  name: string;
  description?: string | null;
  isActive: boolean;
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
  params: Promise<{ id: string; lengthId: string }>;
}

export default function SelectModelPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [brand, setBrand] = useState<Brand | null>(null);
  const [lengthObj, setLengthObj] = useState<BrandLength | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const sessionRes = await fetch("/api/auth/session", { cache: "no-store" });
        const sessionData = await sessionRes.json();
        if (!sessionData?.authenticated) {
          router.push(`/login?callbackUrl=/brand/${resolvedParams.id}/length/${resolvedParams.lengthId}`);
          return;
        }

        const res = await fetch(`/api/brand/${resolvedParams.id}`);
        if (!res.ok) throw new Error("Brand data not found");
        const data = await res.json();
        setBrand(data.brand);

        const foundLength = (data.lengths || []).find(
          (l: BrandLength) => l.id === Number(resolvedParams.lengthId)
        );

        if (!foundLength) throw new Error("Length option not found");
        setLengthObj(foundLength);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load models");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [resolvedParams.id, resolvedParams.lengthId, router]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D47A1]"></div>
      </div>
    );
  }

  if (error || !brand || !lengthObj) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-red-100 text-center space-y-4 shadow-lg">
        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Model Data Not Found</h2>
        <p className="text-sm text-gray-500">{error || "Could not load model options."}</p>
        <Link href={`/brand/${resolvedParams.id}`} className="inline-block bg-[#0D47A1] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider">
          Back to Lengths
        </Link>
      </div>
    );
  }

  const models = lengthObj.models || [];

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-xs border border-gray-200/60">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#0D47A1] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Lengths</span>
        </button>

        <div className="flex items-center gap-3">
          {brand.imageUrl && (
            <img src={brand.imageUrl} alt={brand.name} className="h-8 max-w-[100px] object-contain" />
          )}
          <div className="text-right sm:text-left">
            <h1 className="text-lg font-black text-[#0D47A1] tracking-tight">{brand.name}</h1>
            <span className="text-[10px] font-bold text-[#FF9800] uppercase tracking-wider">
              {lengthObj.lengthInMeters} MTR COILS
            </span>
          </div>
        </div>
      </div>

      {/* Model Selection Section */}
      <div className="space-y-4">
        <div className="text-center py-2">
          <h2 className="text-2xl font-playfair font-bold text-[#0D47A1]">Select Material / Model</h2>
          <p className="text-xs text-gray-500 mt-1">
            Showing available types for <span className="font-bold text-[#0D47A1]">{brand.name}</span> ({lengthObj.lengthInMeters} MTR)
          </p>
        </div>

        {models.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-2xl border border-gray-200 text-gray-400 text-xs">
            No models/materials configured for {lengthObj.lengthInMeters}m yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {models.map((model) => (
              <Link
                key={model.id}
                href={`/brand/${brand.id}/length/${lengthObj.id}/model/${model.id}`}
                className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#FF9800]/50 transition-all duration-300 flex items-center justify-between"
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
                      {model.description || `${lengthObj.lengthInMeters} MTR Specification`}
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#FF9800] text-gray-400 group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-300 ml-2">
                  <ChevronRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
