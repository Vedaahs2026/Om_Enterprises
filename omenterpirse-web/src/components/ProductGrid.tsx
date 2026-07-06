"use client";

import { motion } from "framer-motion";
import ProductCard from './ProductCard';

interface Product {
  id: number;
  name: string;
  description: string;
  salePrice: number;
  basePrice: number;
  images: string; // JSON string
  category?: string;
  isCustomizable?: boolean | number | null;
}

interface ProductGridProps {
  initialProducts: any[];
  title?: string;
  showTitle?: boolean;
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const taglinesByTitle: Record<string, string> = {
  "Featured Collections": "Handpicked premium industrial gear and everyday electrical essentials.",
  "Premium Wiring Solutions": "High-safety Flame Retardant (FR) multi-strand copper wires for residential use.",
  "Armoured & Control Cables": "Heavy-duty, ISI-certified underground power cables for reliable transmission.",
  "Modular Switches & Plates": "Elegant, reliable switches designed to withstand millions of clicks.",
  "Distribution Boards & Protection MCBs": "Precision switchgears and panels preventing overloads and short circuits.",
  "Energy Efficient LED Lighting": "Innovative, flicker-free LED luminaires for commercial and home spaces.",
  "Premium Ceiling & Exhaust Fans": "High-speed air delivery fans with low power consumption.",
  "Rigid PVC & Metallic Conduits": "Non-flammable casing pipes protecting structural electrical lines.",
  "Cable Ties, Lugs & Glands": "Industrial-grade accessories for clean and secure cable termination.",
  "Industrial switchgears & Panels": "Factory-certified custom panel assemblies and heavy motor starters.",
  "Emergency Lights, Bells & Strips": "Safe, durable household chimes, power strips, and backup solutions.",
};

export default function ProductGrid({ initialProducts, title = "Featured Collections", showTitle = true, tagline }: ProductGridProps) {
  const displayTagline = tagline || taglinesByTitle[title] || "Powering your projects with certified, reliable electrical solutions.";

  return (
    <section className="py-0">
      {showTitle && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center text-center mb-12 border-b border-brand/10 pb-6"
        >
          <div>
            <h2 className="text-4xl font-playfair font-bold mb-3 text-brand">{title}</h2>
            <p className="text-brand/60 italic">{displayTagline}</p>
          </div>
        </motion.div>
      )}


      {initialProducts.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-brand/10 rounded-3xl">
          <p className="text-brand/30 font-bold uppercase tracking-widest text-xs">New arrivals coming soon</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {initialProducts.map((product) => {
            const firstImage = (() => {
              const images = JSON.parse(product.images || "[]");
              if (images.length > 0) return images[0];
              if (product.colorImages) {
                try {
                  const colorImagesMap = typeof product.colorImages === "string" 
                    ? JSON.parse(product.colorImages) 
                    : product.colorImages;
                  if (colorImagesMap) {
                    for (const imgList of Object.values(colorImagesMap)) {
                      if (Array.isArray(imgList) && imgList.length > 0) {
                        return imgList[0];
                      }
                    }
                  }
                } catch {}
              }
              return "/images/placeholder.png";
            })();

            return (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard
                  product={{
                    id: product.id.toString(),
                    name: product.name,
                    description: product.description || "",
                    price: product.salePrice || product.basePrice,
                    mrp: product.basePrice,
                    imageUrl: firstImage,
                    categorySlug: product.category || "all",
                  }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </section>
  );
}
