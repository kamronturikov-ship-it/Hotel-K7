import Image from "next/image";
import { rooms } from "@/lib/hotel";

export function Rooms() {
  return (
    <section className="rooms" id="rooms" aria-labelledby="rooms-title">
      <div className="section-head reveal">
        <p className="eyebrow">Проживание</p>
        <h2 id="rooms-title" className="display">
          Номера и тихая роскошь
        </h2>
        <p className="section-lead">
          Каждый номер — в дымчатом дубе, льне и матовой латуни. Без спешки: мягкий свет
          утром и тишина вечером.
        </p>
      </div>

      <div className="bento">
        {rooms.map((room) => (
          <article
            key={room.id}
            className={`tile tile--${room.size} reveal`}
            data-speed={room.speed}
          >
            <div className="tile__media">
              <Image
                src={room.image}
                alt={room.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="tile__body">
              {room.tags.length > 1 ? (
                <div className="tile__tags">
                  {room.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="tag">{room.tags[0]}</span>
              )}
              <h3 className="tile__title">{room.title}</h3>
              {room.text ? <p className="tile__text">{room.text}</p> : null}
              <p className="tile__price">
                {room.priceLabel}
                {room.priceValue ? (
                  <>
                    {" "}
                    <strong>{room.priceValue}</strong>
                    {room.size !== "sm" ? <span> / ночь</span> : null}
                  </>
                ) : null}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
