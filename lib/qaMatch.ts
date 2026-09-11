import { compareTwoStrings } from "string-similarity";
import type { QAEntry } from "@/types/chat.types";
import { ensureQuestionsTable, getTurso, isTursoConfigured } from "@/lib/turso";

export const SIMILARITY_THRESHOLD = 0.6;

export function normalizeQuestion(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mapRow(row: Record<string, unknown>): QAEntry {
  return {
    id: String(row.id),
    question: String(row.question),
    normalized_question: String(row.normalized_question),
    answer: row.answer == null ? null : String(row.answer),
    status: row.status === "answered" ? "answered" : "pending",
    asked_count: Number(row.asked_count ?? 1),
    created_at: String(row.created_at),
    answered_at: row.answered_at == null ? null : String(row.answered_at),
  };
}

export async function findAnswer(question: string): Promise<string | null> {
  if (!isTursoConfigured()) return null;

  await ensureQuestionsTable();
  const db = getTurso();
  if (!db) return null;

  const result = await db.execute(
    "select * from questions where status = 'answered'",
  );
  const normalized = normalizeQuestion(question);
  let best: { score: number; answer: string } | null = null;

  for (const raw of result.rows) {
    const entry = mapRow(raw as unknown as Record<string, unknown>);
    if (!entry.answer) continue;
    const score = compareTwoStrings(normalized, entry.normalized_question);
    if (score >= SIMILARITY_THRESHOLD && (!best || score > best.score)) {
      best = { score, answer: entry.answer };
    }
  }

  return best?.answer ?? null;
}

/** Увеличивает asked_count у похожего вопроса или создаёт pending-запись */
export async function trackUnansweredQuestion(question: string) {
  if (!isTursoConfigured()) return;

  await ensureQuestionsTable();
  const db = getTurso();
  if (!db) return;

  const normalized = normalizeQuestion(question);
  const result = await db.execute("select * from questions");
  let matched: QAEntry | null = null;
  let bestScore = 0;

  for (const raw of result.rows) {
    const entry = mapRow(raw as unknown as Record<string, unknown>);
    const score = compareTwoStrings(normalized, entry.normalized_question);
    if (score >= SIMILARITY_THRESHOLD && score > bestScore) {
      bestScore = score;
      matched = entry;
    }
  }

  if (matched) {
    await db.execute({
      sql: "update questions set asked_count = asked_count + 1 where id = ?",
      args: [matched.id],
    });
    return;
  }

  await db.execute({
    sql: `insert into questions
      (id, question, normalized_question, answer, status, asked_count, created_at, answered_at)
      values (?, ?, ?, null, 'pending', 1, ?, null)`,
    args: [crypto.randomUUID(), question.trim(), normalized, new Date().toISOString()],
  });
}

export async function listQuestions() {
  if (!isTursoConfigured()) {
    return { pending: [] as QAEntry[], answered: [] as QAEntry[] };
  }

  await ensureQuestionsTable();
  const db = getTurso();
  if (!db) return { pending: [], answered: [] };

  const result = await db.execute("select * from questions");
  const all = result.rows.map((row) =>
    mapRow(row as unknown as Record<string, unknown>),
  );

  const pending = all
    .filter((item) => item.status === "pending")
    .sort((a, b) => b.asked_count - a.asked_count);
  const answered = all
    .filter((item) => item.status === "answered")
    .sort((a, b) => (b.answered_at ?? "").localeCompare(a.answered_at ?? ""));

  return { pending, answered };
}

/** Сохраняет ответ Gemini как готовый ответ на вопрос (или обновляет существующую запись) */
export async function saveAnswerForQuestion(question: string, answer: string) {
  if (!isTursoConfigured()) return;

  await ensureQuestionsTable();
  const db = getTurso();
  if (!db) return;

  const normalized = normalizeQuestion(question);
  const result = await db.execute("select * from questions");
  let matched: QAEntry | null = null;
  let bestScore = 0;

  for (const raw of result.rows) {
    const entry = mapRow(raw as unknown as Record<string, unknown>);
    const score = compareTwoStrings(normalized, entry.normalized_question);
    if (score >= SIMILARITY_THRESHOLD && score > bestScore) {
      bestScore = score;
      matched = entry;
    }
  }

  const now = new Date().toISOString();
  const cleanAnswer = answer.trim();

  if (matched) {
    await db.execute({
      sql: `update questions
        set answer = ?, status = 'answered', asked_count = asked_count + 1, answered_at = ?
        where id = ?`,
      args: [cleanAnswer, now, matched.id],
    });
    return;
  }

  await db.execute({
    sql: `insert into questions
      (id, question, normalized_question, answer, status, asked_count, created_at, answered_at)
      values (?, ?, ?, ?, 'answered', 1, ?, ?)`,
    args: [
      crypto.randomUUID(),
      question.trim(),
      normalized,
      cleanAnswer,
      now,
      now,
    ],
  });
}

export async function saveAnswer(id: string, answer: string) {
  if (!isTursoConfigured()) {
    throw new Error("Turso не настроен");
  }

  await ensureQuestionsTable();
  const db = getTurso();
  if (!db) throw new Error("Turso не настроен");

  await db.execute({
    sql: `update questions
      set answer = ?, status = 'answered', answered_at = ?
      where id = ?`,
    args: [answer.trim(), new Date().toISOString(), id],
  });
}
