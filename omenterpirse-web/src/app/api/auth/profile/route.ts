import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const email = cookieStore.get("auth_session")?.value;

    if (!email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, phoneNumber } = body;

    if (!fullName) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    // Update user profile in DB
    await db.update(users)
      .set({ 
        fullName,
        ...(phoneNumber ? { phoneNumber } : {})
      })
      .where(eq(users.email, email));

    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (error: any) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 });
  }
}
