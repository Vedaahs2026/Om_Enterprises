import { db } from "../src/db/index";
import { products, pageSections } from "../src/db/schema";

async function main() {
  const allProds = await db.select().from(products);
  console.log("TOTAL PRODUCTS IN DB:", allProds.length);

  const sections = await db.select().from(pageSections).orderBy(pageSections.displayOrder);
  console.log("HOMEPAGE SECTIONS:");
  for (const s of sections) {
    const ids = s.productIds.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    console.log(`- Section: "${s.title}" (ID: ${s.id}) -> Product count: ${ids.length}`);
  }
}

main().catch(console.error);
