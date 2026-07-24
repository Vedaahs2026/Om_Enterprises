import { db } from "../src/db";
import { products } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const allProducts = await db.select({ id: products.id, name: products.name }).from(products);
  console.log("=== ALL PRODUCTS IN TURSO ===");
  console.log(JSON.stringify(allProducts, null, 2));
}

main().catch(console.error);
