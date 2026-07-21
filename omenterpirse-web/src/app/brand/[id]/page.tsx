"use client";

import React, { useState, useEffect, use } from "react";
import { ArrowLeft, Ruler, ChevronRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type BrandLength = {
  id: number;
  brandId: number;
  lengthInMeters: number;
  isActive: boolean;
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

export default function SelectLengthPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [brand, setBrand] = useState<Brand | null>(null);
  const [lengths, setLengths] = useState<BrandLength[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBrand() {
      try {
        setLoading(true);

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
        setLengths(data.lengths || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load lengths");
      } finally {
        setLoading(false);
      }
    }
    fetchBrand();
  }, [resolvedParams.id, router]);

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

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-xs border border-gray-200/60">
        <button
          onClick={() => router.back()}
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
            <h1 className="text-lg font-black text-[#0D47A1] tracking-tight">{brand.name}</h1>
            <span className="text-[10px] font-bold text-[#FF9800] uppercase tracking-wider">{brand.category}</span>
          </div>
        </div>
      </div>

      {/* Length Selection Section */}
      <div className="space-y-4">
        <div className="text-center py-2">
          <h2 className="text-2xl font-playfair font-bold text-[#0D47A1]">Select Wire / Cable Length</h2>
          <p className="text-xs text-gray-500 mt-1">Choose an available coil length for {brand.name}</p>
        </div>

        {lengths.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-2xl border border-gray-200 text-gray-400 text-xs">
            No lengths configured for {brand.name} yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {lengths.map((length) => (
              <Link
                key={length.id}
                href={`/brand/${brand.id}/length/${length.id}`}
                className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#FF9800]/50 transition-all duration-300 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0D47A1]/5 group-hover:bg-[#FF9800]/10 text-[#0D47A1] group-hover:text-[#FF9800] flex items-center justify-center transition-colors">
                    <Ruler size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#0D47A1] group-hover:text-[#FF9800] transition-colors">
                      {length.lengthInMeters} MTR
                    </h3>
                    <p className="text-[10px] font-semibold text-gray-400">Available Length</p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#FF9800] text-gray-400 group-hover:text-white flex items-center justify-center transition-all duration-300">
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
