import {
  diningHighlights,
  faqs,
  hotelMeta,
  rooms,
  services,
} from "@/lib/hotel";

/** Единый источник фактов для rule-based бота и Gemini-промпта */
export const business = {
  name: hotelMeta.name,
  phone: hotelMeta.phone,
  phoneHref: hotelMeta.phoneHref,
  email: hotelMeta.email,
  address: hotelMeta.address,
  checkIn: hotelMeta.checkIn,
  checkOut: hotelMeta.checkOut,
  hours: hotelMeta.hours,
  tagline: "Бутик-отель с тихими вечерами и внимательным сервисом",
  rooms: rooms.map((room) => ({
    title: room.title,
    price: room.priceValue
      ? `${room.priceLabel} ${room.priceValue}`
      : room.priceLabel,
    text: room.text ?? "",
    tags: room.tags,
  })),
  services: services.map((item) => ({
    title: item.title,
    text: item.text,
  })),
  dining: diningHighlights,
  faqs,
  welcome:
    "Здравствуйте! Я консьерж Vespera. Могу рассказать про номера, ресторан, спа, заезд или помочь с бронированием.",
  fallback:
    "Спасибо за вопрос. Я передам его команде — или уточните про номера, цены, спа, ресторан, парковку или время заезда.",
  offline:
    "Похоже, пропало соединение. Проверьте интернет и попробуйте ещё раз.",
};

export type Business = typeof business;
