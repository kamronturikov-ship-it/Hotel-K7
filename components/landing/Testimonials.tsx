import { testimonials } from "@/lib/hotel";

export function Testimonials() {
  return (
    <section className="testimonials" id="reviews" aria-labelledby="reviews-title">
      <div className="section-head reveal">
        <p className="eyebrow">Гости</p>
        <h2 id="reviews-title" className="display">
          Слова после выезда
        </h2>
        <p className="section-lead">
          Нам важнее не звёзды в агрегаторах, а то, что пишут лично — коротко и по делу.
        </p>
      </div>

      <div className="testimonials__grid">
        {testimonials.map((item) => (
          <blockquote key={item.id} className="testimonials__card reveal">
            <p>«{item.quote}»</p>
            <footer>
              <cite>{item.author}</cite>
              <span>{item.meta}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
