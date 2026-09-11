export function TypingIndicator() {
  return (
    <div
      className="flex justify-start"
      aria-live="polite"
      aria-relevant="additions"
    >
      <div className="rounded-vespera-sm border border-vespera-border bg-vespera-bg/80 px-3 py-2">
        <span className="sr-only">Бот печатает сообщение</span>
        <div className="flex items-center gap-1" aria-hidden>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-vespera-accent" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-vespera-accent [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-vespera-accent [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
