import { db } from "../src/db";
import { categories, brands, brandLengths, brandModels, brandVariations } from "../src/db/schema";

async function main() {
  const cats = await db.select().from(categories);
  console.log("=== CATEGORIES ===");
  console.log(cats);

  const brs = await db.select().from(brands);
  console.log("\n=== BRANDS ===");
  console.log(brs);

  const lengths = await db.select().from(brandLengths);
  console.log("\n=== LENGTHS ===");
  console.log(lengths);
}

main().catch(console.error);
