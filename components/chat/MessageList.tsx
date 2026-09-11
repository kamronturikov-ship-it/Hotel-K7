"use client";

import { useEffect, useRef, useState } from "react";
import type { Message } from "@/types/chat.types";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";

type MessageListProps = {
  messages: Message[];
  isBotTyping: boolean;
};

export function MessageList({ messages, isBotTyping }: MessageListProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const [showJump, setShowJump] = useState(false);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node || !stickToBottom.current) {
      setShowJump(true);
      return;
    }
    node.scrollTop = node.scrollHeight;
    setShowJump(false);
  }, [messages, isBotTyping]);

  function onScroll() {
    const node = scrollerRef.current;
    if (!node) return;
    const distance = node.scrollHeight - node.scrollTop - node.clientHeight;
    stickToBottom.current = distance < 50;
    setShowJump(!stickToBottom.current);
  }

  function jumpToLatest() {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
    stickToBottom.current = true;
    setShowJump(false);
  }

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        className="flex h-full flex-col gap-3 overflow-y-auto px-3 py-3"
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            role={message.role}
            text={message.text}
            image={message.image}
          />
        ))}
        {isBotTyping ? <TypingIndicator /> : null}
      </div>

      {showJump ? (
        <button
          type="button"
          onClick={jumpToLatest}
          className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-vespera-sm border border-vespera-border bg-vespera-surface px-3 py-1.5 text-xs font-semibold text-vespera-accent shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vespera-accent"
        >
          ↓ Новые сообщения
        </button>
      ) : null}
    </div>
  );
}
