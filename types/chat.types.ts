export type MessageRole = "user" | "bot";

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: number;
  /** data URL прикреплённого фото (только для сообщений гостя) */
  image?: string;
}

export interface ChatState {
  messages: Message[];
  isBotTyping: boolean;
}

export type QuestionStatus = "pending" | "answered";

export interface QAEntry {
  id: string;
  question: string;
  normalized_question: string;
  answer: string | null;
  status: QuestionStatus;
  asked_count: number;
  created_at: string;
  answered_at: string | null;
}

export interface BotResponse {
  text: string;
  /** true = нужно идти в API (FAQ / Gemini) */
  isFallback: boolean;
}
