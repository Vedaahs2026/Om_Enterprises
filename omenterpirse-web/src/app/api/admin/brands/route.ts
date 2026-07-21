import { NextResponse } from "next/server";
import { db } from "@/db";
import { brands } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { isAdminNumber } from "@/lib/admin";

async function isAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  return session ? isAdminNumber(session) : false;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get("all") === "true";
    
    const items = await db.select()
      .from(brands)
      .where(!showAll ? eq(brands.isActive, true) : undefined)
      .orderBy(asc(brands.displayOrder));

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("Fetch Brands Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch brands" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!await isAdmin()) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.name || !body.category) {
      return NextResponse.json({ success: false, error: "Brand Name and Category are required." }, { status: 400 });
    }
    
    const result = await db.insert(brands).values({
      name: body.name.trim(),
      imageUrl: body.imageUrl || null,
      category: body.category.trim(),
      displayOrder: body.displayOrder || 0,
      isActive: body.isActive !== undefined ? body.isActive : true,
    }).returning();
    
    return NextResponse.json({ success: true, data: result[0] });
  } catch (error: any) {
    console.error("Create Brand Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to create brand" }, { status: 400 });
  } finally {
    revalidatePath("/", "layout");
  }
}

export async function PUT(request: Request) {
  if (!await isAdmin()) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    if (Array.isArray(body)) {
      // Bulk update (reordering)
      for (const item of body) {
        await db.update(brands)
          .set({ displayOrder: item.displayOrder })
          .where(eq(brands.id, item.id));
      }
      return NextResponse.json({ success: true });
    } else {
      const { id, ...updates } = body;
      
      const result = await db.update(brands)
        .set(updates)
        .where(eq(brands.id, id))
        .returning();

      if (result.length > 0) {
        return NextResponse.json({ success: true, data: result[0] });
      }
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
  } catch (error: any) {
    console.error("Update Brand Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to update brand" }, { status: 400 });
  } finally {
    revalidatePath("/", "layout");
  }
}

export async function DELETE(request: Request) {
  if (!await isAdmin()) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "0");
    
    await db.delete(brands).where(eq(brands.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Brand Error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete brand" }, { status: 400 });
  } finally {
    revalidatePath("/", "layout");
  }
}
