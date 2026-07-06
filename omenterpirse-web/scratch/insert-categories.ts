import { db } from "../src/db/index";
import { categories } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Updating categories database table...");

  const newCategories = [
    {
      name: "Electrical Wires",
      slug: "wires",
      imageUrl: "/images/wires_category.png",
      displayOrder: 1,
      isActive: true,
    },
    {
      name: "Electrical Cables",
      slug: "cables",
      imageUrl: "/images/cables_category.png",
      displayOrder: 2,
      isActive: true,
    },
    {
      name: "Switches & Modular",
      slug: "switches",
      imageUrl: "/images/switches_category.png",
      displayOrder: 3,
      isActive: true,
    },
    {
      name: "MCBs & DBs",
      slug: "mcb-db",
      imageUrl: "/images/mcb_db_category.png",
      displayOrder: 4,
      isActive: true,
    },
    {
      name: "Electrical Pipes",
      slug: "conduits",
      imageUrl: "/images/electrical_pipe_category.jpg",
      displayOrder: 5,
      isActive: true,
    },
    {
      name: "Anchor",
      slug: "anchor",
      imageUrl: "/images/anchor_category.png",
      displayOrder: 6,
      isActive: true,
    },
    {
      name: "Polycab Wires",
      slug: "polycab-wires",
      imageUrl: "/images/polycab_wires_category.jpg",
      displayOrder: 7,
      isActive: true,
    },
    {
      name: "Fitting Accessories",
      slug: "fittings",
      imageUrl: "/images/fitting_accesories_category.jpg",
      displayOrder: 8,
      isActive: true,
    },
  ];

  for (const cat of newCategories) {
    // Check if category exists
    const existing = await db.select().from(categories).where(eq(categories.slug, cat.slug)).limit(1);
    if (existing.length > 0) {
      console.log(`Updating existing category: ${cat.name}`);
      await db.update(categories)
        .set({
          name: cat.name,
          imageUrl: cat.imageUrl,
          displayOrder: cat.displayOrder,
          isActive: cat.isActive,
        })
        .where(eq(categories.slug, cat.slug));
    } else {
      console.log(`Inserting new category: ${cat.name}`);
      await db.insert(categories).values(cat);
    }
  }

  // Delete any other categories that are not in this list, or keep them?
  // Let's delete other categories to clean up and keep only these 8.
  const activeSlugs = newCategories.map(c => c.slug);
  const allInDb = await db.select().from(categories);
  for (const item of allInDb) {
    if (!activeSlugs.includes(item.slug)) {
      console.log(`Deleting unused category: ${item.name} (${item.slug})`);
      await db.delete(categories).where(eq(categories.id, item.id));
    }
  }

  console.log("Categories database setup successfully!");
}

main().catch(console.error);
