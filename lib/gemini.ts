import { GoogleGenerativeAI } from "@google/generative-ai";
import { business } from "@/data/business";

export const PHOTO_DISCLAIMER =
  "Для более точной информации свяжитесь по номеру " +
  "или оставьте свои данные через обратную связь.";

export function isGeminiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY);
}

function getModel() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  return genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  });
}

function buildSystemPrompt() {
  const roomLines = business.rooms
    .map((room) => `- ${room.title}: ${room.price}. ${room.text}`)
    .join("\n");
  const serviceLines = business.services
    .map((item) => `- ${item.title}: ${item.text}`)
    .join("\n");

  return `Ты сдержанный консьерж бутик-отеля ${business.name}.
Отвечай кратко и тепло на русском. Опирайся только на факты ниже, не выдумывай занятость номеров.
Телефон: ${business.phone}. Почта: ${business.email}. Адрес: ${business.address}.
Заезд ${business.checkIn}, выезд ${business.checkOut}. ${business.hours}.
Номера:
${roomLines}
Сервис:
${serviceLines}
Если просят бронь — предложи форму на сайте или звонок консьержу.`;
}

export async function askGemini(userMessage: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY не задан");
  }

  const model = getModel();
  const result = await model.generateContent([
    { text: buildSystemPrompt() },
    { text: `Вопрос гостя: ${userMessage}` },
  ]);

  const text = result.response.text()?.trim();
  if (!text) {
    throw new Error("Пустой ответ Gemini");
  }

  return text;
}

export async function askGeminiWithImage(
  userMessage: string,
  imageDataUrl: string,
): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY не задан");
  }

  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)$/.exec(
    imageDataUrl,
  );
  if (!match) {
    throw new Error("Некорректное изображение");
  }
  const [, mimeType, base64] = match;

  const model = getModel();
  const system = `Ты сдержанный консьерж бутик-отеля ${business.name}.
Ты получил фотографию от гостя. Дай ПРИБЛИЗИТЕЛЬНЫЙ ответ по тому, что видно на фото (например, оцени комнату, блюдо, вид из окна, услугу).
Не утверждай точную информацию, которой нет на фото. Отвечай кратко и тепло на русском.
Завершая ответ, всегда добавь отдельной строкой: "${PHOTO_DISCLAIMER}"

Факты об отеле:
Телефон: ${business.phone}. Почта: ${business.email}. Адрес: ${business.address}.
Заезд ${business.checkIn}, выезд ${business.checkOut}. ${business.hours}.
Номера: ${business.rooms
    .map((room) => `${room.title}: ${room.price}. ${room.text}`)
    .join("; ")}
Сервис: ${business.services
    .map((item) => `${item.title}: ${item.text}`)
    .join("; ")}
Если гостю нужно уточнение — предложи позвонить или оставить контакты.`;

  const result = await model.generateContent([
    { text: system },
    { inlineData: { mimeType, data: base64 } },
    { text: userMessage ? `Вопрос гостя: ${userMessage}` : "" },
  ]);

  const text = result.response.text()?.trim();
  if (!text) {
    throw new Error("Пустой ответ Gemini");
  }

  return text;
}
