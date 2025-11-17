"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash } from "lucide-react";
import Swal from "sweetalert2";

export default function PresentesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any  
  const [presentes, setPresentes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [status, setStatus] = useState("todos");
  const [order, setOrder] = useState("nome");
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // Buscar dados do banco
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/presentes");
        const data = await res.json();
        setPresentes(data);
      } catch (err) {
        console.error("Erro ao buscar presentes", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const categorias = useMemo(
    () => ["todas", ...new Set(presentes.map((p) => p.categoria))],
    [presentes]
  );

  const filtered = useMemo(() => {
    return presentes
      .filter((p) => p.nome.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => (categoria === "todas" ? true : p.categoria === categoria))
      .filter((p) =>
        status === "todos"
          ? true
          : p.status === (status === "presentado" ? "Presentado" : "Não Presentado")
      )
      .sort((a, b) => {
        if (order === "nome") return a.nome.localeCompare(b.nome);
        if (order === "categoria") return a.categoria.localeCompare(b.categoria);
        return 0;
      });
  }, [presentes, search, categoria, status, order]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const deletar = async (id: number) => {
    const result = await Swal.fire({
      title: "Excluir presente?",
      text: "Essa ação não pode ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2E7D32",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await fetch(`/api/presentes/${id}`, { method: "DELETE" });

      setPresentes((prev) => prev.filter((p) => p.id !== id));

      Swal.fire({
        title: "Excluído!",
        text: "O presente foi removido com sucesso.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        title: "Erro!",
        text: "Não foi possível excluir o presente." + err,
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-green-800">Lista de Presentes</h1>
        <Link
          href="/admin/presentes/novo"
          className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-lg shadow-md transition cursor-pointer"
        >
          + Novo Presente
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500 py-10">Carregando...</p>
      )}

      {!loading && (
        <>
          {/* FILTROS */}
          <div className="bg-white p-5 rounded-xl shadow-md mb-10 border border-green-100">
            <h2 className="text-lg font-semibold text-green-800 mb-4">Filtros</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Buscar presente..."
                className="border border-green-300 rounded-lg p-2 w-full text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="border border-green-300 rounded-lg p-2 text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "todas" ? "Todas as categorias" : cat}
                  </option>
                ))}
              </select>

              <select
                className="border border-green-300 rounded-lg p-2 text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="todos">Todos os status</option>
                <option value="presentado">Presentado</option>
                <option value="nao-presentado">Não Presentado</option>
              </select>

              <select
                className="border border-green-300 rounded-lg p-2 text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
              >
                <option value="nome">Ordenar por nome</option>
                <option value="categoria">Ordenar por categoria</option>
              </select>
            </div>
          </div>

          {/* LISTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.length === 0 ? (
              <p className="text-center text-gray-500 col-span-full py-6">
                Nenhum presente encontrado.
              </p>
            ) : (
              paginated.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl shadow-md p-4 relative flex items-center gap-4 transition hover:shadow-lg border border-green-100"
                >
                  <Image
                    src={p.imagem}
                    alt={p.nome}
                    width={80}
                    height={80}
                    className="object-cover rounded-lg border border-green-200"
                  />

                  <div className="flex-1">
                    <Link
                      href={`/admin/presentes/${p.id}`}
                      className="font-semibold text-green-800 hover:underline"
                    >
                      {p.nome}
                    </Link>

                    <p className="text-gray-600 text-sm">{p.categoria}</p>

                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold mt-1 inline-block ${
                        p.status === "Presentado"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <button
                    onClick={() => deletar(p.id)}
                    className="absolute top-3 right-3 text-red-600 hover:text-red-800 transition transform hover:scale-110 cursor-pointer"
                    title="Excluir"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* PAGINAÇÃO */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 disabled:opacity-50"
              >
                ◀
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded transition ${
                    page === i + 1
                      ? "bg-green-700 text-white shadow"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 disabled:opacity-50"
              >
                ▶
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
