export const dynamic = "force-dynamic";

import { db } from "@/db";
import { navigationMenu, pageSections, products, categories } from "@/db/schema";
import { eq, inArray, asc, sql } from "drizzle-orm";
import ProductGrid from "@/components/ProductGrid";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).replace(/-/g, " ");
  
  // Try to find the category in the new categories table first
  const categoryResult = await db.select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  const categoryItem = categoryResult[0];

  // 1. Try to find the menu item by href (to retrieve custom page sections design if any)
  const href = `/category/${slug}`;
  const menuResult = await db.select()
    .from(navigationMenu)
    .where(eq(navigationMenu.href, href))
    .limit(1);

  const menuItem = menuResult[0];
  let sectionsWithProducts: any[] = [];
  let categoryName = categoryItem 
    ? categoryItem.name 
    : decodedSlug.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  if (menuItem) {
    // 2. Fetch sections for this menu item
    const sections = await db.select()
      .from(pageSections)
      .where(eq(pageSections.menuId, menuItem.id))
      .orderBy(asc(pageSections.displayOrder));

    // Hydrate products for each section
    sectionsWithProducts = await Promise.all(
      sections.map(async (section) => {
        const productIds = section.productIds
          .split(",")
          .map(id => parseInt(id.trim()))
          .filter(id => !isNaN(id));

        let hydratedProducts: any[] = [];
        if (productIds.length > 0) {
          hydratedProducts = await db.select()
            .from(products)
            .where(inArray(products.id, productIds));
        }

        return {
          ...section,
          products: hydratedProducts
        };
      })
    );
  }

  // 3. Fallback: If no menu item OR no sections, try to find sections by title matching the slug
  if (sectionsWithProducts.length === 0 || sectionsWithProducts.every(s => s.products.length === 0)) {
    const standaloneSections = await db.select()
      .from(pageSections)
      .where(sql`LOWER(${pageSections.title}) = ${decodedSlug.toLowerCase()}`)
      .orderBy(asc(pageSections.displayOrder));

    if (standaloneSections.length > 0) {
      const hydratedStandalone = await Promise.all(
        standaloneSections.map(async (section) => {
          const productIds = section.productIds
            .split(",")
            .map(id => parseInt(id.trim()))
            .filter(id => !isNaN(id));

          let hydratedProducts: any[] = [];
          if (productIds.length > 0) {
            hydratedProducts = await db.select()
              .from(products)
              .where(inArray(products.id, productIds));
          }

          return {
            ...section,
            products: hydratedProducts
          };
        })
      );
      sectionsWithProducts = hydratedStandalone;
    }
  }

  // Filter out empty sections to prevent empty headings / New arrivals coming soon blocks
  sectionsWithProducts = sectionsWithProducts.filter(s => s.products && s.products.length > 0);

  // Retrieve all products belonging to this category from the database
  let allCategoryProducts = await db.select()
    .from(products)
    .where(
      sql`LOWER(${products.category}) = ${slug.toLowerCase()} 
          OR LOWER(${products.category}) = ${decodedSlug.toLowerCase()}
          OR (${categoryItem ? sql`LOWER(${products.category}) = ${categoryItem.name.toLowerCase()}` : sql`1 = 0`})`
    );

  // If no direct category match, check if the slug is a brand or has special match conditions (like anchor or polycab)
  if (allCategoryProducts.length === 0) {
    const lowerSlug = decodedSlug.toLowerCase();
    if (lowerSlug.includes("anchor")) {
      allCategoryProducts = await db.select()
        .from(products)
        .where(sql`LOWER(${products.tags}) LIKE '%anchor%' OR LOWER(${products.name}) LIKE '%anchor%'`);
    } else if (lowerSlug.includes("polycab")) {
      allCategoryProducts = await db.select()
        .from(products)
        .where(sql`LOWER(${products.tags}) LIKE '%polycab%' OR LOWER(${products.name}) LIKE '%polycab%'`);
    } else {
      // General fallback for tags and names matching the slug
      allCategoryProducts = await db.select()
        .from(products)
        .where(sql`LOWER(${products.tags}) LIKE ${'%' + lowerSlug + '%'} OR LOWER(${products.name}) LIKE ${'%' + lowerSlug + '%'}`);
    }
  }

  // Find products that are NOT already shown in custom sections
  const displayedProductIds = new Set(
    sectionsWithProducts.flatMap(s => s.products.map((p: any) => p.id))
  );
  const remainingProducts = allCategoryProducts.filter(p => !displayedProductIds.has(p.id));

  // If there are category products not displayed in any custom section, show them
  if (remainingProducts.length > 0) {
    sectionsWithProducts.push({
      id: "all-products-fallback",
      title: sectionsWithProducts.length > 0 ? "More Products" : "All Products",
      products: remainingProducts
    });
  }

  // 5. Final check - if absolutely nothing found
  if (sectionsWithProducts.length === 0 && !menuItem) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-playfair font-bold text-brand mb-4">Category Not Found</h1>
        <p className="text-brand/60 mb-8">We couldn't find any products in the "{categoryName}" collection.</p>
        <Link href="/" className="text-[#FF9800] font-bold uppercase tracking-widest text-xs hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-5xl md:text-6xl font-playfair font-bold text-brand mb-4 tracking-tight">{categoryName}</h1>
        <div className="w-24 h-1 bg-[#FF9800] mx-auto rounded-full mb-4"></div>
        <p className="text-brand/70 max-w-2xl mx-auto font-inter leading-relaxed">
          Explore our curated selection of premium {categoryName.toLowerCase()} pieces, 
          each designed with meticulous attention to detail and crafted for an impeccable fit.
        </p>
      </div>
      
      {/* Dynamic Sections */}
      {sectionsWithProducts.length > 0 ? (
        <div className="space-y-16">
          {sectionsWithProducts.map((section) => (
            <div key={section.id}>
              <div className="mb-8 border-b border-brand/5 pb-4">
                <h2 className="text-2xl font-playfair font-bold text-brand uppercase tracking-wider">{section.title}</h2>
              </div>
              <ProductGrid 
                initialProducts={section.products} 
                showTitle={false}
              />
            </div>
          ))}
        </div>
      ) : (
        <section className="py-4 text-center bg-brand/5 rounded-[3rem] border border-brand/10 px-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <ShoppingBag className="text-[#FF9800]" size={32} />
          </div>
          <h2 className="text-2xl font-playfair font-bold text-brand mb-3">Collection Coming Soon</h2>
          <p className="text-brand/60 max-w-sm mx-auto">
            We are currently curating the perfect selection for this category. Check back soon for the latest arrivals.
          </p>
        </section>
      )}

      {/* Footer Grid - Optional/Default if no sections? Or just extra products? */}
      {/* For now, we'll just show the dynamic sections as requested */}
    </div>
  );
}
