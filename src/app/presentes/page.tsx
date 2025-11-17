"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Gift, Search, Filter, ExternalLink, X } from "lucide-react";
import Swal from "sweetalert2";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PresentesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any  
  const [presentes, setPresentes] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [modalImg, setModalImg] = useState<string | null>(null);

  // 🔎 Buscar da API
  async function fetchPresentes() {
    try {
      const res = await fetch("api/presentes/");
      const data = await res.json();
      setPresentes(data);
    } catch (e) {
      console.error("Erro ao buscar presentes:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPresentes();
  }, []);

  // 🎁 Marcar como presentear → agora com SWEET ALERT
  // eslint-disable-next-line @typescript-eslint/no-explicit-any  
  async function confirmarPresentear(presente: any) {
    const result = await Swal.fire({
      title: "Confirmar presente?",
      text: `Você realmente quer marcar "${presente.nome}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim, presentear!",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    // 🔄 Chama API
    try {
      const res = await fetch(`/api/presentes/${presente.id}`, {
        method: "PATCH",
      });

      const data = await res.json();

      // Atualiza localmente
      setPresentes((prev) =>
        prev.map((p) =>
          p.id === presente.id ? { ...p, status: data.status } : p
        )
      );

      Swal.fire({
        title: "Confirmado! 🎉",
        text: `"${presente.nome}" foi confirmado.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Erro ao marcar presente:", err);
      Swal.fire("Erro", "Não foi possível concluir.", "error");
    }
  }

  // 🔗 Compartilhar
  function compartilhar(url: string) {
    const link = url || window.location.href;
    window.open(link, "_blank");
  }

  // ➕ Filtro final
  const filtrados = presentes.filter((p) => {
    if (p.status === "Presentado") return false;

    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
    const matchCat = categoria === "Todos" || p.categoria === categoria;

    return matchBusca && matchCat;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 text-green-900">
        <Header />

        <div className="min-h-screen bg-green-50 px-6 py-10 flex flex-col items-center">
        {/* Header */}

        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-green-700">Lista de Presentes</h1>
            <p className="text-green-600 mt-2">Escolha um presente e marque como concluído 💚</p>
        </div>

        {/* Barra de busca e filtro */}
        <div className="w-full max-w-3xl flex flex-col sm:flex-row gap-4">
            {/* Busca */}
            <div className="flex items-center gap-3 flex-1 bg-white p-3 rounded-xl shadow">
            <Search className="text-green-600" size={22} />
            <input
                type="text"
                placeholder="Buscar presente..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full outline-none text-gray-700"
            />
            </div>

            {/* Filtro */}
            <div className="bg-white p-3 rounded-xl shadow flex items-center gap-3">
            <Filter className="text-green-600" size={22} />
            <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="outline-none text-gray-700"
            >
                <option>Todos</option>
                <option>Cozinha</option>
                <option>Banheiro</option>
                <option>Quarto</option>
                <option>Decoração</option>
            </select>
            </div>
        </div>

        {/* GRID */}
        <div className="mt-10 w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Loading */}
            {loading &&
            Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-xl shadow-lg h-64" />
            ))}

            {/* Presentes */}
            {!loading &&
            filtrados.map((p) => (
                <div
                key={p.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden border transition ${
                    p.status === "Presentado"
                    ? "border-green-600 shadow-xl opacity-50"
                    : "border-transparent"
                }`}
                >
                {/* IMAGEM */}
                <div
                    className="relative h-40 cursor-pointer"
                    onClick={() => setModalImg(p.imagem)}
                >
                    <Image src={p.imagem} alt={p.nome} fill className="object-cover" />
                </div>

                {/* INFO */}
                <div className="p-4 flex flex-col gap-3">
                    <h3 className="font-semibold text-lg text-green-700">{p.nome}</h3>
                    <p className="text-sm text-green-600">{p.categoria}</p>

                    {/* Botões */}
                    <div className="flex gap-2">
                    <button
                        onClick={() => confirmarPresentear(p)}
                        className={`flex-1 p-2 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer
                        ${
                            p.status === "Presentado"
                            ? "bg-green-600 text-white"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }
                        `}
                        disabled={p.status === "Presentado"}
                    >
                        <>
                        <Gift size={20} /> Presentear
                        </>
                    </button>

                    {/* Compartilhar */}
                    <button
                        onClick={() => compartilhar(p.url)}
                        className="p-2 bg-green-100 hover:bg-green-200 rounded-lg"
                    >
                        <ExternalLink size={20} className="text-green-700" />
                    </button>
                    </div>
                </div>
                </div>
            ))}
        </div>

        {/* Modal */}
        {modalImg && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="relative w-[90%] max-w-2xl">
                <Image src={modalImg} alt="Foto" width={900} height={600} className="rounded-xl" />
                <button
                onClick={() => setModalImg(null)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow"
                >
                <X size={22} className="text-green-700" />
                </button>
            </div>
            </div>
        )}
        </div>

        <Footer />
    </div>
  );
}
