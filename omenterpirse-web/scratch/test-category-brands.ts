import { db } from "../src/db";
import { categories, brands } from "../src/db/schema";
import { eq, and, or, sql } from "drizzle-orm";

async function testQuery(slug: string) {
  const decodedSlug = decodeURIComponent(slug).replace(/-/g, " ");
  
  const categoryResult = await db.select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  const categoryItem = categoryResult[0];
  console.log("CategoryItem:", categoryItem);

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
    );
  console.log("Brands matched:", categoryBrands.length);
  console.log(categoryBrands);
}

testQuery("wires").catch(console.error);
