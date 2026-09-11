-- Таблица FAQ для Turso / libSQL
-- Можно выполнить: turso db shell <db-name> < scripts/questions.sql
-- Либо таблица создаётся автоматически при первом запросе (ensureQuestionsTable).

create table if not exists questions (
  id text primary key,
  question text not null,
  normalized_question text not null,
  answer text,
  status text not null default 'pending',
  asked_count integer not null default 1,
  created_at text not null,
  answered_at text
);
