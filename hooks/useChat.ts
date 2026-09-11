"use client";

import { useCallback, useState } from "react";
import { business } from "@/data/business";
import { getBotResponse, getFallbackResponse } from "@/lib/chatBot";
import type { Message } from "@/types/chat.types";

function createMessage(
  role: Message["role"],
  text: string,
  image?: string,
): Message {
  return {
    id: crypto.randomUUID(),
    role,
    text,
    timestamp: Date.now(),
    image,
  };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    createMessage("bot", business.welcome),
  ]);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const handleUserMessage = useCallback(async (raw: string, image?: string) => {
    const text = raw.trim();
    if (!text && !image) return;

    setMessages((prev) => [...prev, createMessage("user", text, image)]);
    setIsBotTyping(true);

    try {
      const local = image ? null : getBotResponse(text);

      if (local && !local.isFallback) {
        await delay(350 + Math.floor(Math.random() * 150));
        setMessages((prev) => [...prev, createMessage("bot", local.text)]);
        return;
      }

      let response: Response;
      try {
        response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, image }),
        });
      } catch {
        setMessages((prev) => [...prev, createMessage("bot", business.offline)]);
        return;
      }

      const data = (await response.json()) as { reply?: string; error?: string };

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          createMessage("bot", getFallbackResponse()),
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        createMessage("bot", data.reply?.trim() || getFallbackResponse()),
      ]);
    } finally {
      setIsBotTyping(false);
    }
  }, []);

  return {
    messages,
    isBotTyping,
    handleUserMessage,
  };
}
