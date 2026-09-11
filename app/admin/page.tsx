import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { ADMIN_COOKIE, adminCookieOptions } from "@/lib/adminAuth";
import { listQuestions } from "@/lib/qaMatch";
import { isTursoConfigured } from "@/lib/turso";

export const dynamic = "force-dynamic";

async function logout() {
  "use server";
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, "", { ...adminCookieOptions(), maxAge: 0 });
  redirect("/admin/login");
}

export default async function AdminPage() {
  const configured = isTursoConfigured();
  const data = configured
    ? await listQuestions()
    : { pending: [], answered: [] };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="logo" href="/admin">
          Vespera Admin
        </Link>
        <nav aria-label="Админ">
          <Link href="/admin">Вопросы FAQ</Link>
          <Link href="/">Сайт</Link>
        </nav>
        <form action={logout}>
          <button className="btn btn--ghost" type="submit">
            Выйти
          </button>
        </form>
      </aside>

      <div className="admin-main">
        <AdminDashboard
          configured={configured}
          pending={data.pending}
          answered={data.answered}
        />
      </div>
    </div>
  );
}
