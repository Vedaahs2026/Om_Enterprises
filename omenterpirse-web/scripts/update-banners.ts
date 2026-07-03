import { db } from "../src/db";
import { homeCategoryBanners } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Updating category banner images to electrical store themed images...");

  // Update Wire Banner
  await db
    .update(homeCategoryBanners)
    .set({
      imageUrl: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=1200&q=80",
    })
    .where(eq(homeCategoryBanners.title, "FR & FRLS Electrical Wires"));

  // Update Cable Banner
  await db
    .update(homeCategoryBanners)
    .set({
      imageUrl: "https://images.unsplash.com/photo-1601524909162-be87252be298?w=1200&q=80",
    })
    .where(eq(homeCategoryBanners.title, "Heavy Armoured Power Cables"));

  // Update Switchgear Banner
  await db
    .update(homeCategoryBanners)
    .set({
      imageUrl: "https://images.unsplash.com/photo-1606206591513-ad60137d478a?w=1200&q=80",
    })
    .where(eq(homeCategoryBanners.title, "Modular Switches & Switchgears"));

  console.log("Database category banners updated successfully!");
}

main().catch(console.error);
