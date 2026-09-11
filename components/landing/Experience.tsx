import Image from "next/image";
import Link from "next/link";

export function Experience() {
  return (
    <section className="experience" id="experience" aria-labelledby="experience-title">
      <div className="experience__copy reveal">
        <p className="eyebrow">Философия</p>
        <h2 id="experience-title" className="display">
          Гостеприимство как ремесло
        </h2>
        <p>
          Vespera создан для тех, кто выбирает меньше номеров и больше внимания. Мы берём
          местный камень, приглушаем музыку и оставляем паузы между событиями — чтобы
          пребывание ощущалось как частный дом, а не расписание.
        </p>
        <ul className="experience__list">
          <li>Домашний завтрак до полудня</li>
          <li>Вечерний turndown с рукописной запиской</li>
          <li>Частный трансфер по запросу</li>
        </ul>
        <Link className="btn btn--primary" href="/#booking">
          Спланировать визит
        </Link>
      </div>
      <figure className="experience__visual reveal">
        <Image
          src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
          alt="Солнечный коридор бутик-отеля с мягкими коврами"
          width={1200}
          height={1500}
        />
        <figcaption>Северное крыло · утренний свет</figcaption>
      </figure>
    </section>
  );
}
