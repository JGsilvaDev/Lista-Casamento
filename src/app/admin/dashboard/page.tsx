import { getDb } from "../../../../lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin_auth");
  if (!auth) redirect("/admin/login");

  const db = await getDb();

  // STATS
  const totalConvidados = await db.get("SELECT COUNT(*) as total FROM convidados");
  const confirmados = await db.get("SELECT COUNT(*) as total FROM convidados WHERE confirmado = 1");
  const convitesEnviados = await db.get("SELECT COUNT(*) as total FROM convites");
  const presentesComprados = await db.get("SELECT COUNT(*) as total FROM presentes WHERE status = 'Presentado'");

  const stats = {
    totalConvidados: totalConvidados.total || 0,
    confirmados: confirmados.total || 0,
    convitesEnviados: convitesEnviados.total || 0,
    presentesComprados: presentesComprados.total || 0,
  };

  // ÚLTIMOS PRESENTES
  const ultimosPresentes = await db.all(`
    SELECT p.nome, p.imagem
    FROM presentes p
    WHERE p.status = 'Presentado'
    ORDER BY p.id DESC
    LIMIT 5
  `);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#3E5641] mb-8 flex items-center gap-2">
        Bem-vindo à área administrativa 🌿
      </h1>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total de Convites" value={stats.convitesEnviados} />
        <Card title="Convidados" value={stats.totalConvidados} />
        <Card title="Confirmados" value={stats.confirmados} />
        <Card title="Presentes comprados" value={stats.presentesComprados} />
      </div>

      {/* ÚLTIMOS PRESENTES */}
      <div className="mt-12 bg-white/90 backdrop-blur-sm p-6 rounded-2xl 
                      shadow-md border border-[#CADDC6]">
        <h2 className="text-xl font-semibold text-[#3E5641] mb-4">
          Últimos presentes comprados 🎁
        </h2>

        <ul className="divide-y divide-[#E3E9E0]">
          {ultimosPresentes.map((item, i) => (
            <li key={i} className="py-3 flex justify-between items-center">
              <span className="font-medium text-gray-700">{item.nome}</span>
              <Image
                src={item.imagem}
                alt={item.imagem}
                width={80}
                height={80}
                className="object-cover rounded-xl shadow-sm border border-[#D8E2D2]"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div
      className="bg-white rounded-2xl p-6 shadow-md border border-[#D8E2D2]
      hover:shadow-lg hover:scale-[1.02] transition cursor-pointer"
    >
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-3xl font-bold text-[#3E5641] mt-2">{value}</p>
    </div>
  );
}
