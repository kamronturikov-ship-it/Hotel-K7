import { faqs } from "@/lib/hotel";

export function Faq() {
  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="section-head reveal">
        <p className="eyebrow">Подробности</p>
        <h2 id="faq-title" className="display">
          Частые вопросы
        </h2>
        <p className="section-lead">
          Коротко о том, что обычно спрашивают до бронирования. Остальное — консьержу.
        </p>
      </div>

      <div className="faq__list">
        {faqs.map((item) => (
          <details key={item.q} className="faq__item reveal">
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
