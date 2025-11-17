"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Gift, Calendar, CheckCircle2 } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";

// DATA DO CASAMENTO
const weddingDate = new Date("2027-06-05T09:00:00");

export default function HomePage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // CONTADOR
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = weddingDate.getTime() - now.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 text-green-900">

      <Header />

      {/* HERO */}
      <section className="flex flex-col items-center text-center px-6 mt-10">
        <div className="relative">
          <Image
            src="/foto_casal.png"
            alt="Casal"
            width={260}
            height={260}
            className="rounded-full shadow-lg border-4 border-green-200 object-cover"
          />

          {/* Aura suave */}
          <div className="absolute -inset-3 rounded-full bg-green-200/20 animate-pulse" />
        </div>

        <h2 className="text-4xl md:text-5xl font-serif font-bold mt-6">
          O Grande Dia Está Chegando
        </h2>

        <p className="text-green-700 text-lg max-w-2xl mt-4 leading-relaxed font-light">
          Estamos muito felizes em compartilhar este momento especial com você.
          Encontre aqui nossa lista de presentes, informações e confirme sua presença.
        </p>
      </section>

      {/* CONTADOR */}
      <section className="max-w-3xl mx-auto mt-12 px-6">
        <div className="bg-white/60 backdrop-blur-lg border border-green-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-center text-xl font-semibold mb-6 opacity-80">
            Falta pouco para o nosso casamento
          </h3>

          <div className="grid grid-cols-4 gap-4 text-center">
            
            {/* Dia */}
            <div>
              <p className="text-4xl font-bold font-serif">{timeLeft.days}</p>
              <span className="text-sm text-green-700">dias</span>
            </div>

            {/* Horas */}
            <div>
              <p className="text-4xl font-bold font-serif">{timeLeft.hours}</p>
              <span className="text-sm text-green-700">horas</span>
            </div>

            {/* Minutos */}
            <div>
              <p className="text-4xl font-bold font-serif">{timeLeft.minutes}</p>
              <span className="text-sm text-green-700">min</span>
            </div>

            {/* Segundos */}
            <div>
              <p className="text-4xl font-bold font-serif">{timeLeft.seconds}</p>
              <span className="text-sm text-green-700">seg</span>
            </div>

          </div>
        </div>
      </section>

      {/* MENU DE AÇÕES */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 mt-16 pb-24">

        <Link href="/presentes">
          <div className="group bg-white/70 backdrop-blur-md border border-green-200 p-8 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
            <Gift className="w-14 h-14 mx-auto text-green-700 group-hover:text-green-900 transition" />
            <h3 className="text-xl font-semibold text-center mt-4">
              Lista de Presentes
            </h3>
            <p className="text-green-700 text-center text-sm mt-2">
              Veja e selecione o presente que deseja oferecer.
            </p>
          </div>
        </Link>

        <Link href="/confirmar-presenca">
          <div className="group bg-white/70 backdrop-blur-md border border-green-200 p-8 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
            <CheckCircle2 className="w-14 h-14 mx-auto text-green-700 group-hover:text-green-900 transition" />
            <h3 className="text-xl font-semibold text-center mt-4">
              Confirmar Presença
            </h3>
            <p className="text-green-700 text-center text-sm mt-2">
              Ajude-nos confirmando sua presença no grande dia.
            </p>
          </div>
        </Link>

        <Link href="/evento">
          <div className="group bg-white/70 backdrop-blur-md border border-green-200 p-8 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
            <Calendar className="w-14 h-14 mx-auto text-green-700 group-hover:text-green-900 transition" />
            <h3 className="text-xl font-semibold text-center mt-4">
              Informações do Evento
            </h3>
            <p className="text-green-700 text-center text-sm mt-2">
              Encontre local, horário e todas as informações importantes.
            </p>
          </div>
        </Link>

      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
