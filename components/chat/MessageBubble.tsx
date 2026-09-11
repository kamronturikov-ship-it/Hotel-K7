type MessageBubbleProps = {
  role: "user" | "bot";
  text: string;
  image?: string;
};

export function MessageBubble({ role, text, image }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-vespera-sm border px-3 py-2 text-sm leading-relaxed ${
          isUser
            ? "border-vespera-border bg-vespera-accent/15 text-vespera-text"
            : "border-vespera-border bg-vespera-bg/80 text-vespera-text"
        }`}
      >
        {image ? (
          <img
            src={image}
            alt="Прикреплённое фото"
            className="mb-2 max-h-52 w-full rounded-vespera-sm border border-vespera-border object-cover"
          />
        ) : null}
        {text || null}
      </div>
    </div>
  );
}
