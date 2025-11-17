"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PreviewImage from "@/app/components/PreviewImage";

export default function NovoPresentePage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [status, setStatus] = useState("Não Presentado");
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagemFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nome || !categoria || !imagemFile) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("categoria", categoria);
      formData.append("status", status);
      formData.append("imagem", imagemFile);

      const res = await fetch("/api/presentes", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Erro ao salvar presente");

      router.push("/admin/presentes");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any  
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-green-100">
      <h1 className="text-2xl font-bold text-green-800 mb-6">
        Novo Presente
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Nome */}
        <div>
          <label className="block font-semibold mb-1 text-gray-800">
            Nome
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="border border-green-300 rounded-lg w-full p-2 text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        {/* Categoria */}
        <div>
          <label className="block font-semibold mb-1 text-gray-800">
            Categoria
          </label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="border border-green-300 rounded-lg w-full p-2 text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="">Selecione uma categoria</option>
            <option value="Eletrodoméstico">Eletrodoméstico</option>
            <option value="Louça">Louça</option>
            <option value="Decoração">Decoração</option>
            <option value="Cozinha">Cozinha</option>
            <option value="Outros">Outros</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block font-semibold mb-1 text-gray-800">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-green-300 rounded-lg w-full p-2 text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="Não Presentado">Não Presentado</option>
            <option value="Presentado">Presentado</option>
          </select>
        </div>

        {/* Imagem */}
        <div>
          <label className="block font-semibold mb-1 text-gray-800">
            Imagem
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImagemChange}
            className="border border-green-300 rounded-lg w-full p-2 text-gray-900 cursor-pointer focus:ring-2 focus:ring-green-500 focus:outline-none"
          />

          {preview && (
            <PreviewImage
              src={preview}
              className="mt-3 w-32 h-32 border border-green-300 rounded-lg shadow"
            />
          )}
        </div>

        {/* Botão */}
        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-lg shadow-md transition w-full font-semibold disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Salvar Presente"}
        </button>
      </form>
    </div>
  );
}
