import { db } from "../src/db/index";
import { products } from "../src/db/schema";
import { like, or } from "drizzle-orm";

async function main() {
  const allProds = await db.select().from(products);
  console.log("TOTAL PRODUCTS:", allProds.length);
  
  const searchResults = await db.select()
    .from(products)
    .where(
      or(
        like(products.name, "%Polycab%"),
        like(products.name, "%Anchor%"),
        like(products.category, "%polycab%"),
        like(products.category, "%anchor%"),
        like(products.category, "%conduit%"),
        like(products.category, "%fitting%")
      )
    );
  
  console.log("MATCHING PRODUCTS:");
  console.log(searchResults.map(p => ({ id: p.id, name: p.name, category: p.category })));
}

main().catch(console.error);
