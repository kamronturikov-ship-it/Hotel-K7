"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { QAEntry } from "@/types/chat.types";

function AnswerForm({
  item,
  onSaved,
}: {
  item: QAEntry;
  onSaved: () => void;
}) {
  const [answer, setAnswer] = useState(item.answer ?? "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const response = await fetch("/api/admin/questions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, answer }),
    });

    setPending(false);

    if (!response.ok) {
      setError("Не удалось сохранить");
      return;
    }

    onSaved();
  }

  return (
    <form className="admin-qa-form" onSubmit={onSubmit}>
      <textarea
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        rows={3}
        required
        placeholder="Ответ для гостей"
      />
      {error ? <p className="admin-login__error">{error}</p> : null}
      <button className="btn btn--primary" type="submit" disabled={pending || !answer.trim()}>
        {pending ? "Сохраняем…" : "Сохранить"}
      </button>
    </form>
  );
}

type AdminDashboardProps = {
  configured: boolean;
  pending: QAEntry[];
  answered: QAEntry[];
};

export function AdminDashboard({
  configured,
  pending,
  answered,
}: AdminDashboardProps) {
  const router = useRouter();

  return (
    <section className="admin-panel">
      <p className="eyebrow">База знаний</p>
      <h1 className="display">Вопросы гостей</h1>
      <p className="section-lead">
        Сначала отвечайте на частые pending-вопросы — бот начнёт использовать ваши
        формулировки вместо Gemini.
      </p>

      {!configured ? (
        <div className="admin-card" style={{ marginTop: "1.5rem" }}>
          <h2>Turso не подключён</h2>
          <p>
            Добавьте `TURSO_DATABASE_URL` и `TURSO_AUTH_TOKEN` в `.env.local`. Таблица
            `questions` создастся автоматически при первом запросе.
          </p>
        </div>
      ) : null}

      {configured ? (
        <>
          <h2 className="admin-section-title">Без ответа</h2>
          {pending.length === 0 ? (
            <p className="section-lead">Пока нет неотвеченных вопросов.</p>
          ) : (
            <ul className="admin-qa-list">
              {pending.map((item) => (
                <li key={item.id} className="admin-card">
                  <p className="admin-qa-question">{item.question}</p>
                  <p className="admin-qa-meta">Спросили {item.asked_count} раз</p>
                  <AnswerForm item={item} onSaved={() => router.refresh()} />
                </li>
              ))}
            </ul>
          )}

          <h2 className="admin-section-title">Уже отвечены</h2>
          {answered.length === 0 ? (
            <p className="section-lead">Отвеченных записей пока нет.</p>
          ) : (
            <ul className="admin-qa-list">
              {answered.map((item) => (
                <li key={item.id} className="admin-card">
                  <p className="admin-qa-question">{item.question}</p>
                  <p className="admin-qa-meta">Спросили {item.asked_count} раз</p>
                  <p className="admin-qa-answer">{item.answer}</p>
                  <details>
                    <summary>Редактировать ответ</summary>
                    <p className="section-lead" style={{ marginTop: "0.5rem" }}>
                      Изменения сразу вернутся гостям при следующем похожем вопросе.
                    </p>
                    <AnswerForm item={item} onSaved={() => router.refresh()} />
                  </details>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}
    </section>
  );
}
