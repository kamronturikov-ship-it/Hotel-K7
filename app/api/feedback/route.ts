import { NextResponse } from "next/server";
import { z } from "zod";
import { sendTelegramMessage } from "@/lib/telegram";
import { saveFeedbackToCRM } from "@/lib/crm";

const feedbackSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя (минимум 2 символа)").max(80),
  contact: z.string().trim().min(3, "Укажите телефон или ник в Telegram").max(100),
  subject: z.string().trim().max(100).optional(),
  message: z.string().trim().min(5, "Сообщение слишком короткое (от 5 символов)").max(2000),
});

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = feedbackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Заполните все обязательные поля" },
        { status: 400 },
      );
    }

    const { name, contact, subject, message } = parsed.data;

    const telegramText = [
      `🔔 <b>Новая заявка / Обратная связь (Vespera)</b>\n`,
      `👤 <b>Имя:</b> ${escapeHtml(name)}`,
      `📱 <b>Контакт:</b> ${escapeHtml(contact)}`,
      subject ? `📌 <b>Тема:</b> ${escapeHtml(subject)}` : null,
      `💬 <b>Сообщение:</b>\n${escapeHtml(message)}\n`,
      `⏱ <i>Время отправки: ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })} (МСК)</i>`,
    ]
      .filter(Boolean)
      .join("\n");

    const sent = await sendTelegramMessage(telegramText);

    // Также записываем в CRM (hotel-one-woad.vercel.app / Turso)
    try {
      await saveFeedbackToCRM({
        name,
        contact,
        subject,
        message,
        source: "hotel_website_feedback",
      });
    } catch (crmError) {
      console.error("Failed to sync lead to CRM:", crmError);
    }

    if (!sent) {
      return NextResponse.json(
        {
          error: "Не удалось доставить сообщение в Telegram. Пожалуйста, позвоните консьержу.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Спасибо! Ваше сообщение отправлено прямо нашему администратору в Telegram и зафиксировано в CRM. Мы свяжемся с вами в ближайшее время.",
    });
  } catch (error) {
    console.error("Feedback API error:", error);
    return NextResponse.json(
      { error: "Произошла ошибка при отправке. Попробуйте позже." },
      { status: 500 },
    );
  }
}
