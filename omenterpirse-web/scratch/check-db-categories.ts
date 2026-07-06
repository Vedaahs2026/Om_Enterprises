import { db } from "../src/db/index";
import { categories } from "../src/db/schema";

async function main() {
  const result = await db.select().from(categories);
  console.log("CURRENT CATEGORIES IN DB:");
  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
