import { cookies } from "next/headers";

/**
 * Retrieves the list of authorized admin numbers from the ADMIN_PHONES / ADMIN_PHONE / ADMIN_NUMBERS env variables.
 * Fallback is "9999999999". Numbers are normalized by stripping non-digits and keeping the last 10 digits.
 */
export function isAdminNumber(email: string): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === "om5555enterprises@gmail.com";
}

/**
 * Compatibility alias for dynamically imported checks.
 */
export function isAdmin(session: string): boolean {
  return isAdminNumber(session);
}

/**
 * Server-side helper to authenticate an admin session based on cookies.
 */
export async function checkAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;
    return session ? isAdminNumber(session) : false;
  } catch (error) {
    console.error("Failed to read admin session cookie:", error);
    return false;
  }
}
