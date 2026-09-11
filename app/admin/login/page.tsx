"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setPending(false);

    if (!response.ok) {
      setError("Неверный пароль");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form className="admin-login__form" onSubmit={onSubmit}>
      <label>
        <span>Пароль</span>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      {error ? <p className="admin-login__error">{error}</p> : null}
      <button className="btn btn--primary" type="submit" disabled={pending}>
        {pending ? "Входим…" : "Войти"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <section className="admin-login">
      <p className="eyebrow">Сотрудники</p>
      <h1 className="display">Вход в админку</h1>
      <p className="section-lead">
        Пароль из переменной <code>ADMIN_PASSWORD</code> в `.env.local`.
      </p>
      <Suspense fallback={<p>Загрузка…</p>}>
        <LoginForm />
      </Suspense>
    </section>
  );
}
