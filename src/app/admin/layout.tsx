import "../globals.css";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-green-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl flex flex-col p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-8 text-center">
          Admin
        </h2>

        <nav className="flex flex-col gap-3">
          <Link
            href="/admin/dashboard"
            className="p-3 rounded-lg hover:bg-green-100 text-green-700 font-medium transition"
          >
            Página inicial
          </Link>

          <Link
            href="/admin/convites"
            className="p-3 rounded-lg hover:bg-green-100 text-green-700 font-medium transition"
          >
            Convites & Convidados
          </Link>

          <Link
            href="/admin/presentes"
            className="p-3 rounded-lg hover:bg-green-100 text-green-700 font-medium transition"
          >
            Lista de Presentes
          </Link>
        </nav>

        <div className="mt-auto pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Lista de Casamento
        </div>
      </aside>

      {/* Área principal */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
