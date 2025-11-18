"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Users, XCircle } from "lucide-react";
import Swal from "sweetalert2";
import Header from "../Header";
import Footer from "../Footer";

interface Convite {
  nome: string;
  total_pessoas: number;
  confirmados: number;
}

interface Convidado {
  id: number;
  nome: string;
  confirmado: 0 | 1;
}

// 🔥 CONFIG GLOBAL DO SWEET ALERT — AGORA FUNCIONA
const Alert = Swal.mixin({
  backdrop: `
    rgba(0,0,0,0.55)
    left top
    no-repeat
  `,
  background: "rgba(255,255,255,0.85)",
  showClass: { popup: "animate__animated animate__fadeInDown" },
  hideClass: { popup: "animate__animated animate__fadeOutUp" },
});

export default function ConfirmarPresencaPage() {
  const router = useRouter();
  const search = useSearchParams();

  const [convite, setConvite] = useState<Convite | null>(null);
  const [convidados, setConvidados] = useState<Convidado[]>([]);
  const [loading, setLoading] = useState(true);

  // ✔ Confirma / remove convidado
  async function confirmarConvidado(convidado_id: number, confirmar: boolean) {
    try {
      const res = await fetch(`/api/convidados/${convite?.nome}`, {
        method: "POST",
        body: JSON.stringify({ convidado_id, confirmar }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.fire({
          icon: "warning",
          title: "Atenção",
          text: data.error,
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }

      // Atualiza convidado
      setConvidados((prev) =>
        prev.map((c) =>
          c.id === convidado_id ? { ...c, confirmado: confirmar ? 1 : 0 } : c
        )
      );

      // Atualiza totais
      setConvite((prev) =>
        prev
          ? {
              ...prev,
              confirmados: confirmar
                ? prev.confirmados + 1
                : prev.confirmados - 1,
            }
          : null
      );

      // Alert elegante
      Alert.fire({
        title: confirmar ? "Confirmado!" : "Removido! ❌",
        text: data.mensagem,
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (err) {
      Alert.fire("Erro", "Falha ao atualizar presença"+err, "error");
    }
  }

  // 🚪 Entrada da página — modal async/await
  useEffect(() => {
    async function pedirNome() {
        const validarNome = async (nome: string) => {
        try {
            const res = await fetch(`/api/convidados/${nome}`);
            const data = await res.json();

            if (!data || !data.convite) {
            await Alert.fire({
                title: "Nome não encontrado",
                text: "Verifique se está exatamente igual ao convite.",
                icon: "error",
                confirmButtonText: "Voltar",
                customClass: {
                popup: "rounded-2xl shadow-xl",
                confirmButton: "bg-red-600 text-white px-4 py-2 rounded-lg",
                },
            });
            router.push("/");
            return false;
            }

            setConvite(data.convite);
            setConvidados(data.convidados);
            return true;
        } catch (err) {
            Alert.fire("Erro", "Não foi possível validar o nome." + err, "error");
            router.push("/");
            return false;
        } finally {
            setLoading(false);
        }
        };

        let nome = search.get("nome") ?? "";

        if (!nome) {
        const result = await Swal.fire({
            title: "Digite seu nome",
            input: "text",
            inputPlaceholder: "Exatamente como no convite",
            confirmButtonText: "Continuar",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            backdrop: "rgba(0,0,0,0.5) blur(6px)",
            customClass: {
            popup: "rounded-2xl shadow-xl",
            input: "rounded-lg border border-green-300 p-2",
            confirmButton: "bg-green-600 text-white px-4 py-2 rounded-lg",
            cancelButton: "bg-gray-300 px-4 py-2 rounded-lg",
            },
        });

        if (!result.value) {
            router.push("/");
            return;
        }

        nome = result.value;
        }

        const valid = await validarNome(nome);

        if (!valid) {
            router.push(`/`);
            return;
        }

        router.push(`/confirmar?nome=${encodeURIComponent(nome)}`);
    }

    pedirNome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-green-700 text-lg">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <Header />

      <div className="px-6 py-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          Confirmação de Presença
        </h1>

        <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 space-y-6">
          {/* Cabeçalho do convite */}
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg shadow-sm">
              <Users className="text-green-700" size={28} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-green-800">
                {convite?.nome}
              </h2>

              <p className="text-gray-600">
                Permitido: {convite?.total_pessoas} pessoa(s)
              </p>

              <p className="text-green-700 font-bold">
                Confirmados: {convite?.confirmados}
              </p>
            </div>
          </div>

          {/* Lista de convidados */}
          <div className="space-y-4">
            {convidados.map((c) => (
              <div
                key={c.id}
                className="flex justify-between items-center bg-green-50 p-3 rounded-lg shadow-sm"
              >
                <span className="text-green-800 font-medium">{c.nome}</span>

                <button
                  onClick={() =>
                    confirmarConvidado(c.id, c.confirmado ? false : true)
                  }
                  className={`px-3 py-1 rounded-lg flex items-center gap-2 font-medium transition ${
                    c.confirmado
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  {c.confirmado ? (
                    <>
                      <XCircle size={18} /> Remover
                    </>
                  ) : (
                    <>
                      <Check size={18} /> Confirmar
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
