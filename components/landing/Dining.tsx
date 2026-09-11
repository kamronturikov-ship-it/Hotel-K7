import Image from "next/image";
import Link from "next/link";
import { diningHighlights } from "@/lib/hotel";

export function Dining() {
  return (
    <section className="dining" id="dining" aria-labelledby="dining-title">
      <div className="dining__visual reveal">
        <Image
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=80"
          alt="Сервировка стола в ресторане отеля при вечернем свете"
          width={1400}
          height={1600}
        />
      </div>

      <div className="dining__copy reveal">
        <p className="eyebrow">Кухня</p>
        <h2 id="dining-title" className="display">
          Atelier на крыше
        </h2>
        <p>
          Сезонный стол шефа: местные овощи, море рядом и вина из погреба. Ужин без музыки
          на полную громкость — чтобы слышать разговор и вечер.
        </p>

        <ul className="dining__list">
          {diningHighlights.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>

        <Link className="btn btn--primary" href="/#booking">
          Запросить стол
        </Link>
      </div>
    </section>
  );
}
