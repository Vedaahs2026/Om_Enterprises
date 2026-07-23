import { db } from "./index";
import { 
  users, 
  navigationMenu, 
  products, 
  productVariations, 
  pageSections, 
  homeCategoryBanners, 
  homeTabs,
  cartItems,
  orderItems,
  orders,
  otpVerifications,
  categories
} from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding complete B2B catalog for OM Enterprises...");

  try {
    // 1. Clear existing database entries
    console.log("Clearing existing tables...");
    await db.delete(cartItems);
    await db.delete(orderItems);
    await db.delete(orders);
    await db.delete(productVariations);
    await db.delete(products);
    await db.delete(pageSections);
    await db.delete(navigationMenu);
    await db.delete(homeCategoryBanners);
    await db.delete(homeTabs);
    await db.delete(otpVerifications);
    await db.delete(categories);
    await db.delete(users);

    // 2. Users (Admin and fallback admin)
    console.log("Seeding Users...");
    await db.insert(users).values([
      {
        phoneNumber: "9876543210",
        fullName: "System Admin",
        role: "admin",
        lastLoginAt: new Date().toISOString(),
      },
      {
        phoneNumber: "9849845555",
        fullName: "OM Admin",
        role: "admin",
        lastLoginAt: new Date().toISOString(),
      }
    ]);

    // 3. Navigation Menu (Only Wires and Cables)
    console.log("Seeding Navigation Menu...");
    const navItems = await db.insert(navigationMenu).values([
      { label: "Electrical Wires", href: "/category/wires", order: 1, isActive: true },
      { label: "Electrical Cables", href: "/category/cables", order: 2, isActive: true },
    ]).returning();

    // 3b. Categories (Only Wires and Cables)
    console.log("Seeding Categories...");
    await db.insert(categories).values([
      { name: "Electrical Wires", slug: "wires", imageUrl: "/images/wires_category.png", displayOrder: 1, isActive: true },
      { name: "Electrical Cables", slug: "cables", imageUrl: "/images/cables_category.png", displayOrder: 2, isActive: true },
    ]);

    // Map menu labels to IDs
    const menuMap = navItems.reduce((acc, item) => {
      acc[item.label] = item.id;
      return acc;
    }, {} as Record<string, number>);

    // 4. Products
    console.log("Seeding Products...");
    const productList = await db.insert(products).values([
      // --- Category 1: Electrical Wires ---
      {
        name: "Polycab FR PVC Insulated House Wire",
        description: "Flame Retardant (FR) multi-strand copper wiring. Superior conductivity and high heat resistance for residential conduits.",
        basePrice: 2200,
        salePrice: 1850,
        images: JSON.stringify(["/images/wires_category.png"]),
        category: "wires",
        tags: "wires,fr,polycab,wiring,house",
        isFeatured: true,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Finolex FRLS Multi Strand Industrial Wire",
        description: "Flame Retardant Low Smoke (FRLS) copper wires. Reduces toxic gas emissions in the event of an electrical fire.",
        basePrice: 2800,
        salePrice: 2400,
        images: JSON.stringify(["/images/wires_category.png"]),
        category: "wires",
        tags: "wires,frls,finolex,industrial",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },
      {
        name: "RR Kabel FRLSH House Wiring Wire",
        description: "Flame Retardant Low Smoke & Halogen Free (FRLSH) wires for highest safety margins in building installations.",
        basePrice: 3200,
        salePrice: 2750,
        images: JSON.stringify(["/images/wires_category.png"]),
        category: "wires",
        tags: "wires,frlsh,rrkabel,home",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },

      // --- Category 2: Electrical Cables ---
      {
        name: "Polycab 4-Core Copper Armoured Power Cable",
        description: "Heavy-duty underground power transmission cable with steel wire armouring. High tensile strength, ISI certified.",
        basePrice: 14500,
        salePrice: 12500,
        images: JSON.stringify(["/images/cables_category.png"]),
        category: "cables",
        tags: "cables,armoured,copper,power,polycab",
        isFeatured: true,
        createdAt: new Date().toISOString(),
      },
      {
        name: "KEI 3-Core Aluminium Unarmoured Power Cable",
        description: "Aluminium conductor power cables insulated with PVC. High corrosion resistance and lightweight.",
        basePrice: 9500,
        salePrice: 8200,
        images: JSON.stringify(["/images/cables_category.png"]),
        category: "cables",
        tags: "cables,unarmoured,aluminium,kei",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      }
    ]).returning();

    // 5. Product Variations (Specifications, sizes, colors)
    console.log("Seeding Product Variations...");
    const variationsToInsert = [];

    // Map inserted products to their variations
    for (const prod of productList) {
      if (prod.category === "wires") {
        variationsToInsert.push(
          { productId: prod.id, size: "1.0 sq mm - Red (90m)", stock: 100, mrp: prod.basePrice, salePrice: prod.salePrice, sku: `${prod.name.substring(0,2)}-10-R` },
          { productId: prod.id, size: "2.5 sq mm - Blue (90m)", stock: 80, mrp: Math.round(prod.basePrice * 1.5), salePrice: Math.round(prod.salePrice * 1.5), sku: `${prod.name.substring(0,2)}-25-B` },
          { productId: prod.id, size: "4.0 sq mm - Black (180m)", stock: 50, mrp: Math.round(prod.basePrice * 2.8), salePrice: Math.round(prod.salePrice * 2.8), sku: `${prod.name.substring(0,2)}-40-K` }
        );
      } else if (prod.category === "cables") {
        variationsToInsert.push(
          { productId: prod.id, size: "4 Core 6 sq mm (100m)", stock: 25, mrp: prod.basePrice, salePrice: prod.salePrice, sku: `${prod.name.substring(0,2)}-04-06` },
          { productId: prod.id, size: "4 Core 16 sq mm (100m)", stock: 10, mrp: Math.round(prod.basePrice * 2.1), salePrice: Math.round(prod.salePrice * 2.1), sku: `${prod.name.substring(0,2)}-04-16` }
        );
      }
    }

    await db.insert(productVariations).values(variationsToInsert);

    // 6. Home Category Banners
    console.log("Seeding Category Banners...");
    await db.insert(homeCategoryBanners).values([
      {
        title: "FR & FRLS Electrical Wires",
        imageUrl: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=1200&q=80",
        linkHref: "/category/wires",
        displayOrder: 1,
        isActive: true
      },
      {
        title: "Heavy Armoured Power Cables",
        imageUrl: "https://images.unsplash.com/photo-1601524909162-be87252be298?w=1200&q=80",
        linkHref: "/category/cables",
        displayOrder: 2,
        isActive: true
      }
    ]);

    // 7. Home Tabs (Only Wires and Cables B2B category icons)
    console.log("Seeding Home Tabs...");
    await db.insert(homeTabs).values([
      { title: "Electrical Wires", linkHref: "/category/wires", imageUrl: "https://img.icons8.com/color/96/wiring.png", displayOrder: 1, isActive: true },
      { title: "Electrical Cables", linkHref: "/category/cables", imageUrl: "https://img.icons8.com/color/96/cable.png", displayOrder: 2, isActive: true }
    ]);

    // 8. Page Sections (Link catalog categories to dynamic pages)
    console.log("Seeding Page Sections...");
    const pageSectionsToInsert = [];

    // Helper function to link categories
    const linkCategoryToSection = (label: string, title: string, productsOfCategory: any[], order: number) => {
      const menuId = menuMap[label];
      if (menuId) {
        pageSectionsToInsert.push({
          menuId,
          title,
          productIds: productsOfCategory.map(p => p.id).join(","),
          displayOrder: order
        });
      }
    };

    // Filter products by category column to link
    const wiresProd = productList.filter(p => p.category === "wires");
    const cablesProd = productList.filter(p => p.category === "cables");

    linkCategoryToSection("Electrical Wires", "Premium Wiring Solutions", wiresProd, 1);
    linkCategoryToSection("Electrical Cables", "Armoured & Control Cables", cablesProd, 2);

    await db.insert(pageSections).values(pageSectionsToInsert);

    console.log("B2B Database Catalog seeded successfully!");
  } catch (error) {
    console.error("B2B Database Catalog seeding failed:", error);
  }
}

seed();
