import Link from "next/link";
import { hotelMeta } from "@/lib/hotel";

export function ClosingCta() {
  return (
    <section className="closing" aria-labelledby="closing-title">
      <div className="closing__inner reveal">
        <p className="eyebrow">Следующий визит</p>
        <h2 id="closing-title" className="display">
          Оставьте вечер нам
        </h2>
        <p>
          Напишите даты — подберём номер и стол на крыше. Или позвоните консьержу:
          {" "}
          <a href={hotelMeta.phoneHref}>{hotelMeta.phone}</a>
        </p>
        <div className="closing__actions">
          <Link className="btn btn--primary" href="/#booking">
            Забронировать
          </Link>
          <a className="btn btn--ghost" href={`mailto:${hotelMeta.email}`}>
            Написать на почту
          </a>
        </div>
      </div>
    </section>
  );
}
