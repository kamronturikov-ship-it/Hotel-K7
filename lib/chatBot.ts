import { business } from "@/data/business";
import type { BotResponse } from "@/types/chat.types";

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function includesAny(haystack: string, needles: string[]) {
  return needles.some((needle) => haystack.includes(needle));
}

export function getFallbackResponse(): string {
  return business.fallback;
}

export function getBotResponse(input: string): BotResponse {
  const text = normalize(input);

  if (!text) {
    return { text: "Напишите вопрос — например про номера или время заезда.", isFallback: false };
  }

  if (includesAny(text, ["привет", "здравств", "добрый", "hello", "hi"])) {
    return { text: business.welcome, isFallback: false };
  }

  if (includesAny(text, ["час", "работ", "когда открыт", "график", "бронирован"])) {
    return {
      text: `${business.hours}. Заезд с ${business.checkIn}, выезд до ${business.checkOut}. Телефон: ${business.phone}.`,
      isFallback: false,
    };
  }

  if (includesAny(text, ["заезд", "выезд", "check in", "check-out", "поселен"])) {
    return {
      text: `Заезд — с ${business.checkIn}, выезд — до ${business.checkOut}. Ранний заезд возможен с 12:00 при наличии номера.`,
      isFallback: false,
    };
  }

  if (includesAny(text, ["адрес", "где наход", "как добрат", "локац", "парк"])) {
    const parking = business.faqs.find((item) => item.q.toLowerCase().includes("парков"));
    return {
      text: `Мы по адресу: ${business.address}. ${parking?.a ?? ""} Консьерж: ${business.phone}.`,
      isFallback: false,
    };
  }

  if (includesAny(text, ["телефон", "связ", "контакт", "почт", "email"])) {
    return {
      text: `Телефон: ${business.phone}. Почта: ${business.email}. ${business.hours}.`,
      isFallback: false,
    };
  }

  if (includesAny(text, ["номер", "сьют", "комнат", "цен", "стоим", "сколько", "прожив"])) {
    const lines = business.rooms
      .filter((room) => room.price.includes("₽") || room.title.toLowerCase().includes("сьют") || room.title.toLowerCase().includes("executive") || room.title.toLowerCase().includes("номер"))
      .slice(0, 3)
      .map((room) => `• ${room.title} — ${room.price}${room.text ? `. ${room.text}` : ""}`);

    const stayRooms = business.rooms.slice(0, 2).map(
      (room) => `• ${room.title} — ${room.price}${room.text ? `. ${room.text}` : ""}`,
    );

    return {
      text: `Варианты проживания:\n${(lines.length ? lines : stayRooms).join("\n")}\nЗабронировать удобнее формой на сайте или по телефону ${business.phone}.`,
      isFallback: false,
    };
  }

  if (includesAny(text, ["спа", "массаж", "wellness", "бассейн", "инфинити"])) {
    const spa = business.rooms.find((room) => room.title.toLowerCase().includes("спа"));
    const pool = business.rooms.find((room) => room.title.toLowerCase().includes("бассейн"));
    return {
      text: [
        spa ? `${spa.title}: ${spa.price}.` : null,
        pool ? `${pool.title}: ${pool.price}.` : null,
        "Процедуры лучше бронировать за 24 часа.",
      ]
        .filter(Boolean)
        .join(" "),
      isFallback: false,
    };
  }

  if (includesAny(text, ["ресторан", "ужин", "завтрак", "кухн", "еда", "меню", "atelier"])) {
    const dining = business.dining.map((item) => `• ${item.title} — ${item.text}`).join("\n");
    return {
      text: `Кухня Atelier на крыше:\n${dining}\nСтол можно запросить через форму бронирования или консьержа.`,
      isFallback: false,
    };
  }

  if (includesAny(text, ["услуг", "сервис", "трансфер", "консьерж"])) {
    const list = business.services.map((item) => `• ${item.title} — ${item.text}`).join("\n");
    return { text: `Сервис отеля:\n${list}`, isFallback: false };
  }

  if (includesAny(text, ["дет", "ребен", "ребён", "семь"])) {
    const kids = business.faqs.find((item) => item.q.toLowerCase().includes("дет"));
    return {
      text: kids?.a ?? "Отель ориентирован на спокойный отдых взрослых гостей.",
      isFallback: false,
    };
  }

  if (includesAny(text, ["спасиб", "благодар"])) {
    return {
      text: "Пожалуйста. Если понадобится ещё что-то — я рядом.",
      isFallback: false,
    };
  }

  return { text: getFallbackResponse(), isFallback: true };
}
