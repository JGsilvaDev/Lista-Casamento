import { sql } from "../../../../lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin_auth");
  if (!auth) redirect("/login");

  // ============================
  // 📊 CONSULTAS DE ESTATÍSTICAS
  // ============================

  const totalConvidadosRes = await sql`
    SELECT COUNT(*) AS total FROM convidados
  `;
  const confirmadosRes = await sql`
    SELECT COUNT(*) AS total FROM convidados WHERE confirmado = 1
  `;
  const convitesEnviadosRes = await sql`
    SELECT COUNT(*) AS total FROM convites
  `;
  const presentesCompradosRes = await sql`
    SELECT COUNT(*) AS total FROM presentes WHERE status = 'Presentado'
  `;

  // Neon retorna COUNT como string → converter
  const stats = {
    totalConvidados: Number(totalConvidadosRes[0].total),
    confirmados: Number(confirmadosRes[0].total),
    convitesEnviados: Number(convitesEnviadosRes[0].total),
    presentesComprados: Number(presentesCompradosRes[0].total),
  };

  // ===========================
  // 🎁 ÚLTIMOS PRESENTES
  // ===========================
  const ultimosPresentes = await sql`
    SELECT nome, imagem
    FROM presentes
    WHERE status = 'Presentado'
    ORDER BY id DESC
    LIMIT 5
  `;

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
      <div
        className="mt-12 bg-white/90 backdrop-blur-sm p-6 rounded-2xl 
                      shadow-md border border-[#CADDC6]"
      >
        <h2 className="text-xl font-semibold text-[#3E5641] mb-4">
          Últimos presentes comprados 🎁
        </h2>

        <ul className="divide-y divide-[#E3E9E0]">
          {ultimosPresentes.map((item, i) => (
            <li key={i} className="py-3 flex justify-between items-center">
              <span className="font-medium text-gray-700">{item.nome}</span>
              <Image
                src={item.imagem}
                alt={item.nome}
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
