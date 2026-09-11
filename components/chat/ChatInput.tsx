"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { compressImage } from "@/lib/image";

type ChatInputProps = {
  disabled: boolean;
  onSend: (text: string, image?: string) => void;
};

type SpeechRecognitionLike = {
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
};

type SpeechRecognitionAlternativeLike = {
  transcript: string;
  confidence: number;
};

type SpeechRecognitionResultLike = {
  [index: number]: SpeechRecognitionAlternativeLike;
  isFinal: boolean;
};

type SpeechRecognitionEventLike = {
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function ChatInput({ disabled, onSend }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [listening, setListening] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const hasSpeech = typeof window !== "undefined" && Boolean(getSpeechRecognition());

  useEffect(() => {
    if (!disabled) ref.current?.focus();
  }, [disabled]);

  function submit() {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  function toggleVoice() {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    if (!recognitionRef.current) {
      const Recognition = getSpeechRecognition();
      if (!Recognition) return;
      recognitionRef.current = new Recognition();
      recognitionRef.current.lang = "ru-RU";
      recognitionRef.current.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i += 1) {
          transcript += event.results[i][0].transcript + " ";
        }
        transcript = transcript.trim();
        if (!transcript) return;
        setValue((prev) => {
          const merged = prev.trim() ? `${prev.trim()} ${transcript}` : transcript;
          return merged;
        });
        const lastResult = event.results[event.results.length - 1];
        if (lastResult?.isFinal) setListening(false);
      };
      recognitionRef.current.onend = () => setListening(false);
      recognitionRef.current.onerror = () => setListening(false);
    }

    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }

  async function onFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || disabled) return;

    try {
      const image = await compressImage(file);
      onSend(value.trim(), image);
      setValue("");
    } catch {
      setValue((prev) => (prev ? prev : "Не удалось обработать фото"));
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-2 border-t border-vespera-border p-3"
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        aria-hidden
        onChange={onFileChange}
      />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={disabled}
        title="Прикрепить фото"
        aria-label="Прикрепить фото"
        className="grid h-11 w-11 place-items-center rounded-vespera-sm bg-vespera-accent text-[#1a1712] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vespera-accent disabled:opacity-50"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      </button>

      {hasSpeech ? (
        <button
          type="button"
          onClick={toggleVoice}
          disabled={disabled}
          title={listening ? "Остановить запись" : "Голосовой ввод"}
          aria-label={listening ? "Остановить запись" : "Голосовой ввод"}
          aria-pressed={listening}
          className={`grid h-11 w-11 place-items-center rounded-vespera-sm bg-vespera-accent text-[#1a1712] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vespera-accent disabled:opacity-50 ${
            listening ? "animate-pulse" : ""
          }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="23" />
          </svg>
        </button>
      ) : null}

      <textarea
        ref={ref}
        rows={1}
        value={value}
        disabled={disabled}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Ваш вопрос…"
        aria-label="Сообщение консьержу"
        className="min-h-11 resize-none rounded-vespera-sm border border-vespera-border bg-vespera-bg/65 px-3 py-2.5 text-sm text-vespera-text outline-none focus-visible:border-vespera-border-strong disabled:opacity-60"
      />

      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="h-11 rounded-vespera-sm bg-vespera-accent px-3.5 text-sm font-semibold text-[#1a1712] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vespera-accent disabled:opacity-50"
      >
        Отправить
      </button>
    </form>
  );
}