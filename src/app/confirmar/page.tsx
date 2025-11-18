"use client";

import { Suspense } from "react";
import ConfirmarPresencaContent from "../components/ConfirmarPresencaContent";

export default function ConfirmarPresencaPage() {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-black/10 flex items-center justify-center">Carregando...</div>}>
      <ConfirmarPresencaContent />
    </Suspense>
  );
}
