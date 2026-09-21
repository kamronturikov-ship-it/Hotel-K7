"use client";

import { FormEvent, useState } from "react";
import { hotelMeta } from "@/lib/hotel";

export function Feedback() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [subject, setSubject] = useState("Бронирование и пожелания");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, subject, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Не удалось отправить сообщение");
      }

      setStatus({
        type: "success",
        text: data.message || "Спасибо! Ваше сообщение успешно передано в службу заботы Vespera.",
      });
      setName("");
      setContact("");
      setMessage("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Произошла непредвиденная ошибка";
      setStatus({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="feedback-section" id="feedback" aria-labelledby="feedback-title">
      <div className="feedback-container reveal">
        <div className="feedback-header">
          <p className="eyebrow">Прямая связь с отелем</p>
          <h2 id="feedback-title" className="display">
            Напишите нам в Telegram
          </h2>
          <p className="feedback-desc">
            Есть особые пожелания к номеру, вопросы по трансферу или хотите заказать персональный ужин?
            Заполните форму ниже — ваше обращение моментально придёт администратору в Telegram-бот.
          </p>

          <div className="feedback-contacts">
            <div className="feedback-contact-item">
              <span className="feedback-contact-label">Телефон</span>
              <a href={hotelMeta.phoneHref} className="feedback-contact-val">
                {hotelMeta.phone}
              </a>
            </div>
            <div className="feedback-contact-item">
              <span className="feedback-contact-label">Email</span>
              <a href={`mailto:${hotelMeta.email}`} className="feedback-contact-val">
                {hotelMeta.email}
              </a>
            </div>
            <div className="feedback-contact-item">
              <span className="feedback-contact-label">Адрес</span>
              <span className="feedback-contact-val">{hotelMeta.address}</span>
            </div>
          </div>
        </div>

        <div className="feedback-card">
          <div className="feedback-card__badge">
            <span className="feedback-card__pulse" />
            <span>Мгновенная доставка в Telegram</span>
          </div>

          <form className="feedback-form" onSubmit={handleSubmit}>
            <div className="feedback-row">
              <label className="feedback-field">
                <span>Ваше имя *</span>
                <input
                  type="text"
                  required
                  placeholder="Константин"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </label>

              <label className="feedback-field">
                <span>Телефон или Telegram *</span>
                <input
                  type="text"
                  required
                  placeholder="+7 (999) 000-00-00 или @username"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  disabled={loading}
                />
              </label>
            </div>

            <label className="feedback-field">
              <span>Тема обращения</span>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={loading}
              >
                <option value="Бронирование и пожелания">Бронирование и пожелания</option>
                <option value="Индивидуальный трансфер">Индивидуальный трансфер</option>
                <option value="Спа и оздоровительные ритуалы">Спа и оздоровительные ритуалы</option>
                <option value="Ресторан на крыше и меню">Ресторан на крыше и меню</option>
                <option value="Организация приватного события">Организация приватного события</option>
                <option value="Другой вопрос">Другой вопрос</option>
              </select>
            </label>

            <label className="feedback-field">
              <span>Ваше сообщение *</span>
              <textarea
                required
                rows={4}
                placeholder="Расскажите о ваших пожеланиях, датах визита или задайте любой вопрос..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
              />
            </label>

            {status && (
              <div className={`feedback-alert feedback-alert--${status.type}`}>
                {status.type === "success" ? "✓ " : "✕ "}
                {status.text}
              </div>
            )}

            <button
              type="submit"
              className="btn btn--primary feedback-submit"
              disabled={loading}
            >
              {loading ? "Отправляем в Telegram..." : "Отправить сообщение в Telegram"}
            </button>
            <p className="feedback-privacy">
              Нажимая кнопку, вы соглашаетесь на обработку персональных данных. Администратор ответит вам в течение нескольких минут.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
