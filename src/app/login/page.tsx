"use client";

import { useState } from "react";
import Image from "next/image";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erro ao fazer login");
      return;
    }

    window.location.href = "/admin/dashboard";
  }

  return (
    <div className="flex min-h-screen items-center justify-center
      bg-gradient-to-br from-[#F9F6F1] via-[#ECF1EA] to-[#DDE7D7]">

      <div className="bg-white/90 backdrop-blur-xl shadow-xl rounded-3xl 
        p-10 w-full max-w-md border border-[#CADDC6]">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-28 h-28 mb-4 drop-shadow-md">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>

          <h1 className="text-3xl font-semibold text-[#3E5641] tracking-tight">
            Painel Administrativo
          </h1>

          <div className="mt-1 h-1 w-20 bg-[#9EB79E] rounded-full"></div>

          <p className="text-gray-600 text-sm mt-3">
            Acesso exclusivo aos noivos 🌿
          </p>
        </div>

        {error && (
          <p className="text-red-600 mb-4 text-sm text-center bg-red-50 py-2 rounded-lg border border-red-200">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Usuário
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-[#B7C9B3] rounded-xl w-full py-3 px-4 
                text-gray-700 bg-white focus:outline-none
                focus:ring-2 focus:ring-[#9EB79E] shadow-sm transition"
              placeholder="Digite seu usuário"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-[#B7C9B3] rounded-xl w-full py-3 px-4 
                text-gray-700 bg-white focus:outline-none
                focus:ring-2 focus:ring-[#9EB79E] shadow-sm transition"
              placeholder="Digite sua senha"
            />
          </div>

          <button
            type="submit"
            className="bg-[#6F8F6E] hover:bg-[#5E7D5D] text-white 
              font-semibold py-3 px-4 rounded-xl w-full shadow-lg 
              transition-all duration-300 hover:scale-[1.02]"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-10">
          © {new Date().getFullYear()} Lista de Casamento — Admin 🌿💍
        </p>
      </div>
    </div>
  );
}
