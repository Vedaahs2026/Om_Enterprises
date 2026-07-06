import { db } from "../src/db/index";
import { 
  categories,
  navigationMenu,
  products,
  productVariations,
  pageSections,
  homeCategoryBanners,
  homeTabs,
  packageTiers,
  users,
  orders,
  orderItems,
  otpVerifications
} from "../src/db/schema";
import Database from "better-sqlite3";
import path from "path";

async function main() {
  console.log("Starting local SQLite to Turso database sync...");
  
  // Open local SQLite database
  const localDbPath = path.resolve(__dirname, "../sqlite.db");
  console.log(`Connecting to local SQLite database at: ${localDbPath}`);
  const localDb = new Database(localDbPath);

  // Helper to sync a table
  const syncTable = async (tableName: string, schemaTable: any) => {
    console.log(`\nSyncing table: ${tableName}...`);
    try {
      const rows = localDb.prepare(`SELECT * FROM ${tableName}`).all();
      console.log(`Fetched ${rows.length} rows from local table: ${tableName}`);
      
      // Clear existing records in Turso
      await db.delete(schemaTable);
      
      if (rows.length > 0) {
        // Map any row types and convert keys to camelCase for Drizzle
        const mappedRows = rows.map((row: any) => {
          const camelized: any = {};
          for (const key of Object.keys(row)) {
            const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            camelized[camelKey] = row[key];
          }

          // Convert numeric 1/0 booleans back to true/false for Drizzle's boolean mode mapping
          if (camelized.isFeatured !== undefined && camelized.isFeatured !== null) {
            camelized.isFeatured = Boolean(camelized.isFeatured);
          }
          if (camelized.isActive !== undefined && camelized.isActive !== null) {
            camelized.isActive = Boolean(camelized.isActive);
          }
          return camelized;
        });

        // Batch insert in chunks of 50 to avoid size limits
        const chunkSize = 50;
        for (let i = 0; i < mappedRows.length; i += chunkSize) {
          const chunk = mappedRows.slice(i, i + chunkSize);
          await db.insert(schemaTable).values(chunk);
        }
        console.log(`[✓] Successfully synced ${rows.length} rows to Turso`);
      } else {
        console.log(`[✓] No rows to sync for ${tableName}`);
      }
    } catch (error) {
      console.error(`[-] Failed to sync table ${tableName}:`, error);
    }
  };

  // Sync tables in order of dependency (parent tables first)
  await syncTable("categories", categories);
  await syncTable("navigation_menu", navigationMenu);
  await syncTable("products", products);
  await syncTable("product_variations", productVariations);
  await syncTable("page_sections", pageSections);
  await syncTable("home_category_banners", homeCategoryBanners);
  await syncTable("home_tabs", homeTabs);
  await syncTable("package_tiers", packageTiers);
  await syncTable("users", users);
  await syncTable("orders", orders);
  await syncTable("order_items", orderItems);
  await syncTable("otp_verifications", otpVerifications);

  console.log("\n[✓] Database Sync Complete!");
  localDb.close();
}

main().catch(console.error);
