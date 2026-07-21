import { NextResponse } from "next/server";
import { db } from "@/db";
import { brands, brandLengths, brandModels, brandVariations } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const brandId = Number(id);

    if (isNaN(brandId)) {
      return NextResponse.json({ error: "Invalid brand ID" }, { status: 400 });
    }

    const [brand] = await db
      .select()
      .from(brands)
      .where(eq(brands.id, brandId));

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const lengths = await db
      .select()
      .from(brandLengths)
      .where(and(eq(brandLengths.brandId, brandId), eq(brandLengths.isActive, true)))
      .orderBy(asc(brandLengths.lengthInMeters));

    const lengthIds = lengths.map((l) => l.id);

    let models: any[] = [];
    if (lengthIds.length > 0) {
      models = await db
        .select()
        .from(brandModels)
        .where(eq(brandModels.isActive, true));
    }

    const modelIds = models.map((m) => m.id);

    let variations: any[] = [];
    if (modelIds.length > 0) {
      variations = await db
        .select()
        .from(brandVariations)
        .where(eq(brandVariations.isActive, true));
    }

    const nestedLengths = lengths.map((l) => {
      const lModels = models
        .filter((m) => m.brandLengthId === l.id)
        .map((m) => {
          const mVariations = variations.filter((v) => v.modelId === m.id);
          return { ...m, variations: mVariations };
        });
      return { ...l, models: lModels };
    });

    return NextResponse.json({
      success: true,
      brand,
      lengths: nestedLengths,
    });
  } catch (error: any) {
    console.error("Error fetching brand catalog:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch brand details" },
      { status: 500 }
    );
  }
}
