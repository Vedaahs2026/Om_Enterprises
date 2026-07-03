"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
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

  return (
    <section className="py-0 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {tabs.map((tab, index) => (
            <Link 
              key={tab.id}
              href={tab.linkHref || "#"}
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col h-[400px] overflow-hidden rounded-2xl border border-gray-100 shadow-md bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer"
              >
                {/* Top Image Section (Cover) */}
                <div className="relative w-full h-[320px] overflow-hidden bg-gray-50">
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
                <div className="bg-[#0D47A1] py-4 px-4 flex items-center justify-center h-[80px]">
                  <h3 className="text-sm md:text-base font-bold text-white tracking-wider uppercase text-center transform transition-transform duration-500 group-hover:scale-102">
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
