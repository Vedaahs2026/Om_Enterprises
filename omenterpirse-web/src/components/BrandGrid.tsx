"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Award, ExternalLink, Sparkles } from "lucide-react";

import { useRouter } from "next/navigation";

type Brand = {
  id: number;
  name: string;
  imageUrl?: string | null;
  category: string;
};

interface BrandGridProps {
  brands: Brand[];
  categoryTitle?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function BrandGrid({ brands, categoryTitle }: BrandGridProps) {
  const router = useRouter();

  if (!brands || brands.length === 0) return null;

  const handleBrandClick = async (e: React.MouseEvent, brandId: number) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      const data = await res.json();
      if (data?.authenticated) {
        router.push(`/brand/${brandId}`);
      } else {
        router.push(`/login?callbackUrl=/brand/${brandId}`);
      }
    } catch (err) {
      router.push(`/login?callbackUrl=/brand/${brandId}`);
    }
  };

  return (
    <section className="py-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap items-center justify-center gap-8 md:gap-10"
      >
        {brands.map((brand) => (
          <motion.div
            key={brand.id}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="w-full sm:w-[240px] md:w-[260px] lg:w-[280px]"
          >
            <a
              href={`/brand/${brand.id}`}
              onClick={(e) => handleBrandClick(e, brand.id)}
              className="block group h-full cursor-pointer"
            >
              <div className="relative h-48 bg-white rounded-2xl border border-gray-100 p-4 flex flex-col items-center justify-between shadow-md hover:shadow-xl hover:border-[#FF9800]/30 transition-all duration-300 overflow-hidden">
                {/* Top Badge */}
                <div className="w-full flex items-center justify-between text-[9px] font-black uppercase tracking-wider text-[#0D47A1]/40 border-b border-gray-100 pb-2">
                  <span className="flex items-center gap-1">
                    <Sparkles size={10} className="text-[#FF9800]" />
                    Authorized
                  </span>
                  <span className="bg-[#0D47A1]/5 text-[#0D47A1] px-2 py-0.5 rounded-full font-bold">
                    {brand.category}
                  </span>
                </div>

                {/* Center Image / Logo Area */}
                <div className="relative w-full flex-1 flex items-center justify-center py-2 my-1 group-hover:scale-105 transition-transform duration-300">
                  {brand.imageUrl ? (
                    <img
                      src={brand.imageUrl}
                      alt={brand.name}
                      className="max-h-20 max-w-[80%] object-contain drop-shadow-sm"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-[#0D47A1]/5 flex items-center justify-center text-[#0D47A1]">
                      <Award size={24} />
                    </div>
                  )}
                </div>

                {/* Bottom Banner */}
                <div className="w-full pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-[#0D47A1] tracking-wide group-hover:text-[#FF9800] transition-colors">
                      {brand.name}
                    </h3>
                    <p className="text-[9px] font-semibold text-gray-400">View Products</p>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#0D47A1] text-white flex items-center justify-center group-hover:bg-[#FF9800] transition-all duration-300 shadow-sm group-hover:rotate-45">
                    <ExternalLink size={12} />
                  </div>
                </div>

                {/* Decorative background glow on hover */}
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#FF9800]/10 rounded-full blur-xl group-hover:bg-[#FF9800]/20 transition-all duration-300 pointer-events-none" />
              </div>
            </a>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
