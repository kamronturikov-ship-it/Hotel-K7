import { NextResponse } from "next/server";
import {
  adminCookieOptions,
  ADMIN_COOKIE,
  createAdminToken,
  getAdminPassword,
} from "@/lib/adminAuth";

export async function POST(req: Request) {
  const body = (await req.json()) as { password?: string };
  const password = body.password ?? "";
  const expected = getAdminPassword();

  if (!expected || password !== expected) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, await createAdminToken(), adminCookieOptions());
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", { ...adminCookieOptions(), maxAge: 0 });
  return response;
}
