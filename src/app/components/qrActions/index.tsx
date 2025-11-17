"use client";

interface QrActionsProps {
  link: string;
  qrCode: string;
  nome: string;
}

export default function QrActions({ link, qrCode, nome }: QrActionsProps) {

  function copiarLink() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      // API moderna (HTTPS)
      navigator.clipboard.writeText(link).catch(() => fallbackCopiar(link));
    } else {
      // Fallback para HTTP
      fallbackCopiar(link);
    }
  }

  function fallbackCopiar(texto: string) {
    const input = document.createElement("textarea");
    input.value = texto;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    alert("Link copiado!");
  }

  return (
    <div className="flex gap-3">
      <a
        href={qrCode}
        download={`${nome}_qrcode.png`}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition cursor-pointer"
      >
        Baixar QR
      </a>

      <button
        onClick={copiarLink}
        className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded transition cursor-pointer"
      >
        Copiar Link
      </button>
    </div>
  );
}
