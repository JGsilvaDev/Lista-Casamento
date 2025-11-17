"use client";

import { useState } from "react";
import ConvidadosList from "../ConvidadosList";

// eslint-disable-next-line @typescript-eslint/no-explicit-any  
export default function ConviteInfo({ convite, convidados }: any) {
  const [totalPessoas, setTotalPessoas] = useState(convite.total_pessoas);

  // 🔥 funções para atualizar o total
  function incrementarTotal() {
    setTotalPessoas((prev: number) => prev + 1);
  }

  function decrementarTotal() {
    setTotalPessoas((prev: number) => (prev > 0 ? prev - 1 : 0));
  }

  return (
    <>
      <div className="space-y-2 mb-8 text-gray-700">
        <p><strong>Total de Pessoas:</strong> {totalPessoas}</p>
        <p><strong>Confirmados:</strong> {convite.confirmados}</p>
      </div>

      <ConvidadosList
        convidadosIniciais={convidados}
        conviteId={convite.id}
        onAdd={incrementarTotal}
        onRemove={decrementarTotal}
      />
    </>
  );
}
