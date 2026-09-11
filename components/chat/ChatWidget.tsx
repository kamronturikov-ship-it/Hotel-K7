"use client";

import { useState } from "react";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageList } from "@/components/chat/MessageList";
import { useChat } from "@/hooks/useChat";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const { messages, isBotTyping, handleUserMessage } = useChat();

  return (
    <div id="chat-widget-slot" className="fixed bottom-4 right-4 z-[120] flex flex-col items-end gap-3 max-[480px]:bottom-0 max-[480px]:right-0 max-[480px]:left-0">
      {open ? (
        <section
          aria-label="Чат с консьержем"
          className="flex h-[min(70vh,500px)] w-[min(100vw-2rem,360px)] flex-col overflow-hidden rounded-vespera border border-vespera-border bg-vespera-surface/96 shadow-lg backdrop-blur-md max-[480px]:h-[100dvh] max-[480px]:w-full max-[480px]:rounded-none"
        >
          <header className="flex items-start justify-between gap-3 border-b border-vespera-border px-4 py-3">
            <div>
              <p className="text-[0.72rem] font-semibold tracking-[0.18em] text-vespera-accent uppercase">
                Консьерж
              </p>
              <h2 className="font-vespera-display text-2xl text-vespera-text">
                Спросите Vespera
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-vespera-sm bg-vespera-accent px-3 py-2 text-sm font-semibold text-[#1a1712] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vespera-accent"
            >
              Закрыть
            </button>
          </header>

          <MessageList messages={messages} isBotTyping={isBotTyping} />
          <ChatInput disabled={isBotTyping} onSend={handleUserMessage} />
        </section>
      ) : null}

      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="min-w-[8.5rem] rounded-vespera-sm bg-vespera-accent px-4 py-3 text-sm font-semibold text-[#1a1712] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vespera-accent max-[480px]:mr-4 max-[480px]:mb-4"
      >
        {open ? "Скрыть" : "Написать нам"}
      </button>
    </div>
  );
}
