"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import { ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const defaultEvents = [
  {
    year: "2018",
    title: "O Primeiro Encontro",
    description: "Nos conhecemos em um café no centro da cidade. Uma conversa despretensiosa que durou horas e mudou nossas vidas para sempre.",
    image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=2071&auto=format&fit=crop",
  },
  {
    year: "2019",
    title: "O Primeiro Sim",
    description: "Oficializamos nosso namoro em uma viagem inesquecível para Campos do Jordão.",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1974&auto=format&fit=crop",
  },
  {
    year: "2021",
    title: "Nossa Primeira Casa",
    description: "Juntamos as escovas de dente e começamos a construir nosso lar, cheio de plantas e sonhos.",
    image: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=2070&auto=format&fit=crop",
  },
  {
    year: "2024",
    title: "O Pedido",
    description: "Sob a luz do luar, veio a pergunta mais importante e a resposta mais certa de todas.",
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop",
  },
  {
    year: "2026",
    title: "O Grande Dia",
    description: "Agora, estamos prontos para celebrar nosso amor com as pessoas mais especiais de nossas vidas: vocês!",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0202128?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function HistoriaPage() {
  const [events, setEvents] = useState(defaultEvents);
  const [customText, setCustomText] = useState("");

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase
        .from("configuracoes")
        .select("valor")
        .eq("chave", "history_text")
        .single();
      
      if (data?.valor) {
        setCustomText(data.valor as string);
      }
      const ev = await supabase.from("historia_eventos").select("*").order("ordem", { ascending: true });
      if (ev.data && ev.data.length > 0) {
        setEvents(
          ev.data.map((e: any) => ({
            year: e.ano,
            title: e.titulo,
            description: e.descricao,
            image: e.imagem_url || defaultEvents[0].image,
          }))
        );
      } else {
        const { data: cfg } = await supabase.from("configuracoes").select("valor").eq("chave", "history_events").single();
        const arr = (cfg?.valor as any[]) || [];
        if (arr.length > 0) {
          setEvents(
            arr.map((e: any, i: number) => ({
              year: e.ano || e.year,
              title: e.titulo || e.title,
              description: e.descricao || e.description,
              image: e.imagem_url || e.image || defaultEvents[i % defaultEvents.length].image,
            }))
          );
        }
      }
    };
    fetchConfig();
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[var(--champagne)]">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          {/* Header */}
          <div className="mb-12">
            <Link href="/home" className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--gold-dark)] transition-colors mb-6">
              <ArrowLeft size={20} />
              <span className="text-sm uppercase tracking-wider">Voltar</span>
            </Link>
            <div className="text-center">
              <Heart className="mx-auto text-[var(--gold)] mb-4 fill-[var(--gold)]" size={32} />
              <h1 className="font-serif text-4xl md:text-5xl text-[var(--gold-dark)] mb-4">Nossa História</h1>
              <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
                {customText || "Cada capítulo nos trouxe até aqui. Relembre conosco os momentos que marcaram nossa jornada."}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Linha Central */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-[var(--gold)]/30 -translate-x-1/2"></div>

            <div className="space-y-12 md:space-y-24 pb-20">
              {events.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className={`flex flex-col md:flex-row gap-8 items-center ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Imagem */}
                  <div className="w-full md:w-1/2 pl-8 md:pl-0">
                    <div className={`relative h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-xl border-4 border-white ${
                        index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"
                    }`}>
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>

                  {/* Marcador Central */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-[var(--gold)] rounded-full -translate-x-1/2 border-4 border-white shadow-md z-10"></div>

                  {/* Texto */}
                  <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-12 text-left md:text-center">
                    <span className="text-[var(--gold-dark)] font-bold text-lg md:text-xl block mb-2 font-serif">
                      {event.year}
                    </span>
                    <h3 className="text-2xl font-serif text-[var(--text-primary)] mb-3">
                      {event.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed text-sm md:text-base">
                      {event.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Fim da linha */}
            <div className="absolute left-4 md:left-1/2 bottom-0 w-3 h-3 bg-[var(--gold)]/30 rounded-full -translate-x-1/2"></div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
