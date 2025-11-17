"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ConvitesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [convites, setConvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("todos");
  const [order, setOrder] = useState("nome");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/get-convites");
        const data = await res.json();
        setConvites(data);
      } catch (err) {
        console.error("Erro ao buscar convites:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // FILTRAGEM
  const filtered = convites
    .filter((c) => c.nome.toLowerCase().includes(search.toLowerCase()))
    .filter((c) => {
      if (status === "pendente") return c.confirmados === 0;
      if (status === "parcial")
        return c.confirmados > 0 && c.confirmados < c.totalPessoas;
      if (status === "completo") return c.confirmados === c.totalPessoas;
      return true;
    })
    .sort((a, b) => {
      if (order === "nome") return a.nome.localeCompare(b.nome);
      if (order === "pessoas") return b.totalPessoas - a.totalPessoas;
      if (order === "confirmados") return b.confirmados - a.confirmados;
      return 0;
    });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-[#3E5641] tracking-tight">
          Convites & Convidados 🌿
        </h1>

        <Link
          href="/admin/convites/novo"
          className="bg-[#6F8F6E] hover:bg-[#5E7D5D] text-white px-5 py-3 
          rounded-xl shadow-md transition-all duration-300 hover:scale-[1.02]"
        >
          + Novo Convite
        </Link>
      </div>

      {/* FILTROS */}
      <div className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-md 
                      border border-[#D8E2D2] mb-10">
        <h2 className="text-lg font-semibold text-[#3E5641] mb-4">
          Filtros
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Buscar convite..."
            className="border border-[#C7D5C3] rounded-xl p-3 w-full text-gray-900 
                       shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9EB79E]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border border-[#C7D5C3] rounded-xl p-3 text-gray-900 
                       shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9EB79E]"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="todos">Todos os status</option>
            <option value="pendente">Pendente</option>
            <option value="parcial">Parcial</option>
            <option value="completo">Completo</option>
          </select>

          <select
            className="border border-[#C7D5C3] rounded-xl p-3 text-gray-900 
                       shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9EB79E]"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="nome">Ordenar por nome</option>
            <option value="pessoas">Ordenar por pessoas</option>
            <option value="confirmados">Ordenar por confirmados</option>
          </select>
        </div>
      </div>

      {/* LISTA */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md 
                      border border-[#D8E2D2] p-6">
        <h2 className="text-xl font-semibold text-[#3E5641] mb-4">
          Lista de Convites
        </h2>

        {loading ? (
          <p className="text-gray-600 text-center py-6">
            Carregando convites...
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-6">
            Nenhum convite encontrado.
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600 border-b border-[#E5ECD9]">
                <th className="py-3">Convite</th>
                <th>Pessoas</th>
                <th>Confirmados</th>
                <th>Status</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>

            <tbody className="text-gray-900">
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-[#E5ECD9] last:border-none hover:bg-[#F5F7F3] transition"
                >
                  <td className="py-3 font-medium">{c.nome}</td>
                  <td>{c.totalPessoas}</td>
                  <td>{c.confirmados}</td>

                  <td>
                    {c.confirmados === c.totalPessoas ? (
                      <span className="text-[#3E5641] font-semibold">
                        Completo
                      </span>
                    ) : c.confirmados > 0 ? (
                      <span className="text-[#A37A00] font-semibold">
                        Parcial
                      </span>
                    ) : (
                      <span className="text-gray-600 font-semibold">
                        Pendente
                      </span>
                    )}
                  </td>

                  <td className="text-right">
                    <Link
                      href={`/admin/convites/${c.id}`}
                      className="text-[#3E5641] hover:underline hover:opacity-80"
                    >
                      Ver detalhes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
