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
          <h2 className="text-lg font-playfair font-bold text-brand mb-1.5">
            Service Not Provided for These Items
          </h2>
          <p className="text-brand/60 max-w-xs mx-auto text-xs leading-relaxed mb-5">
            We currently do not offer brand services for <span className="font-bold text-brand">{categoryName}</span>. Contact our admin team for inquiries.
          </p>
          <Link
            href="/about#contact"
            className="inline-flex items-center gap-2 bg-[#FF9800] hover:bg-[#F57C00] text-white font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <PhoneCall size={14} />
            <span>Contact Admin</span>
          </Link>
        </section>
      )}
    </div>
  );
}
