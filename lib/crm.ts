import { getTurso, isTursoConfigured } from "@/lib/turso";

export type CRMLead = {
  name: string;
  contact: string;
  subject?: string;
  message: string;
  source?: string;
};

export async function ensureLeadsTable() {
  const db = getTurso();
  if (!db) return;

  await db.execute(`
    create table if not exists leads (
      id text primary key,
      name text not null,
      contact text not null,
      subject text,
      message text not null,
      source text default 'website_feedback',
      status text default 'new',
      created_at text not null
    )
  `);

  // Также создадим requests/orders таблицу, если CRM использует requests
  await db.execute(`
    create table if not exists requests (
      id text primary key,
      name text,
      contact text,
      details text,
      status text default 'new',
      created_at text not null
    )
  `);
}

export async function saveFeedbackToCRM(lead: CRMLead): Promise<boolean> {
  let saved = false;

  // 1. Отправка в CRM через публичный webhook-эндпоинт
  const crmUrl = (process.env.CRM_API_URL || "https://hotel-ai-1500.vercel.app").replace(/\/$/, "");
  const crmToken = process.env.CRM_API_TOKEN;

  try {
    const res = await fetch(`${crmUrl}/api/webhook/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(crmToken ? { Authorization: `Bearer ${crmToken}` } : {}),
      },
      body: JSON.stringify({
        name: lead.name,
        contact: lead.contact,
        subject: lead.subject,
        message: lead.message,
        source: lead.source || "website_form",
      }),
    });

    if (res.ok) {
      saved = true;
    } else {
      const text = await res.text().catch(() => "");
      console.warn(`CRM webhook responded ${res.status}:`, text);
    }
  } catch (err) {
    console.warn("Could not post lead to CRM webhook:", err);
  }

  // 2. Гарантированное сохранение в общую базу данных Turso
  if (isTursoConfigured()) {
    try {
      await ensureLeadsTable();
      const db = getTurso();
      if (db) {
        const id = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const now = new Date().toISOString();
        
        await db.execute({
          sql: `insert into leads (id, name, contact, subject, message, source, status, created_at)
                values (?, ?, ?, ?, ?, ?, 'new', ?)`,
          args: [
            id,
            lead.name,
            lead.contact,
            lead.subject ?? null,
            lead.message,
            lead.source ?? "website_feedback",
            now,
          ],
        });

        // Также дублируем в requests для совместимости
        await db.execute({
          sql: `insert into requests (id, name, contact, details, status, created_at)
                values (?, ?, ?, ?, 'new', ?)`,
          args: [
            id,
            lead.name,
            lead.contact,
            `Тема: ${lead.subject ?? "—"}\n${lead.message}`,
            now,
          ],
        });

        saved = true;
      }
    } catch (dbErr) {
      console.error("Error saving lead into Turso CRM database:", dbErr);
    }
  }

  return saved;
}
