import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/adminAuth";
import { listQuestions, saveAnswer } from "@/lib/qaMatch";
import { isTursoConfigured } from "@/lib/turso";

async function assertAdmin() {
  const jar = await cookies();
  return isValidAdminToken(jar.get(ADMIN_COOKIE)?.value);
}

export async function GET() {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isTursoConfigured()) {
    return NextResponse.json({
      pending: [],
      answered: [],
      configured: false,
    });
  }

  const data = await listQuestions();
  return NextResponse.json({ ...data, configured: true });
}

export async function PATCH(req: Request) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { id?: string; answer?: string };
  if (!body.id || !body.answer?.trim()) {
    return NextResponse.json({ error: "Нужны id и answer" }, { status: 400 });
  }

  await saveAnswer(body.id, body.answer);
  return NextResponse.json({ ok: true });
}
