"use client";

import { MapPin, Calendar, Shirt, Info, ExternalLink, Utensils } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function EventoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 text-green-900">
      <Header />

      <main className="flex flex-col items-center px-6 py-10">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 space-y-10 border border-green-100">

          {/* Título */}
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-green-800">Informações do Evento</h1>
            <p className="text-green-600 mt-1">
              Detalhes importantes para o nosso grande dia ❤️
            </p>
          </div>

          {/* --- Informação da Igreja --- */}
          <section className="space-y-3">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-lg shadow-sm">
                <MapPin className="text-green-700" size={26} />
              </div>
              <div>
                <h2 className="font-bold text-green-800 text-lg">Cerimônia – Igreja</h2>
                <p className="text-gray-700">Mosteiro Sagrada Face – Rua Joaquim dos Santos Filho 1 – Roseira</p>

                <a
                  href="https://www.google.com.br/maps/place/Mosteiro+da+Sagrada+Face,+Roseira+-+SP,+12580-000/@-22.9150885,-45.3063748,17z/data=!3m1!4b1!4m6!3m5!1s0x94cce78b7665fa7b:0xc253c3591b337a4d!8m2!3d-22.9150885!4d-45.3037999!16s%2Fg%2F11b6b61dyf?entry=ttu&g_ep=EgoyMDI1MTExMi4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  className="flex items-center gap-1 text-green-700 font-medium mt-2 hover:underline"
                >
                  Abrir no Google Maps
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </section>

          <hr className="border-green-100" />

          {/* --- Informação do Almoço --- */}
          <section className="space-y-3">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-lg shadow-sm">
                <Utensils className="text-green-700" size={26} />
              </div>
              <div>
                <h2 className="font-bold text-green-800 text-lg">Recepção & Almoço</h2>
                <p className="text-gray-700">Restaurante Colméia – Estrada Municipal Jesus Antônio de Miranda, km 6 – Pindamonhangaba</p>

                <a
                  href="https://www.google.com.br/maps/place/Restaurante+Colm%C3%A9ia/@-22.8591224,-45.4636627,17z/data=!3m1!4b1!4m6!3m5!1s0x94ccf19bd4b50545:0x769cff078f7ab5f3!8m2!3d-22.8591224!4d-45.4610878!16s%2Fg%2F11b7l3rwbr?entry=ttu&g_ep=EgoyMDI1MTExMi4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  className="flex items-center gap-1 text-green-700 font-medium mt-2 hover:underline"
                >
                  Ver no Google Maps
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </section>

          <hr className="border-green-100" />

          {/* --- Data e Horário --- */}
          <section className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-lg shadow-sm">
              <Calendar className="text-green-700" size={26} />
            </div>
            <div>
              <h2 className="font-bold text-green-800 text-lg">Data & Horário</h2>
              <p className="text-gray-700">05 de Junho de 2027</p>
              <p className="text-gray-700">Cerimônia às 09h00</p>
              <p className="text-gray-600 text-sm mt-1">Chegue com pelo menos 15 minutos de antecedência 💚</p>
            </div>
          </section>

          <hr className="border-green-100" />

          {/* --- Dress Code --- */}
          <section className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-lg shadow-sm">
              <Shirt className="text-green-700" size={26} />
            </div>
            <div>
              <h2 className="font-bold text-green-800 text-lg">Dress Code</h2>
              <p className="text-gray-700">Traje esporte fino</p>
            </div>
          </section>

          <hr className="border-green-100" />

          {/* --- Dicas Importantes --- */}
          <section className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-lg shadow-sm">
              <Info className="text-green-700" size={26} />
            </div>
            <div>
              <h2 className="font-bold text-green-800 text-lg">Dicas Importantes</h2>
              <ul className="text-gray-700 list-disc ml-5 space-y-1">
                <li>Evite usar branco ou tons muito claros.</li>
                <li>Confirme sua presença antecipadamente.</li>
                <li>Haverá estacionamento no local.</li>
              </ul>
            </div>
          </section>

          <hr className="border-green-100" />

          {/* --- Google Maps Embed Real --- */}
          <section>
            <h2 className="font-bold text-green-800 text-lg mb-3">Mapa do Local</h2>

            <div className="rounded-xl overflow-hidden shadow-md border border-green-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3659.436499319906!2d-45.306374799999996!3d-22.915088500000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cce78b7665fa7b%3A0xc253c3591b337a4d!2sMosteiro%20da%20Sagrada%20Face!5e0!3m2!1spt-BR!2sbr!4v1731851829000!5m2!1spt-BR!2sbr"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
