import Link from "next/link";
import { hotelMeta } from "@/lib/hotel";

export function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer__brand">
        <Link className="logo" href="/#top">
          {hotelMeta.name}
        </Link>
        <p>
          {hotelMeta.address} · {hotelMeta.hours}
        </p>
      </div>
      <div className="footer__links">
        <a href={`mailto:${hotelMeta.email}`}>{hotelMeta.email}</a>
        <a href={hotelMeta.phoneHref}>{hotelMeta.phone}</a>
        <Link href="/admin">Админ</Link>
      </div>
      <p className="footer__legal">© 2026 Бутик-отель Vespera. Все права защищены.</p>
    </footer>
  );
}
