import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";
import QrActions from "@/app/components/qrActions";
import { getConviteCompleto } from "@/lib/api/convites";
import ConviteInfo from "@/app/components/ConviteInfo";
import DeleteConviteButton from "@/app/components/DeleteConviteButton";

export default async function ConviteDetalhes({ params }: { params: { id: string } }) {
  const { id } = await params;
  const { convite, convidados } = await getConviteCompleto(id);

  if (!convite) {
    return (
      <p className="text-center mt-20 text-gray-600">
        Convite não encontrado.
      </p>
    );
  }

  const linkConfirmacao = `${process.env.NEXT_PUBLIC_URL}/confirmar?nome=${convite.nome}`;
  const qrCode = await QRCode.toDataURL(linkConfirmacao);

  return (
    <div className="max-w-3xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-green-700">
          Detalhes do Convite
        </h1>

        <Link
          href="/admin/convites"
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition shadow-sm"
        >
          Voltar
        </Link>
      </div>

      {/* CARD PRINCIPAL */}
      <div className="bg-white shadow-lg rounded-xl p-8 border border-green-100 relative">

        <DeleteConviteButton conviteId={convite.id} />

        <h2 className="text-2xl font-bold text-green-800 mb-6">
          {convite.nome}
        </h2>

        {/* Informações */}
        <div className="space-y-2 mb-8 text-gray-700 leading-relaxed">
          <p>
            <strong className="text-green-700">Telefone:</strong>{" "}
            {convite.telefone ? (
              convite.telefone
            ) : (
              <span className="text-gray-500 italic">Não informado</span>
            )}
          </p>

          <p>
            <strong className="text-green-700">Status:</strong>{" "}
            {convite.confirmados === convite.totalPessoas ? (
              <span className="text-green-600 font-semibold">Completo</span>
            ) : convite.confirmados > 0 ? (
              <span className="text-yellow-600 font-semibold">Parcial</span>
            ) : (
              <span className="text-gray-500 font-semibold">Pendente</span>
            )}
          </p>

          <p>
            <strong className="text-green-700">Total de pessoas:</strong>{" "}
            {convite.total_pessoas}
          </p>

          <p>
            <strong className="text-green-700">Confirmados:</strong>{" "}
            {convite.confirmados}
          </p>
        </div>

        {/* QR CODE */}
        <div className="bg-green-50 p-5 rounded-xl flex flex-col items-center border border-green-200 shadow-sm">
          <Image
            src={qrCode}
            alt="QR Code"
            width={220}
            height={220}
            className="mb-4 rounded-lg shadow"
          />

          {/* <p className="text-sm text-gray-700 break-all text-center mb-4">
            {linkConfirmacao}
          </p> */}

          <QrActions link={linkConfirmacao} qrCode={qrCode} nome={convite.nome} />
        </div>
      </div>

      {/* LISTA DE CONVIDADOS */}
      <div className="bg-white shadow-lg rounded-xl p-8 mt-10 border border-green-100">
        <h2 className="text-xl font-bold text-green-700 mb-4">
          Convidados do Convite
        </h2>

        {convidados.length === 0 && (
          <p className="text-gray-600">Nenhum convidado cadastrado.</p>
        )}

        <ConviteInfo convite={convite} convidados={convidados} />
      </div>

    </div>
  );
}
