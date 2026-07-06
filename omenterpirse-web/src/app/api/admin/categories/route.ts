import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
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
    
    if (showAll && !await isAdmin()) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const items = await db.select()
      .from(categories)
      .where(!showAll ? eq(categories.isActive, true) : undefined)
      .orderBy(asc(categories.displayOrder));
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("Fetch Categories Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!await isAdmin()) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const result = await db.insert(categories).values({
      name: body.name,
      slug,
      imageUrl: body.imageUrl || null,
      displayOrder: body.displayOrder || 0,
      isActive: body.isActive !== undefined ? body.isActive : true,
      tagline: body.tagline || null,
    }).returning();
    
    return NextResponse.json({ success: true, data: result[0] });
  } catch (error: any) {
    console.error("Create Category Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to create category" }, { status: 400 });
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
        await db.update(categories)
          .set({ displayOrder: item.displayOrder })
          .where(eq(categories.id, item.id));
      }
      return NextResponse.json({ success: true });
    } else {
      const { id, ...updates } = body;
      if (updates.name && !updates.slug) {
        updates.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }
      
      const result = await db.update(categories)
        .set(updates)
        .where(eq(categories.id, id))
        .returning();

      if (result.length > 0) {
        return NextResponse.json({ success: true, data: result[0] });
      }
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
  } catch (error: any) {
    console.error("Update Category Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to update category" }, { status: 400 });
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
    
    await db.delete(categories).where(eq(categories.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Category Error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete category" }, { status: 400 });
  } finally {
    revalidatePath("/", "layout");
  }
}
