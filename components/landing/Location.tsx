import Link from "next/link";
import { hotelMeta } from "@/lib/hotel";

export function Location() {
  return (
    <section className="location" id="location" aria-labelledby="location-title">
      <div className="location__copy reveal">
        <p className="eyebrow">Локация</p>
        <h2 id="location-title" className="display">
          Над рощей, в стороне от шума
        </h2>
        <p>
          {hotelMeta.address}. До набережной — 12 минут на авто, до аэропорта — около часа.
          Мы специально чуть в стороне: чтобы вечер заканчивался тишиной, а не неоном.
        </p>
        <dl className="location__meta">
          <div>
            <dt>Адрес</dt>
            <dd>{hotelMeta.address}</dd>
          </div>
          <div>
            <dt>Телефон</dt>
            <dd>
              <a href={hotelMeta.phoneHref}>{hotelMeta.phone}</a>
            </dd>
          </div>
          <div>
            <dt>Почта</dt>
            <dd>
              <a href={`mailto:${hotelMeta.email}`}>{hotelMeta.email}</a>
            </dd>
          </div>
        </dl>
        <Link className="btn btn--ghost" href="/#faq">
          Частые вопросы
        </Link>
      </div>

      <div className="location__map reveal" aria-hidden>
        <div className="location__map-frame">
          <p className="location__map-label">Vespera</p>
          <p>Оливковый переулок, 12</p>
          <p className="location__map-hint">Тихий холм · закрытая парковка</p>
        </div>
      </div>
    </section>
  );
}
