"use client";

import Link from "next/link";
import { useState } from "react";
import { hotelMeta } from "@/lib/hotel";

const links = [
  { href: "/#rooms", label: "Номера" },
  { href: "/#services", label: "Сервис" },
  { href: "/#dining", label: "Кухня" },
  { href: "/#gallery", label: "Галерея" },
  { href: "/#experience", label: "Философия" },
  { href: "/#contact", label: "Контакты" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <Link className="logo" href="/#top" onClick={close}>
        {hotelMeta.name}
      </Link>
      <nav className={`nav${open ? " is-open" : ""}`} aria-label="Основная навигация">
        {links.map((link) => (
          <Link key={link.href} href={link.href} onClick={close}>
            {link.label}
          </Link>
        ))}
      </nav>
      <Link className="btn btn--ghost header-cta" href="/#booking">
        Забронировать
      </Link>
      <button
        className="nav-toggle"
        type="button"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>
    </header>
  );
}
