import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { SiteContentModel } from "@/lib/models";
import { getSiteContent } from "@/lib/content";

async function isAdmin() {
  const c = await cookies();
  return c.get("bv_admin")?.value === "1";
}

// In-memory fallback for demo mode.
const demo = globalThis as unknown as { _demoContent?: Record<string, unknown> };

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json({ ok: true, content });
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const data = body?.data ?? body;

    const conn = await connectDB();
    if (conn) {
      await SiteContentModel.findOneAndUpdate(
        { key: "main" },
        { key: "main", data },
        { upsert: true, new: true }
      );
      return NextResponse.json({ ok: true, persisted: true });
    }
    demo._demoContent = data;
    return NextResponse.json({ ok: true, persisted: false });
  } catch (err) {
    console.error("[api/content] PUT error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
