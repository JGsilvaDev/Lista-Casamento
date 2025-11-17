"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NovoConvitePage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [totalPessoas, setTotalPessoas] = useState(1);
  const [convidados, setConvidados] = useState<string[]>([""]);
  const [, setQrCode] = useState("");

  const [loading, setLoading] = useState(false);

  function handleAddGuest() {
    setConvidados([...convidados, ""]);
  }

  function handleRemoveGuest(index: number) {
    setConvidados(convidados.filter((_, i) => i !== index));
  }

  function updateGuest(index: number, value: string) {
    const copy = [...convidados];
    copy[index] = value;
    setConvidados(copy);
  }

  function maskTelefone(value: string) {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/convites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        telefone,
        totalPessoas,
        convidados,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Erro ao criar convite");
      return;
    }

    setQrCode(data.qr);
    router.push("/admin/convites");
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-green-700">
          Criar Novo Convite
        </h1>

        <Link
          href="/admin/convites"
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition shadow-sm"
        >
          Voltar
        </Link>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg border border-green-100 space-y-6"
      >
        {/* NOME */}
        <div>
          <label className="block text-sm font-semibold text-green-700 mb-1">
            Nome do convite
          </label>
          <input
            type="text"
            className="border border-green-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded-lg p-3 w-full text-gray-800 outline-none"
            placeholder="Família Silva"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        {/* TELEFONE */}
        <div>
          <label className="block text-sm font-semibold text-green-700 mb-1">
            Telefone (opcional)
          </label>
          <input
            type="text"
            className="border border-green-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded-lg p-3 w-full text-gray-800 outline-none"
            placeholder="(11) 99999-0000"
            value={telefone}
            onChange={(e) => setTelefone(maskTelefone(e.target.value))}
          />
        </div>

        {/* TOTAL */}
        <div>
          <label className="block text-sm font-semibold text-green-700 mb-1">
            Número total de pessoas
          </label>
          <input
            type="number"
            min={1}
            className="border border-green-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded-lg p-3 w-full text-gray-800 outline-none"
            value={totalPessoas}
            onChange={(e) => setTotalPessoas(Number(e.target.value))}
            required
          />
        </div>

        {/* LISTA DE CONVIDADOS */}
        <div>
          <label className="block text-sm font-semibold text-green-700 mb-3">
            Lista de Convidados
          </label>

          {convidados.map((c, i) => (
            <div key={i} className="flex gap-3 mb-3">
              <input
                type="text"
                value={c}
                className="border border-green-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded-lg p-3 w-full text-gray-800 outline-none"
                placeholder={`Convidado ${i + 1}`}
                onChange={(e) => updateGuest(i, e.target.value)}
              />

              {convidados.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveGuest(i)}
                  className="px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
                >
                  X
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddGuest}
            className="text-green-700 font-semibold hover:underline cursor-pointer"
          >
            + Adicionar Convidado
          </button>
        </div>

        {/* BOTÃO */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg font-medium transition cursor-pointer shadow-md"
        >
          {loading ? "Salvando..." : "Salvar Convite"}
        </button>
      </form>
    </div>
  );
}
