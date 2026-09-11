"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { hotelMeta } from "@/lib/hotel";

function toDateValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function nextDay(value: string) {
  const date = new Date(value);
  date.setDate(date.getDate() + 1);
  return toDateValue(date);
}

export function Hero() {
  const defaults = useMemo(() => {
    const today = new Date();
    const next = new Date(today);
    next.setDate(today.getDate() + 2);
    return {
      checkIn: toDateValue(today),
      checkOut: toDateValue(next),
      minIn: toDateValue(today),
    };
  }, []);

  const [checkIn, setCheckIn] = useState(defaults.checkIn);
  const [checkOut, setCheckOut] = useState(defaults.checkOut);
  const [guests, setGuests] = useState("2");
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const minOut = nextDay(checkIn);

  function onCheckInChange(value: string) {
    setCheckIn(value);
    const min = nextDay(value);
    setCheckOut((current) => (current <= value ? min : current));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkIn,
          checkOut,
          guests: Number(guests),
        }),
      });

      const data = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Не удалось отправить заявку");
      }

      setStatus(data.message ?? "Заявка принята.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Что-то пошло не так");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__media" data-parallax>
        <Image
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80"
          alt="Вечерний свет на террасе и бассейне отеля Vespera"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 40%" }}
        />
        <div className="hero__veil" />
      </div>

      <div className="hero__content">
        <p className="eyebrow">Бутик-отель · с 2014</p>
        <h1 id="hero-title" className="display">
          Вечера,
          <br />
          которые хочется
          <br />
          продлить
        </h1>
        <p className="hero__lead">
          Шестнадцать номеров над оливковой рощей. Медленные утра, террасы на золотом часе
          и команда, которая помнит, как вы пьёте кофе.
        </p>

        <form className="booking" id="booking" onSubmit={onSubmit}>
          <label className="booking__field">
            <span>Заезд</span>
            <input
              type="date"
              name="checkin"
              required
              min={defaults.minIn}
              value={checkIn}
              onChange={(event) => onCheckInChange(event.target.value)}
            />
          </label>
          <label className="booking__field">
            <span>Выезд</span>
            <input
              type="date"
              name="checkout"
              required
              min={minOut}
              value={checkOut}
              onChange={(event) => setCheckOut(event.target.value)}
            />
          </label>
          <label className="booking__field">
            <span>Гости</span>
            <select
              name="guests"
              aria-label="Количество гостей"
              value={guests}
              onChange={(event) => setGuests(event.target.value)}
            >
              <option value="1">1 гость</option>
              <option value="2">2 гостя</option>
              <option value="3">3 гостя</option>
              <option value="4">4 гостя</option>
            </select>
          </label>
          <button className="btn btn--primary booking__submit" type="submit" disabled={pending}>
            {pending ? "Отправляем…" : "Забронировать"}
          </button>
        </form>

        {status ? <p className="booking__status">{status}</p> : null}

        <dl className="hero__meta">
          <div>
            <dt>Заезд</dt>
            <dd>{hotelMeta.checkIn}</dd>
          </div>
          <div>
            <dt>Выезд</dt>
            <dd>{hotelMeta.checkOut}</dd>
          </div>
          <div>
            <dt>Консьерж</dt>
            <dd>
              <a href={hotelMeta.phoneHref}>{hotelMeta.phone}</a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
