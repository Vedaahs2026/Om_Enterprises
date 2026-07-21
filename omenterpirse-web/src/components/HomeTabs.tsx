"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type TabItem = {
  id: number;
  title: string;
  linkHref: string;
  imageUrl: string;
  isActive: boolean;
};

interface Props {
  tabs: TabItem[];
}

export default function HomeTabs({ tabs }: Props) {
  if (!tabs || tabs.length === 0) return null;

  const isFew = tabs.length <= 2;

  return (
    <section className="py-2 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {tabs.map((tab, index) => (
            <Link 
              key={tab.id}
              href={tab.linkHref || "#"}
              className={`block w-full ${isFew ? "sm:w-[380px] md:w-[440px]" : "sm:w-[280px] md:w-[320px]"}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex flex-col overflow-hidden rounded-3xl border border-gray-100 shadow-lg bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer ${
                  isFew ? "h-[420px]" : "h-[340px]"
                }`}
              >
                {/* Top Image Section (Cover) */}
                <div className="relative w-full flex-1 overflow-hidden bg-gray-50">
                  {tab.imageUrl ? (
                    <img
                      src={tab.imageUrl}
                      alt={tab.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-brand/5 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                </div>

                {/* Bottom Banner Section */}
                <div className={`bg-[#0D47A1] flex items-center justify-center shrink-0 ${isFew ? "h-[90px] px-6" : "h-[75px] px-4"}`}>
                  <h3 className={`font-black text-white tracking-wider uppercase text-center transform transition-transform duration-500 group-hover:scale-105 ${
                    isFew ? "text-base md:text-xl" : "text-sm md:text-base font-bold"
                  }`}>
                    {tab.title}
                  </h3>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
