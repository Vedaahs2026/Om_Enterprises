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
                    className="text-emerald-600 hover:scale-115 transition-transform flex-shrink-0 flex items-center justify-center" 
                    title="WhatsApp"
                  >
                    <svg className="w-[18px] h-[18px] fill-current flex-shrink-0" viewBox="0 0 24 24">
                      <path d="M12.042 2C6.556 2 2.084 6.446 2.084 11.911c0 1.739.459 3.447 1.331 4.954L2.184 21.331l4.577-1.199c1.442.788 3.079 1.207 4.746 1.207h.005c5.486 0 9.957-4.446 9.957-9.911C21.469 6.446 16.997 2 11.512 2h.53zM16.974 14.887c-.198.55-1.144.97-1.338 1.026-.194.056-.473.08-1.464-.326-1.047-.428-2.327-1.229-3.385-2.222-1.332-1.25-2.221-2.793-2.482-3.238-.261-.444-.029-.684.195-.903.204-.202.453-.527.679-.757.226-.23.302-.394.453-.655.151-.261.076-.491-.038-.684-.113-.193-.999-2.411-1.226-3.298-.216-.838-.456-.723-.627-.736-.162-.012-.347-.015-.532-.015-.185 0-.486.07-.74.357-.254.286-.968.946-.968 2.308 0 1.362 1.012 2.677 1.153 2.864.141.188 1.956 3.012 4.757 4.225.663.287 1.182.459 1.587.588.667.212 1.274.182 1.756.111.536-.08 1.739-.711 1.982-1.398.243-.687.243-1.274.17-1.398-.074-.124-.271-.198-.569-.347z"/>
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
