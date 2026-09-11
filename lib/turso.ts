import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;

export function isTursoConfigured() {
  return Boolean(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);
}

export function getTurso() {
  if (!isTursoConfigured()) {
    return null;
  }

  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
  }

  return client;
}

export async function ensureQuestionsTable() {
  const db = getTurso();
  if (!db) return;

  await db.execute(`
    create table if not exists questions (
      id text primary key,
      question text not null,
      normalized_question text not null,
      answer text,
      status text not null default 'pending',
      asked_count integer not null default 1,
      created_at text not null,
      answered_at text
    )
  `);
}
