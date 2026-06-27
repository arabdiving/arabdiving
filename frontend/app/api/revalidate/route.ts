import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * POST /api/revalidate
 * Called by admin pages after saving any setting that affects the homepage.
 * Immediately clears the Next.js ISR cache for the homepage so changes appear instantly.
 */
export async function POST() {
  try {
    revalidatePath("/");          // home page
    revalidatePath("/dive-sites"); // dive sites listing
    return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
  } catch (err: any) {
    return NextResponse.json({ revalidated: false, error: err.message }, { status: 500 });
  }
}
