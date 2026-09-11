import { services } from "@/lib/hotel";

export function Services() {
  return (
    <section className="services" id="services" aria-labelledby="services-title">
      <div className="section-head reveal">
        <p className="eyebrow">Сервис</p>
        <h2 id="services-title" className="display">
          Ритуалы без суеты
        </h2>
        <p className="section-lead">
          Мы убираем лишнее из дня гостя — остаётся только то, что действительно ощущается.
        </p>
      </div>

      <ul className="services__grid">
        {services.map((item) => (
          <li key={item.id} className="services__item reveal">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
