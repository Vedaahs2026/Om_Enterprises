import { NextResponse } from "next/server";
import { db } from "@/db";
import { brandLengths, brands } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const list = await db
      .select({
        id: brandLengths.id,
        brandId: brandLengths.brandId,
        lengthInMeters: brandLengths.lengthInMeters,
        isActive: brandLengths.isActive,
        createdAt: brandLengths.createdAt,
        brandName: brands.name,
        brandCategory: brands.category,
        brandImageUrl: brands.imageUrl,
      })
      .from(brandLengths)
      .leftJoin(brands, eq(brandLengths.brandId, brands.id))
      .orderBy(desc(brandLengths.id));

    return NextResponse.json(list);
  } catch (error: any) {
    console.error("Error fetching brand lengths:", error);
    return NextResponse.json({ error: "Failed to fetch brand lengths" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { brandId, lengthInMeters, isActive } = body;

    if (!brandId || lengthInMeters === undefined || lengthInMeters === null || isNaN(Number(lengthInMeters))) {
      return NextResponse.json({ error: "Brand and valid length in meters are required" }, { status: 400 });
    }

    const [inserted] = await db
      .insert(brandLengths)
      .values({
        brandId: Number(brandId),
        lengthInMeters: Number(lengthInMeters),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      })
      .returning();

    return NextResponse.json(inserted);
  } catch (error: any) {
    console.error("Error creating brand length:", error);
    return NextResponse.json({ error: "Failed to create brand length" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, brandId, lengthInMeters, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (brandId !== undefined) updateData.brandId = Number(brandId);
    if (lengthInMeters !== undefined) updateData.lengthInMeters = Number(lengthInMeters);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const [updated] = await db
      .update(brandLengths)
      .set(updateData)
      .where(eq(brandLengths.id, Number(id)))
      .returning();

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating brand length:", error);
    return NextResponse.json({ error: "Failed to update brand length" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID parameter is required" }, { status: 400 });
    }

    await db.delete(brandLengths).where(eq(brandLengths.id, Number(id)));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting brand length:", error);
    return NextResponse.json({ error: "Failed to delete brand length" }, { status: 500 });
  }
}
