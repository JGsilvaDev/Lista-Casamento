"use client";

import { useState } from "react";
import { Check, X, Plus, Trash } from "lucide-react";
import Swal from "sweetalert2";

interface Convidado {
  id: number;
  nome: string;
  confirmado: number | boolean;
}

export default function ConvidadosList({
  convidadosIniciais,
  conviteId,
  onAdd,
  onRemove
}: {
  convidadosIniciais: Convidado[];
  conviteId: number;
  onAdd?: () => void;
  onRemove?: () => void;
}) {
  const [convidados, setConvidados] = useState(convidadosIniciais);
  const [novoNome, setNovoNome] = useState("");
  const [adicionando, setAdicionando] = useState(false);

  async function adicionarConvidado() {
    if (!novoNome.trim()) return;

    const res = await fetch("/api/convidados/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ convite_id: conviteId, nome: novoNome }),
    });

    if (!res.ok) {
      alert("Erro ao adicionar convidado");
      return;
    }

    setConvidados([
      ...convidados,
      { id: Date.now(), nome: novoNome, confirmado: 0 },
    ]);

    onAdd?.();

    setNovoNome("");
    setAdicionando(false);
  }

  async function removerConvidado(id: number) {
    const result = await Swal.fire({
      title: "Excluir convidado?",
      text: "Esta ação não poderá ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626", 
      cancelButtonColor: "#6b7280", 
      background: "#ffffff",
    });

    if (!result.isConfirmed) return;

    const res = await fetch("/api/convidados/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Não foi possível excluir o convidado.",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    setConvidados(convidados.filter((c) => c.id !== id));

    onRemove?.()

    Swal.fire({
      icon: "success",
      title: "Convidado removido!",
      showConfirmButton: false,
      timer: 1400,
    });
  }


  return (
    <div className="text-gray-800">
      <ul className="divide-y divide-gray-300">

        {convidados.map((c) => (
          <li
            key={c.id}
            className="py-3 flex justify-between items-center text-gray-700"
          >
            <span className="font-medium">{c.nome}</span>

            <div className="flex justify-between items-center gap-4">
              <span
                className={
                  c.confirmado
                    ? "text-green-700 font-semibold"
                    : "text-gray-500 font-medium"
                }
              >
                {c.confirmado ? "Confirmado" : "Pendente"}
              </span>
              <button
                onClick={() => removerConvidado(c.id)}
                className="p-2 rounded hover:bg-red-600/20 transition cursor-pointer"
                title="Remover"
              >
                <Trash className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </li>
        ))}

        {/* Linha de adicionar convidado */}
        {adicionando && (
          <li className="py-3 flex items-center gap-3">
            <input
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              placeholder="Nome do convidado"
              className="border border-gray-400 bg-gray-100 text-gray-800 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-green-700"
            />

            <button
              onClick={adicionarConvidado}
              className="bg-green-700 hover:bg-green-800 text-white p-2 rounded-lg shadow transition"
              title="Salvar"
            >
              <Check size={20} />
            </button>

            <button
              onClick={() => {
                setNovoNome("");
                setAdicionando(false);
              }}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow transition"
              title="Cancelar"
            >
              <X size={20} />
            </button>
          </li>
        )}
      </ul>

      {/* Botão para abrir o formulário */}
      {!adicionando && (
        <button
          onClick={() => setAdicionando(true)}
          className="flex items-center justify-center gap-2 w-full mt-6 bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition"
        >
          <Plus size={20} />
          Adicionar Convidado
        </button>
      )}
    </div>
  );
}
