export const dynamic = "force-dynamic";

import { db } from "@/db";
import { categories, brands } from "@/db/schema";
import { eq, asc, sql, and, or } from "drizzle-orm";
import BrandGrid from "@/components/BrandGrid";
import { AlertCircle, PhoneCall } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).replace(/-/g, " ");
  
  // Find the category in categories table if present
  const categoryResult = await db.select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  const categoryItem = categoryResult[0];

  const categoryName = categoryItem 
    ? categoryItem.name 
    : decodedSlug.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Fetch Brands belonging to this category
  const categoryBrands = await db.select()
    .from(brands)
    .where(
      and(
        eq(brands.isActive, true),
        or(
          sql`LOWER(${brands.category}) = ${slug.toLowerCase()}`,
          sql`LOWER(${brands.category}) = ${decodedSlug.toLowerCase()}`,
          categoryItem ? sql`LOWER(${brands.category}) = ${categoryItem.name.toLowerCase()}` : sql`1 = 0`
        )
      )
    )
    .orderBy(asc(brands.displayOrder));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
      {/* Compact Header */}
      <div className="mb-4 text-center">
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-brand tracking-tight">{categoryName}</h1>
        <div className="w-16 h-0.5 bg-[#FF9800] mx-auto rounded-full mt-2"></div>
      </div>
      
      {/* Display Brands OR Compact "Service not provided" fallback */}
      {categoryBrands.length > 0 ? (
        <BrandGrid brands={categoryBrands} categoryTitle={categoryName} />
      ) : (
        <section className="py-6 px-6 text-center bg-white rounded-3xl border border-brand/10 shadow-sm max-w-md mx-auto my-4">
          <div className="w-12 h-12 bg-amber-50 text-[#FF9800] rounded-full flex items-center justify-center mx-auto mb-3 shadow-xs">
            <AlertCircle size={24} />
          </div>

          <p className="text-brand/70 max-w-md mx-auto text-sm md:text-base leading-relaxed mb-4">
            For <span className="font-bold text-[#0D47A1]">{categoryName}</span> service please call/whatsapp:
          </p>
          <div className="flex flex-col space-y-2 mb-6">
            {[
              "9849845555",
              "9246999660",
              "9849033511"
            ].map((num) => (
              <div key={num} className="flex items-center justify-between gap-4 py-3 px-5 bg-gray-50 rounded-xl border border-gray-100 max-w-xs mx-auto w-full hover:border-[#FF9800]/30 transition-all">
                <a href={`tel:${num}`} className="font-black text-brand hover:text-[#FF9800] transition-colors text-sm md:text-base">
                  {num}
                </a>
                <span className="text-gray-300">|</span>
                <div className="flex gap-4">
                  <a 
                    href={`tel:${num}`} 
                    className="text-[#FF9800] hover:scale-115 transition-transform" 
                    title="Call"
                  >
                    <PhoneCall size={16} />
                  </a>
                  <a 
                    href={`https://wa.me/91${num}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-emerald-600 hover:scale-115 transition-transform" 
                    title="WhatsApp"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.449 5.4 0 9.794-4.392 9.797-9.793.002-2.618-1.01-5.08-2.856-6.928C16.368 2.036 13.906 1.02 11.288 1.02c-5.4 0-9.793 4.393-9.797 9.794-.001 1.732.482 3.42 1.398 4.908L1.879 21.084l5.768-1.506zM17.65 19.24c-.115-.193-.419-.307-.874-.535-.456-.229-2.695-1.33-3.113-1.482-.418-.152-.722-.229-.988.172-.266.402-1.027 1.277-1.255 1.543-.228.266-.456.3-.912.071-.456-.228-1.926-.71-3.668-2.264-1.355-1.209-2.27-2.703-2.536-3.159-.266-.456-.028-.703.2-.93.205-.205.456-.534.684-.8.228-.266.304-.456.456-.76.152-.304.076-.57-.038-.8-.115-.229-.988-2.38-1.354-3.268-.357-.86-.721-.744-.988-.758-.256-.013-.55-.015-.844-.015-.294 0-.772.11-1.176.551-.404.441-1.543 1.51-1.543 3.68 0 2.17 1.58 4.267 1.8 4.568.22.301 3.109 4.747 7.531 6.66 1.052.455 1.873.727 2.514.931 1.057.336 2.019.289 2.78.175.847-.127 2.695-1.103 3.075-2.116.379-1.013.379-1.879.266-2.071z"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
