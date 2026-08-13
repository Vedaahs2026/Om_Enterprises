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
            For <span className="font-bold text-[#0D47A1]">Quotations and Enquiries</span> Please Call or WhatsApp:
          </p>
          <div className="flex flex-col space-y-2 mb-6">
            {[
              "9849845555",
              "9246999660",
              "9849033511"
            ].map((num) => (
              <div key={num} className="flex items-center justify-between gap-3 py-3 px-4 bg-gray-50 rounded-xl border border-gray-100 max-w-[290px] sm:max-w-[320px] mx-auto w-full hover:border-[#FF9800]/30 transition-all">
                <a href={`tel:${num}`} className="font-black text-brand hover:text-[#FF9800] transition-colors text-sm md:text-base flex-shrink-0">
                  {num}
                </a>
                <span className="text-gray-300 flex-shrink-0">|</span>
                <div className="flex items-center gap-3 flex-shrink-0 justify-end">
                  <a 
                    href={`tel:${num}`} 
                    className="text-[#FF9800] hover:scale-115 transition-transform flex-shrink-0 flex items-center justify-center" 
                    title="Call"
                  >
                    <PhoneCall size={16} className="flex-shrink-0" />
                  </a>
                  <a 
                    href={`https://wa.me/91${num}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#25D366] hover:text-[#128C7E] hover:scale-115 transition-all flex-shrink-0 flex items-center justify-center" 
                    title="WhatsApp"
                  >
                    <svg className="w-[18px] h-[18px] fill-current flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.982L2 22l5.202-1.362a9.927 9.927 0 0 0 4.808 1.238h.005c5.502 0 9.99-4.479 9.99-9.986.002-2.67-1.037-5.18-2.93-7.071A9.902 9.902 0 0 0 12.012 2zm5.82 14.156c-.32.9-1.85 1.748-2.527 1.86-.59.1-1.36.14-3.69-.83-2.98-1.24-4.9-4.28-5.05-4.48-.15-.2-1.22-1.62-1.22-3.1 0-1.47.77-2.19 1.05-2.48.28-.29.61-.36.81-.36.2 0 .4 0 .58.01.19.01.44-.07.69.53.25.6 1.05 2.56 1.14 2.75.1.19.16.41.03.66-.13.25-.26.4-.38.56-.13.16-.27.34-.38.5-.13.15-.27.31-.11.59.16.27.7 1.16 1.5 1.87.8.71 1.48.93 1.78 1.07.3.14.47.12.65-.08.18-.2.78-.9 1-1.2.2-.3.4-.26.68-.16.27.1 1.74.82 2.04.97.3.15.5.22.58.35.07.13.07.76-.25 1.66z" />
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
