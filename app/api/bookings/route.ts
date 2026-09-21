import { NextResponse } from "next/server";
import { bookingRequestSchema } from "@/lib/validations/booking";
import { sendTelegramMessage } from "@/lib/telegram";

function guestsLabel(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} гость`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} гостя`;
  }
  return `${count} гостей`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = bookingRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Некорректные данные бронирования" },
        { status: 400 },
      );
    }

    const { checkIn, checkOut, guests } = parsed.data;

    // Notify administrator in Telegram (non-blocking failure)
    try {
      const tgText = [
        `🛎 <b>Новое бронирование (Vespera)</b>\n`,
        `📅 <b>Даты:</b> ${checkIn} → ${checkOut}`,
        `👥 <b>Гости:</b> ${guestsLabel(guests)}`,
        `⏱ <i>Время: ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })} (МСК)</i>`,
      ].join("\n");
      await sendTelegramMessage(tgText);
    } catch (e) {
      console.error("Failed to notify Telegram on booking:", e);
    }

    return NextResponse.json({
      ok: true,
      booking: { checkIn, checkOut, guests, status: "PENDING" },
      message: `Заявка принята: ${checkIn} → ${checkOut} · ${guestsLabel(guests)}. Консьерж подтвердит доступность в ближайшее время.`,
    });
  } catch {
    return NextResponse.json({ error: "Не удалось обработать заявку" }, { status: 500 });
  }
}
