import { NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "bellavita";

export async function POST(req: Request) {
  const { password } = await req.json();
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: "Incorrect password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("bv_admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12, // 12h
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("bv_admin", "", { path: "/", maxAge: 0 });
  return res;
}
