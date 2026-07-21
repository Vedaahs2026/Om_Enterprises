import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories, brands, brandLengths, brandModels, brandVariations } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryName = searchParams.get("category");

    // 1. Fetch Categories
    const allCategories = await db.select().from(categories).orderBy(asc(categories.displayOrder));

    // 2. Fetch Brands
    const allBrands = await db
      .select()
      .from(brands)
      .where(categoryName ? eq(brands.category, categoryName) : undefined)
      .orderBy(asc(brands.displayOrder));

    // 3. Fetch Brand Lengths
    const allLengths = await db.select().from(brandLengths).orderBy(asc(brandLengths.lengthInMeters));

    // 4. Fetch Brand Models
    const allModels = await db.select().from(brandModels).orderBy(asc(brandModels.name));

    // 5. Fetch Variations
    const allVariations = await db.select().from(brandVariations).orderBy(asc(brandVariations.thickness));

    // Nest the data hierarchically
    const nestedBrands = allBrands.map((b) => {
      const lengths = allLengths
        .filter((l) => l.brandId === b.id)
        .map((l) => {
          const models = allModels
            .filter((m) => m.brandLengthId === l.id)
            .map((m) => {
              const variations = allVariations.filter((v) => v.modelId === m.id);
              return { ...m, variations };
            });
          return { ...l, models };
        });
      return { ...b, lengths };
    });

    return NextResponse.json({
      success: true,
      categories: allCategories,
      catalog: nestedBrands,
    });
  } catch (error: any) {
    console.error("Error fetching master catalog:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch master catalog" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type } = body;

    if (type === "brand") {
      const { name, category, imageUrl } = body;
      if (!name || !category) {
        return NextResponse.json({ error: "Brand name and Category are required" }, { status: 400 });
      }
      const [inserted] = await db
        .insert(brands)
        .values({
          name: name.trim(),
          category: category.trim(),
          imageUrl: imageUrl || null,
        })
        .returning();
      return NextResponse.json({ success: true, data: inserted });
    }

    if (type === "length") {
      const { brandId, lengthInMeters } = body;
      if (!brandId || !lengthInMeters || isNaN(Number(lengthInMeters))) {
        return NextResponse.json({ error: "Brand and valid length in meters are required" }, { status: 400 });
      }
      const [inserted] = await db
        .insert(brandLengths)
        .values({
          brandId: Number(brandId),
          lengthInMeters: Number(lengthInMeters),
        })
        .returning();
      return NextResponse.json({ success: true, data: inserted });
    }

    if (type === "model") {
      const { brandLengthId, name, description } = body;
      if (!brandLengthId || !name) {
        return NextResponse.json({ error: "Length selection and Model Name are required" }, { status: 400 });
      }
      const [inserted] = await db
        .insert(brandModels)
        .values({
          brandLengthId: Number(brandLengthId),
          name: name.trim(),
          description: description || null,
        })
        .returning();
      return NextResponse.json({ success: true, data: inserted });
    }

    if (type === "variation") {
      const { modelId, thickness, colors, price, salePrice, stock } = body;
      if (!modelId || !thickness || price === undefined || isNaN(Number(price))) {
        return NextResponse.json({ error: "Model, Thickness, and Price are required" }, { status: 400 });
      }
      const [inserted] = await db
        .insert(brandVariations)
        .values({
          modelId: Number(modelId),
          thickness: thickness.trim(),
          colors: Array.isArray(colors) ? JSON.stringify(colors) : (colors || "[]"),
          price: Number(price),
          salePrice: salePrice ? Number(salePrice) : null,
          stock: stock ? Number(stock) : 100,
        })
        .returning();
      return NextResponse.json({ success: true, data: inserted });
    }

    return NextResponse.json({ error: "Invalid entity type" }, { status: 400 });
  } catch (error: any) {
    console.error("Error creating catalog item:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to create item" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    if (!type || !id) {
      return NextResponse.json({ error: "Type and ID are required" }, { status: 400 });
    }

    const numId = Number(id);

    if (type === "brand") {
      await db.delete(brands).where(eq(brands.id, numId));
    } else if (type === "length") {
      await db.delete(brandLengths).where(eq(brandLengths.id, numId));
    } else if (type === "model") {
      await db.delete(brandModels).where(eq(brandModels.id, numId));
    } else if (type === "variation") {
      await db.delete(brandVariations).where(eq(brandVariations.id, numId));
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting catalog item:", error);
    return NextResponse.json({ success: false, error: "Failed to delete item" }, { status: 500 });
  }
}
