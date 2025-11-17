import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white/80 backdrop-blur-lg border-b border-green-200 py-4 px-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
            <Link href="/">
                <h1 className="text-2xl md:text-3xl font-serif tracking-wide text-green-900">
                Amanda & João Gabriel
                </h1>
            </Link>

            <nav className="hidden md:flex space-x-6 text-green-800 font-medium">
            <Link href="/presentes" className="hover:text-green-900 transition">
                Presentes
            </Link>
            <Link href="/confirmar" className="hover:text-green-900 transition">
                Confirmar Presença
            </Link>
            <Link href="/evento" className="hover:text-green-900 transition">
                Informações
            </Link>
            </nav>
        </div>
    </header>
  );
}