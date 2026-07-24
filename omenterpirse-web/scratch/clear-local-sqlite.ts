import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { products, productVariations, cartItems } from "../src/db/schema";
import * as schema from "../src/db/schema";

async function main() {
  console.log("Connecting directly to local file:./sqlite.db...");
  const client = createClient({
    url: "file:./sqlite.db",
  });
  const db = drizzle(client, { schema });

  console.log("Clearing all products, variations, and cart items from local sqlite.db...");
  await db.delete(cartItems);
  await db.delete(productVariations);
  await db.delete(products);
  console.log("Local sqlite.db cleared successfully!");
  client.close();
}

main().catch(console.error);
