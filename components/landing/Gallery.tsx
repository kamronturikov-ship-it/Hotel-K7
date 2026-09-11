import Image from "next/image";
import { gallery } from "@/lib/hotel";

export function Gallery() {
  return (
    <section className="gallery" id="gallery" aria-labelledby="gallery-title">
      <div className="section-head reveal">
        <p className="eyebrow">Атмосфера</p>
        <h2 id="gallery-title" className="display">
          Моменты в доме
        </h2>
        <p className="section-lead">
          Свет, фактуры и тишина — то, ради чего гости возвращаются без чек-листа «что посмотреть».
        </p>
      </div>

      <div className="gallery__grid">
        {gallery.map((shot, index) => (
          <figure
            key={shot.id}
            className={`gallery__item gallery__item--${index % 2 === 0 ? "tall" : "wide"} reveal`}
          >
            <Image
              src={shot.src}
              alt={shot.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <figcaption>{shot.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
