import { db } from "../src/db/index";
import { 
  products, 
  productVariations, 
  pageSections, 
  navigationMenu 
} from "../src/db/schema";

async function main() {
  console.log("Seeding exactly 4 electrical-related products for each of the 8 categories...");

  try {
    // 1. Clear existing tables
    console.log("Clearing existing tables...");
    await db.delete(productVariations);
    await db.delete(products);
    await db.delete(pageSections);
    await db.delete(navigationMenu);

    // 2. Navigation Menu
    console.log("Seeding Navigation Menu...");
    const navItems = await db.insert(navigationMenu).values([
      { label: "Electrical Wires", href: "/category/wires", order: 1, isActive: true },
      { label: "Electrical Cables", href: "/category/cables", order: 2, isActive: true },
      { label: "Switches & Modular", href: "/category/switches", order: 3, isActive: true },
      { label: "MCBs & DBs", href: "/category/mcb-db", order: 4, isActive: true },
      { label: "Electrical Pipes", href: "/category/conduits", order: 5, isActive: false },
      { label: "Anchor", href: "/category/anchor", order: 6, isActive: false },
      { label: "Polycab Wires", href: "/category/polycab-wires", order: 7, isActive: false },
      { label: "Fitting Accessories", href: "/category/fittings", order: 8, isActive: false },
    ]).returning();

    // Map menu labels to IDs
    const menuMap = navItems.reduce((acc, item) => {
      acc[item.label] = item.id;
      return acc;
    }, {} as Record<string, number>);

    // 3. Products
    console.log("Seeding 32 Products...");
    const productList = await db.insert(products).values([
      // --- Category 1: wires (Electrical Wires) ---
      {
        name: "Polycab FR PVC Insulated House Wire 1.0 sq mm",
        description: "Flame Retardant (FR) multi-strand copper wiring. Superior conductivity and high heat resistance for residential conduits.",
        basePrice: 2200,
        salePrice: 1850,
        images: JSON.stringify(["/images/polycab_wires_category.jpg"]),
        category: "wires",
        tags: "wires,fr,polycab,wiring,house",
        isFeatured: true,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Finolex FRLS Multi Strand Industrial Wire 2.5 sq mm",
        description: "Flame Retardant Low Smoke (FRLS) copper wires. Reduces toxic gas emissions in the event of an electrical fire.",
        basePrice: 2800,
        salePrice: 2400,
        images: JSON.stringify(["/images/electrical_wires_category.jpg"]),
        category: "wires",
        tags: "wires,frls,finolex,industrial",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },
      {
        name: "RR Kabel FRLSH House Wiring Wire 1.5 sq mm",
        description: "Flame Retardant Low Smoke & Halogen Free (FRLSH) wires for highest safety margins in building installations.",
        basePrice: 3200,
        salePrice: 2750,
        images: JSON.stringify(["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80"]),
        category: "wires",
        tags: "wires,frlsh,rrkabel,home",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Havells FR PVC Insulated Copper Wire 4.0 sq mm",
        description: "High-safety FR grade multi-strand copper wire roll. Durable outer sheath with high insulation properties.",
        basePrice: 4100,
        salePrice: 3500,
        images: JSON.stringify(["https://images.unsplash.com/photo-1595185340989-1065c71c4598?w=600&q=80"]),
        category: "wires",
        tags: "wires,fr,havells,wiring",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },

      // --- Category 2: cables (Electrical Cables) ---
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
        images: JSON.stringify(["https://images.unsplash.com/photo-1601524909162-be87252be298?w=600&q=80"]),
        category: "cables",
        tags: "cables,unarmoured,aluminium,kei",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Finolex 3-Core Flexible Copper Cable",
        description: "High-flexibility industrial copper cable, double insulated. Perfect for appliances and moving machinery.",
        basePrice: 3400,
        salePrice: 2900,
        images: JSON.stringify(["https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600&q=80"]),
        category: "cables",
        tags: "cables,flexible,copper,finolex",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Havells 2-Core Unarmoured Submersible Cable",
        description: "Specialized water-resistant submersible pump cable. Thick PVC protective layer for underground aquatic installations.",
        basePrice: 5800,
        salePrice: 4950,
        images: JSON.stringify(["https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&q=80"]),
        category: "cables",
        tags: "cables,submersible,havells,unarmoured",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },

      // --- Category 3: switches (Switches & Modular) ---
      {
        name: "Anchor Roma Classic 1-Way Modular Switch 6A",
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
        images: JSON.stringify(["https://images.unsplash.com/photo-1606206591513-ad60137d478a?w=600&q=80"]),
        category: "switches",
        tags: "socket,modular,legrand,arteor",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Havells Crabtree Athena 2-Way Modular Switch",
        description: "Sleek and premium modular 2-way switch. Quiet action, durable contacts, and dirt-resistant plastic body.",
        basePrice: 180,
        salePrice: 145,
        images: JSON.stringify(["https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80"]),
        category: "switches",
        tags: "switches,modular,crabtree,havells",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Schneider Livia 2-Module Indicator Switch",
        description: "Modern modular switch featuring a glowing indicator light for dark conditions. Heavy load rating.",
        basePrice: 210,
        salePrice: 170,
        images: JSON.stringify(["https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&q=80"]),
        category: "switches",
        tags: "switches,indicator,schneider,modular",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },

      // --- Category 4: mcb-db (MCBs & DBs) ---
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
        images: JSON.stringify(["https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=600&q=80"]),
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
        images: JSON.stringify(["https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=600&q=80"]),
        category: "mcb-db",
        tags: "db,distribution,siemens",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Havells Euro II Double Pole Isolator 40A",
        description: "Main incoming electrical isolation switch for single-phase circuits. Heavy contacts and robust build.",
        basePrice: 720,
        salePrice: 590,
        images: JSON.stringify(["https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=600&q=80"]),
        category: "mcb-db",
        tags: "isolator,switchgear,havells,mcb",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },

      // --- Category 5: conduits (Electrical Pipes) ---
      {
        name: "Premium PVC Conduit Pipe Heavy Gauge 20mm",
        description: "Heavy duty non-flammable PVC pipe to route and protect internal building wires. ISI marked.",
        basePrice: 85,
        salePrice: 65,
        images: JSON.stringify(["/images/electrical_pipe_category.jpg"]),
        category: "conduits",
        tags: "pvc,pipe,conduit,heavy",
        isFeatured: true,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Flexible PVC Reinforced Steel Conduit 25mm",
        description: "Corrugated steel flexible pipe wrapped in PVC. Ideal for machinery and industrial layout routing.",
        basePrice: 1200,
        salePrice: 980,
        images: JSON.stringify(["https://images.unsplash.com/photo-1542060748-10c28b629f6f?w=600&q=80"]),
        category: "conduits",
        tags: "conduit,flexible,steel,pipe",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Medium Gauge PVC Conduit Pipe Grey 25mm",
        description: "Medium thickness grey PVC pipe roll for wall carvings and internal ceiling electrical networks.",
        basePrice: 95,
        salePrice: 75,
        images: JSON.stringify(["https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=600&q=80"]),
        category: "conduits",
        tags: "pvc,pipe,conduit,medium",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Rigid Steel Conduit Pipe Galvanized 20mm",
        description: "Heavy-duty hot-dipped galvanized steel electrical metallic tubing (EMT) pipe for absolute structural safety.",
        basePrice: 680,
        salePrice: 560,
        images: JSON.stringify(["https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&q=80"]),
        category: "conduits",
        tags: "steel,conduit,emt,pipe,rigid",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },

      // --- Category 6: anchor (Anchor) ---
      {
        name: "Anchor Roma Premium Modular Switch Plate",
        description: "Modern, screwless, high-gloss white modular switch cover plate. Sleek profile with chrome borders.",
        basePrice: 380,
        salePrice: 310,
        images: JSON.stringify(["/images/anchor_category.png"]),
        category: "anchor",
        tags: "switchplate,modular,anchor,roma",
        isFeatured: true,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Anchor Roma 1-Way Modular Switch 16A",
        description: "Roma series heavy switch designed for powering geysers, air conditioners, and kitchen appliances.",
        basePrice: 140,
        salePrice: 110,
        images: JSON.stringify(["/images/switches_category.png"]),
        category: "anchor",
        tags: "switch,modular,anchor,roma,16a",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Anchor Roma 3-Pin Shuttered Socket 6A",
        description: "Standard shuttered home modular socket. Made of high impact flame retardant polycarbonate body.",
        basePrice: 160,
        salePrice: 125,
        images: JSON.stringify(["https://images.unsplash.com/photo-1606206591513-ad60137d478a?w=600&q=80"]),
        category: "anchor",
        tags: "socket,modular,anchor,roma",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Anchor Rider 1-Way Modular Switch 6A",
        description: "Affordable and classic white modular switch. High mechanical lifetime and smooth click action.",
        basePrice: 45,
        salePrice: 35,
        images: JSON.stringify(["https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&q=80"]),
        category: "anchor",
        tags: "switch,modular,anchor,rider",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },

      // --- Category 7: polycab-wires (Polycab Wires) ---
      {
        name: "Polycab Super FR PVC Insulated Copper Wire",
        description: "Super Flame Retardant multi-strand copper wiring with dual layer insulation for extreme B2B projects.",
        basePrice: 2400,
        salePrice: 2050,
        images: JSON.stringify(["/images/polycab_wires_category.jpg"]),
        category: "polycab-wires",
        tags: "wires,fr,polycab,copper,safety",
        isFeatured: true,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Polycab FRLS Industrial Multi Strand Wire",
        description: "Industrial grade low smoke halogen free wiring reels. Highest conductivity index and heat safety.",
        basePrice: 3100,
        salePrice: 2650,
        images: JSON.stringify(["https://images.unsplash.com/photo-1595185340989-1065c71c4598?w=600&q=80"]),
        category: "polycab-wires",
        tags: "wires,frls,polycab,industrial,wiring",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Polycab 2-Core Flat Twin Sheathed Cable",
        description: "Double insulated flat wiring cable for direct-run applications and residential wall surface setups.",
        basePrice: 2600,
        salePrice: 2150,
        images: JSON.stringify(["/images/cables_category.png"]),
        category: "polycab-wires",
        tags: "wires,cable,polycab,flat,2core",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Polycab Single Core Flexible Copper Cable",
        description: "Ultra-flexible single core multi-strand copper wire roll for control panels and dynamic power layout runs.",
        basePrice: 4200,
        salePrice: 3550,
        images: JSON.stringify(["https://images.unsplash.com/photo-1601524909162-be87252be298?w=600&q=80"]),
        category: "polycab-wires",
        tags: "wires,flexible,polycab,copper,singlecore",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },

      // --- Category 8: fittings (Fitting Accessories) ---
      {
        name: "Heavy Duty Nylon Cable Ties (100 Pack)",
        description: "Self-locking UV resistant white nylon ties. Heavy load rating, ideal for bunching conduits and cables.",
        basePrice: 150,
        salePrice: 120,
        images: JSON.stringify(["/images/fitting_accesories_category.jpg"]),
        category: "fittings",
        tags: "cabletie,nylon,fittings,zip",
        isFeatured: true,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Brass Double Compression Cable Gland 25mm",
        description: "Double compression glands for armored cables, ensuring absolute waterproofing and steel wire grounding.",
        basePrice: 450,
        salePrice: 380,
        images: JSON.stringify(["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80"]),
        category: "fittings",
        tags: "gland,brass,fittings,compression",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },
      {
        name: "Copper Ring Terminal Lugs (50 Pack)",
        description: "Heavy gauge tinned copper ring terminal wire connectors for clean and safe bolt-on cable terminations.",
        basePrice: 350,
        salePrice: 280,
        images: JSON.stringify(["https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=600&q=80"]),
        category: "fittings",
        tags: "lugs,ring,copper,terminal,fittings",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },
      {
        name: "PVC Junction Box 4-Way Round",
        description: "Circular PVC terminal junction box with cover plates for multi-directional wire routing branches.",
        basePrice: 80,
        salePrice: 60,
        images: JSON.stringify(["https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&q=80"]),
        category: "fittings",
        tags: "box,junction,pvc,fittings",
        isFeatured: false,
        createdAt: new Date().toISOString(),
      },
    ]).returning();

    // 4. Seeding Product Variations
    console.log("Seeding Product Variations...");
    const variationsToInsert = [];

    for (const prod of productList) {
      if (prod.category === "wires" || prod.category === "polycab-wires") {
        variationsToInsert.push(
          { productId: prod.id, size: "1.0 sq mm - Red (90m)", stock: 100, mrp: prod.basePrice, salePrice: prod.salePrice, sku: `${prod.name.substring(0,2).toUpperCase()}-10-R` },
          { productId: prod.id, size: "2.5 sq mm - Blue (90m)", stock: 80, mrp: Math.round(prod.basePrice * 1.5), salePrice: Math.round(prod.salePrice * 1.5), sku: `${prod.name.substring(0,2).toUpperCase()}-25-B` }
        );
      } else if (prod.category === "cables") {
        variationsToInsert.push(
          { productId: prod.id, size: "4 Core 6 sq mm (100m)", stock: 25, mrp: prod.basePrice, salePrice: prod.salePrice, sku: `${prod.name.substring(0,2).toUpperCase()}-04-06` },
          { productId: prod.id, size: "4 Core 16 sq mm (100m)", stock: 10, mrp: Math.round(prod.basePrice * 2.1), salePrice: Math.round(prod.salePrice * 2.1), sku: `${prod.name.substring(0,2).toUpperCase()}-04-16` }
        );
      } else if (prod.category === "switches" || prod.category === "anchor") {
        variationsToInsert.push(
          { productId: prod.id, size: "Standard 6A (White)", stock: 200, mrp: prod.basePrice, salePrice: prod.salePrice, sku: `${prod.name.substring(0,2).toUpperCase()}-06-W` },
          { productId: prod.id, size: "Standard 16A (Ivory)", stock: 150, mrp: Math.round(prod.basePrice * 1.3), salePrice: Math.round(prod.salePrice * 1.3), sku: `${prod.name.substring(0,2).toUpperCase()}-16-I` }
        );
      } else if (prod.category === "mcb-db") {
        variationsToInsert.push(
          { productId: prod.id, size: "SP 16A Curve C", stock: 120, mrp: prod.basePrice, salePrice: prod.salePrice, sku: `${prod.name.substring(0,2).toUpperCase()}-16-C` },
          { productId: prod.id, size: "SP 32A Curve C", stock: 90, mrp: Math.round(prod.basePrice * 1.2), salePrice: Math.round(prod.salePrice * 1.2), sku: `${prod.name.substring(0,2).toUpperCase()}-32-C` }
        );
      } else if (prod.category === "conduits") {
        variationsToInsert.push(
          { productId: prod.id, size: "20mm (3 Meter Length)", stock: 300, mrp: prod.basePrice, salePrice: prod.salePrice, sku: `${prod.name.substring(0,2).toUpperCase()}-20` },
          { productId: prod.id, size: "25mm (3 Meter Length)", stock: 250, mrp: Math.round(prod.basePrice * 1.2), salePrice: Math.round(prod.salePrice * 1.2), sku: `${prod.name.substring(0,2).toUpperCase()}-25` }
        );
      } else if (prod.category === "fittings") {
        variationsToInsert.push(
          { productId: prod.id, size: "Standard Pack (100 units)", stock: 100, mrp: prod.basePrice, salePrice: prod.salePrice, sku: `${prod.name.substring(0,2).toUpperCase()}-SP` }
        );
      }
    }

    await db.insert(productVariations).values(variationsToInsert);

    // 5. Seeding Page Sections (Exactly 4 products for each of the 8 grid sections)
    console.log("Seeding Page Sections...");
    const pageSectionsToInsert = [];

    const linkCategoryToSection = (label: string, title: string, categoryName: string, order: number) => {
      const menuId = menuMap[label];
      const productsOfCategory = productList.filter(p => p.category === categoryName);
      if (menuId && productsOfCategory.length > 0) {
        // Take exactly 4 products
        const selectProducts = productsOfCategory.slice(0, 4);
        pageSectionsToInsert.push({
          menuId,
          title,
          productIds: selectProducts.map(p => p.id).join(","),
          displayOrder: order
        });
        console.log(`Linked ${selectProducts.length} products to section: "${title}"`);
      }
    };

    linkCategoryToSection("Electrical Wires", "Premium Wiring Solutions", "wires", 1);
    linkCategoryToSection("Electrical Cables", "Armoured & Control Cables", "cables", 2);
    linkCategoryToSection("Switches & Modular", "Modular Switches & Plates", "switches", 3);
    linkCategoryToSection("MCBs & DBs", "Distribution Boards & Protection MCBs", "mcb-db", 4);
    linkCategoryToSection("Electrical Pipes", "Rigid PVC & Metallic Conduits", "conduits", 5);
    linkCategoryToSection("Anchor", "Anchor Products", "anchor", 6);
    linkCategoryToSection("Polycab Wires", "Polycab Wires Collection", "polycab-wires", 7);
    linkCategoryToSection("Fitting Accessories", "Cable Ties, Lugs & Glands", "fittings", 8);

    await db.insert(pageSections).values(pageSectionsToInsert);

    console.log("Sync Complete! 32 products successfully seeded and linked (4 products per category section).");

  } catch (err) {
    console.error("Database sync failed:", err);
  }
}

main().catch(console.error);
