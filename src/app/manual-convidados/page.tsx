"use client";

import { ElegantCard } from "@/components/ui/ElegantCard";
import AuthGuard from "@/components/auth/AuthGuard";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ManualConvidados() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[var(--champagne)] py-12 px-4 md:px-8 overflow-x-hidden">
        {/* Navigation Back */}
        <div className="max-w-6xl mx-auto mb-8">
          <Link 
            href="/home" 
            className="inline-flex items-center text-[var(--gold-dark)] hover:text-[var(--gold)] transition-colors uppercase tracking-widest text-xs font-serif gap-2"
          >
            <ArrowLeft size={14} />
            Voltar ao Início
          </Link>
        </div>

        <div className="max-w-4xl mx-auto space-y-16 pb-20">
          
          {/* Card 1: Intro */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <ElegantCard
              title="Manual dos Convidados"
              subtitle="Sejam bem-vindos ao nosso sonho"
              footer="1/4"
            >
              <p>
                Preparamos este guia com muito carinho para que vocês possam aproveitar cada momento deste dia tão especial conosco.
              </p>
              <p>
                Aqui vocês encontrarão informações sobre trajes, horários e dicas importantes.
              </p>
            </ElegantCard>
          </motion.div>

          {/* Card 2: Traje */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <ElegantCard
              title="Dress Code"
              subtitle="Passeio Completo"
              footer="2/4"
            >
              <p>
                Para as damas, vestidos longos ou midi em tons pastéis ou vibrantes. Evitem o branco, off-white e tons muito claros.
              </p>
              <p>
                Para os cavalheiros, terno completo e gravata. Cores como azul marinho, cinza e preto são ótimas opções.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                 {/* Color Palette Circles */}
                 <div className="w-8 h-8 rounded-full bg-[#E6B8B8] shadow-sm" title="Rosa Antigo"></div>
                 <div className="w-8 h-8 rounded-full bg-[#B8CCE6] shadow-sm" title="Azul Serenity"></div>
                 <div className="w-8 h-8 rounded-full bg-[#CDE6B8] shadow-sm" title="Verde Menta"></div>
                 <div className="w-8 h-8 rounded-full bg-[#E6D6B8] shadow-sm" title="Champagne"></div>
              </div>
            </ElegantCard>
          </motion.div>

          {/* Card 3: Dicas */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <ElegantCard
              title="Dicas Importantes"
              subtitle="Para o conforto de todos"
              footer="3/4"
            >
              <p>
                A cerimônia começará pontualmente às 16h00. Recomendamos chegar com 30 minutos de antecedência.
              </p>
              <p>
                Teremos estacionamento no local, mas se beber, não dirija. Sugerimos o uso de táxis ou aplicativos de transporte.
              </p>
            </ElegantCard>
          </motion.div>

          {/* Card 4: RSVP */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <ElegantCard
              title="Confirmação"
              subtitle="Sua presença é um presente"
              footer="4/4"
            >
              <p>
                Por favor, confirmem a presença até o dia 15 de Maio de 2026 através deste site.
              </p>
              <div className="mt-6">
                <Link 
                  href="/rsvp"
                  className="inline-block border-b border-[var(--gold)] text-[var(--gold)] hover:text-[var(--gold-dark)] hover:border-[var(--gold-dark)] transition-colors pb-1 uppercase tracking-widest text-sm"
                >
                  Confirmar Agora
                </Link>
              </div>
            </ElegantCard>
          </motion.div>

        </div>
      </div>
    </AuthGuard>
  );
}
