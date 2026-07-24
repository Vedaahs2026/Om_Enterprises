import { db } from "../src/db";
import { products, productVariations, cartItems } from "../src/db/schema";

async function main() {
  console.log("Clearing all products, variations, and cart items from Turso...");
  
  await db.delete(cartItems);
  console.log("Cleared cart items.");
  
  await db.delete(productVariations);
  console.log("Cleared product variations.");
  
  await db.delete(products);
  console.log("Cleared products.");
  
  console.log("Database cleared successfully!");
}

main().catch(console.error);
