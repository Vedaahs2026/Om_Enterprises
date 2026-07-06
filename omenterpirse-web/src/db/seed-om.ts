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
  otpVerifications
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
        phoneNumber: "9704761386",
        fullName: "OM Admin",
        role: "admin",
        lastLoginAt: new Date().toISOString(),
      }
    ]);

    // 3. Navigation Menu (10 categories)
    console.log("Seeding Navigation Menu...");
    const navItems = await db.insert(navigationMenu).values([
      { label: "Electrical Wires", href: "/category/wires", order: 1, isActive: true },
      { label: "Electrical Cables", href: "/category/cables", order: 2, isActive: true },
      { label: "Switches & Modular", href: "/category/switches", order: 3, isActive: true },
      { label: "MCBs & DBs", href: "/category/mcb-db", order: 4, isActive: true },
      { label: "LED Lighting", href: "/category/lighting", order: 5, isActive: false },
      { label: "Fans", href: "/category/fans", order: 6, isActive: false },
      { label: "Conduits & Pipes", href: "/category/conduits", order: 7, isActive: false },
      { label: "Fittings & Accessories", href: "/category/fittings", order: 8, isActive: false },
      { label: "Industrial Electrical", href: "/category/industrial", order: 9, isActive: false },
      { label: "Home Electrical", href: "/category/home-products", order: 10, isActive: false },
    ]).returning();

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
      },

      // --- Category 3: Switches & Modular Accessories ---
      {
        name: "Anchor Roma Classic 1-Way Modular Switch",
        description: "Elegant modular switch with smooth rocker action and high contact reliability. Designed for millions of clicks.",
        basePrice: 90,
        salePrice: 75,
        images: JSON.stringify(["/images/switches_category.png"]),
        category: "switches",
        tags: "switches,modular,anchor,roma",
        isFeatured: true,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Legrand Arteor 3-Pin Socket Outlet 6A/16A",
        description: "Dual-rated shuttered socket for premium home and office modular plates. High tension brass terminals.",
        basePrice: 280,
        salePrice: 220,
        images: JSON.stringify(["/images/switches_category.png"]),
        category: "switches",
        tags: "socket,modular,legrand,arteor",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },

      // --- Category 4: MCB & Distribution Boards ---
      {
        name: "Schneider Acti9 16A Single Pole C-Curve MCB",
        description: "Domestic and commercial miniature circuit breaker protecting against overload currents and short circuits.",
        basePrice: 350,
        salePrice: 285,
        images: JSON.stringify(["/images/mcb_db_category.png"]),
        category: "mcb-db",
        tags: "mcb,schneider,switchgear",
        isFeatured: true,
        createdAt: new Date().toISOString(),
      },
      {
        name: "ABB 4-Pole RCCB 30mA 63A",
        description: "Residual Current Circuit Breaker with high sensitivity to prevent shock hazards and electrical leakage fires.",
        basePrice: 4200,
        salePrice: 3550,
        images: JSON.stringify(["/images/mcb_db_category.png"]),
        category: "mcb-db",
        tags: "rccb,abb,switchgear",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Siemens 12-Way Double Door Distribution Board",
        description: "Sleek and robust sheet steel enclosure DB board with IP43 protection and insulated neutral bars.",
        basePrice: 3200,
        salePrice: 2600,
        images: JSON.stringify(["/images/mcb_db_category.png"]),
        category: "mcb-db",
        tags: "db,distribution,siemens",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },

      // --- Category 5: LED Lighting ---
      {
        name: "Philips 9W LED Bulb Cool Day Light",
        description: "Highly energy efficient bulb. Glare-free light with long lifetime rating and zero flicker.",
        basePrice: 140,
        salePrice: 110,
        images: JSON.stringify(["https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80"]),
        category: "lighting",
        tags: "led,bulb,philips,lighting",
        isFeatured: true,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Surya 15W Round LED Downlight Panel",
        description: "Slim panel ceiling downlight. Perfect replacement for legacy compact fluorescent lamps.",
        basePrice: 450,
        salePrice: 350,
        images: JSON.stringify(["https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80"]),
        category: "lighting",
        tags: "led,downlight,surya,lighting",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },

      // --- Category 6: Fans ---
      {
        name: "Havells Premium High-Speed Ceiling Fan",
        description: "Ceiling fan featuring aerodynamically designed blades and heavy duty motor for low power consumption.",
        basePrice: 3200,
        salePrice: 2650,
        images: JSON.stringify(["https://images.unsplash.com/photo-1618944913480-b67ee16d7b77?w=800&q=80"]),
        category: "fans",
        tags: "fan,ceiling,havells",
        isFeatured: true,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Crompton Windmill Wall Mounted Fan",
        description: "Oscillating wall fan with high speed air delivery and smooth silent operation.",
        basePrice: 2900,
        salePrice: 2400,
        images: JSON.stringify(["https://images.unsplash.com/photo-1618944913480-b67ee16d7b77?w=800&q=80"]),
        category: "fans",
        tags: "fan,wall,crompton",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },

      // --- Category 7: Conduits & Electrical Pipes ---
      {
        name: "Premium PVC Conduit Pipe Heavy Gauge",
        description: "Heavy duty non-flammable PVC pipe to route and protect internal building wires. ISI marked.",
        basePrice: 85,
        salePrice: 65,
        images: JSON.stringify(["https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80"]),
        category: "conduits",
        tags: "pvc,pipe,conduit,heavy",
        isFeatured: true,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Flexible PVC Reinforced Steel Conduit",
        description: "Corrugated steel flexible pipe wrapped in PVC. Ideal for machinery and industrial layout routing.",
        basePrice: 1200,
        salePrice: 980,
        images: JSON.stringify(["https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80"]),
        category: "conduits",
        tags: "conduit,flexible,steel,pipe",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },

      // --- Category 8: Electrical Fittings & Accessories ---
      {
        name: "Heavy Duty Nylon Cable Ties (100 Pack)",
        description: "High-grade industrial self-locking zip ties. UV resistant nylon, perfect for cable grouping.",
        basePrice: 150,
        salePrice: 120,
        images: JSON.stringify(["https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800&q=80"]),
        category: "fittings",
        tags: "cabletie,nylon,fittings,zip",
        isFeatured: true,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Brass Double Compression Cable Gland",
        description: "Nickel-plated brass compression glands providing weatherproof seal and armored grip for mains cables.",
        basePrice: 450,
        salePrice: 380,
        images: JSON.stringify(["https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800&q=80"]),
        category: "fittings",
        tags: "gland,brass,fittings,compression",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },

      // --- Category 9: Industrial Electrical Products ---
      {
        name: "Siemens 3-Phase Custom Control Panel Assembly",
        description: "Bespoke distribution control cabinet with main MCCB feeder, star-delta starters, and voltmeter meters.",
        basePrice: 48000,
        salePrice: 42000,
        images: JSON.stringify(["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80"]),
        category: "industrial",
        tags: "industrial,panel,siemens,control",
        isFeatured: true,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Schneider Electric 3-Phase Contactor 9A 230V AC",
        description: "Heavy duty electric contactor designed for motor starters and switching control loops.",
        basePrice: 1400,
        salePrice: 1150,
        images: JSON.stringify(["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80"]),
        category: "industrial",
        tags: "contactor,schneider,industrial",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },

      // --- Category 10: Home Electrical Products ---
      {
        name: "Anchor Ding Dong Door Bell 240V AC",
        description: "Classic household mechanical chime door bell. Modern clean styling and crisp chime sound.",
        basePrice: 240,
        salePrice: 180,
        images: JSON.stringify(["https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80"]),
        category: "home-products",
        tags: "bell,doorbell,anchor,home",
        isFeatured: true,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Havells 4-Way Extension Board Spike Guard",
        description: "4 plug multi-pin spike extension strip with individual status switches and built-in fuse protectors.",
        basePrice: 750,
        salePrice: 590,
        images: JSON.stringify(["https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80"]),
        category: "home-products",
        tags: "extension,havells,home,plug",
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
      } else if (prod.category === "switches") {
        variationsToInsert.push(
          { productId: prod.id, size: "Standard 6A (White)", stock: 200, mrp: prod.basePrice, salePrice: prod.salePrice, sku: `${prod.name.substring(0,2)}-06-W` },
          { productId: prod.id, size: "Standard 16A (Ivory)", stock: 150, mrp: Math.round(prod.basePrice * 1.3), salePrice: Math.round(prod.salePrice * 1.3), sku: `${prod.name.substring(0,2)}-16-I` }
        );
      } else if (prod.category === "mcb-db") {
        variationsToInsert.push(
          { productId: prod.id, size: "SP 16A Curve C", stock: 120, mrp: prod.basePrice, salePrice: prod.salePrice, sku: `${prod.name.substring(0,2)}-16-C` },
          { productId: prod.id, size: "SP 32A Curve C", stock: 90, mrp: Math.round(prod.basePrice * 1.2), salePrice: Math.round(prod.salePrice * 1.2), sku: `${prod.name.substring(0,2)}-32-C` }
        );
      } else if (prod.category === "lighting") {
        variationsToInsert.push(
          { productId: prod.id, size: "Cool Day Light (6500K)", stock: 180, mrp: prod.basePrice, salePrice: prod.salePrice, sku: `${prod.name.substring(0,2)}-CD` },
          { productId: prod.id, size: "Warm White (3000K)", stock: 110, mrp: prod.basePrice, salePrice: prod.salePrice, sku: `${prod.name.substring(0,2)}-WW` }
        );
      } else if (prod.category === "fans") {
        variationsToInsert.push(
          { productId: prod.id, size: "1200mm Sweep (White)", stock: 40, mrp: prod.basePrice, salePrice: prod.salePrice, sku: `${prod.name.substring(0,2)}-12-W` },
          { productId: prod.id, size: "1200mm Sweep (Bronze)", stock: 30, mrp: Math.round(prod.basePrice * 1.1), salePrice: Math.round(prod.salePrice * 1.1), sku: `${prod.name.substring(0,2)}-12-B` }
        );
      } else if (prod.category === "conduits") {
        variationsToInsert.push(
          { productId: prod.id, size: "20mm (3 Meter Length)", stock: 300, mrp: prod.basePrice, salePrice: prod.salePrice, sku: `${prod.name.substring(0,2)}-20` },
          { productId: prod.id, size: "25mm (3 Meter Length)", stock: 250, mrp: Math.round(prod.basePrice * 1.2), salePrice: Math.round(prod.salePrice * 1.2), sku: `${prod.name.substring(0,2)}-25` }
        );
      } else if (prod.category === "fittings") {
        variationsToInsert.push(
          { productId: prod.id, size: "Standard pack", stock: 100, mrp: prod.basePrice, salePrice: prod.salePrice, sku: `${prod.name.substring(0,2)}-SP` }
        );
      } else if (prod.category === "industrial") {
        variationsToInsert.push(
          { productId: prod.id, size: "Industrial Rating Heavy Duty", stock: 15, mrp: prod.basePrice, salePrice: prod.salePrice, sku: `${prod.name.substring(0,2)}-HD` }
        );
      } else if (prod.category === "home-products") {
        variationsToInsert.push(
          { productId: prod.id, size: "Home Standard", stock: 80, mrp: prod.basePrice, salePrice: prod.salePrice, sku: `${prod.name.substring(0,2)}-HS` }
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
      },
      {
        title: "Modular Switches & Switchgears",
        imageUrl: "https://images.unsplash.com/photo-1606206591513-ad60137d478a?w=1200&q=80",
        linkHref: "/category/switchgears",
        displayOrder: 3,
        isActive: true
      }
    ]);

    // 7. Home Tabs (All 10 B2B category icons)
    console.log("Seeding Home Tabs...");
    await db.insert(homeTabs).values([
      { title: "Electrical Wires", linkHref: "/category/wires", imageUrl: "https://img.icons8.com/color/96/wiring.png", displayOrder: 1, isActive: true },
      { title: "Electrical Cables", linkHref: "/category/cables", imageUrl: "https://img.icons8.com/color/96/cable.png", displayOrder: 2, isActive: true },
      { title: "Switches & Modular", linkHref: "/category/switches", imageUrl: "https://img.icons8.com/color/96/toggle-switch.png", displayOrder: 3, isActive: true },
      { title: "MCBs & DBs", linkHref: "/category/mcb-db", imageUrl: "https://img.icons8.com/color/96/fuse-box.png", displayOrder: 4, isActive: true },
      { title: "LED Lighting", linkHref: "/category/lighting", imageUrl: "https://img.icons8.com/color/96/led-diode.png", displayOrder: 5, isActive: true },
      { title: "Fans", linkHref: "/category/fans", imageUrl: "https://img.icons8.com/color/96/ceiling-fan.png", displayOrder: 6, isActive: true },
      { title: "Conduits & Pipes", linkHref: "/category/conduits", imageUrl: "https://img.icons8.com/color/96/pipe.png", displayOrder: 7, isActive: true },
      { title: "Fittings & Accessories", linkHref: "/category/fittings", imageUrl: "https://img.icons8.com/color/96/pliers.png", displayOrder: 8, isActive: true },
      { title: "Industrial Electrical", linkHref: "/category/industrial", imageUrl: "https://img.icons8.com/color/96/power-plant.png", displayOrder: 9, isActive: true },
      { title: "Home Electrical", linkHref: "/category/home-products", imageUrl: "https://img.icons8.com/color/96/socket.png", displayOrder: 10, isActive: true },
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
    const switchesProd = productList.filter(p => p.category === "switches");
    const mcbProd = productList.filter(p => p.category === "mcb-db");
    const lightingProd = productList.filter(p => p.category === "lighting");
    const fansProd = productList.filter(p => p.category === "fans");
    const conduitsProd = productList.filter(p => p.category === "conduits");
    const fittingsProd = productList.filter(p => p.category === "fittings");
    const industrialProd = productList.filter(p => p.category === "industrial");
    const homeProd = productList.filter(p => p.category === "home-products");

    linkCategoryToSection("Electrical Wires", "Premium Wiring Solutions", wiresProd, 1);
    linkCategoryToSection("Electrical Cables", "Armoured & Control Cables", cablesProd, 2);
    linkCategoryToSection("Switches & Modular", "Modular Switches & Plates", switchesProd, 3);
    linkCategoryToSection("MCBs & DBs", "Distribution Boards & Protection MCBs", mcbProd, 4);
    linkCategoryToSection("LED Lighting", "Energy Efficient LED Lighting", lightingProd, 5);
    linkCategoryToSection("Fans", "Premium Ceiling & Exhaust Fans", fansProd, 6);
    linkCategoryToSection("Conduits & Pipes", "Rigid PVC & Metallic Conduits", conduitsProd, 7);
    linkCategoryToSection("Fittings & Accessories", "Cable Ties, Lugs & Glands", fittingsProd, 8);
    linkCategoryToSection("Industrial Electrical", "Industrial switchgears & Panels", industrialProd, 9);
    linkCategoryToSection("Home Electrical", "Emergency Lights, Bells & Strips", homeProd, 10);

    await db.insert(pageSections).values(pageSectionsToInsert);

    console.log("B2B Database Catalog seeded successfully!");
  } catch (error) {
    console.error("B2B Database Catalog seeding failed:", error);
  }
}

seed();
