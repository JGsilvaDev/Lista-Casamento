"use client";

import Swal from "sweetalert2";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteConviteButton({ conviteId }: { conviteId: number }) {
  const router = useRouter();
  const [removendo, setRemovendo] = useState(false);

  async function deletar() {
    const confirm = await Swal.fire({
      title: "Excluir convite?",
      text: "Essa ação não pode ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    setRemovendo(true);

    const res = await fetch(`/api/convites/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: conviteId }),
    });

    if (!res.ok) {
      Swal.fire("Erro", "Não foi possível excluir o convite.", "error");
      return;
    }

    // Pequena animação antes de redirecionar
    setTimeout(() => {
      Swal.fire("Excluído!", "O convite foi removido com sucesso.", "success");
      router.push("/admin/convites");
    }, 600);
  }

  return (
    <button
      onClick={deletar}
      className={`absolute top-4 right-4 text-red-600 hover:text-red-700 
                 hover:bg-red-100 p-2 rounded-full transition cursor-pointer 
                 ${removendo ? "opacity-0 scale-75 transition-all duration-500" : ""}`}
      title="Excluir convite"
    >
      <Trash size={22} />
    </button>
  );
}
