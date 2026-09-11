import { NextResponse } from "next/server";
import { getFallbackResponse } from "@/lib/chatBot";
import {
  askGemini,
  askGeminiWithImage,
  isGeminiConfigured,
  PHOTO_DISCLAIMER,
} from "@/lib/gemini";
import {
  findAnswer,
  saveAnswerForQuestion,
  trackUnansweredQuestion,
} from "@/lib/qaMatch";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { message?: string; image?: string };
    const message = body.message?.trim() ?? "";
    const image = body.image;

    if (!message && !image) {
      return NextResponse.json({ error: "Пустое сообщение" }, { status: 400 });
    }

    // Фото: сразу в Gemini (FAQ-маппинг для картинок не подходит)
    if (image) {
      if (!isGeminiConfigured()) {
        return NextResponse.json({ reply: getFallbackResponse() });
      }

      try {
        const prompt = message || "Что изображено на фото?";
        let reply = await askGeminiWithImage(prompt, image);
        if (!reply.includes("Для более точной информации")) {
          reply = `${reply}\n\n${PHOTO_DISCLAIMER}`;
        }
        return NextResponse.json({ reply });
      } catch {
        return NextResponse.json(
          { error: "Ошибка Gemini", reply: getFallbackResponse() },
          { status: 502 },
        );
      }
    }

    const faqAnswer = await findAnswer(message);
    if (faqAnswer) {
      return NextResponse.json({ reply: faqAnswer });
    }

    if (!isGeminiConfigured()) {
      void trackUnansweredQuestion(message).catch(() => undefined);
      return NextResponse.json({ reply: getFallbackResponse() });
    }

    try {
      const reply = await askGemini(message);
      void saveAnswerForQuestion(message, reply).catch(() => undefined);
      return NextResponse.json({ reply });
    } catch {
      void trackUnansweredQuestion(message).catch(() => undefined);
      return NextResponse.json(
        { error: "Ошибка Gemini", reply: getFallbackResponse() },
        { status: 502 },
      );
    }
  } catch {
    return NextResponse.json({ error: "Не удалось обработать запрос" }, { status: 500 });
  }
}
