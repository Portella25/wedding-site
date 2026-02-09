"use client";

import { ElegantCard } from "@/components/ui/ElegantCard";
import AuthGuard from "@/components/auth/AuthGuard";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ManualPadrinhos() {
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
              title="Manual dos Padrinhos"
              subtitle="Pessoas especiais para um dia especial"
              footer="1/4"
            >
              <p>
                Vocês foram escolhidos a dedo para estarem ao nosso lado neste momento único.
              </p>
              <p>
                Este manual contém todas as informações necessárias para que vocês brilhem conosco no altar.
              </p>
            </ElegantCard>
          </motion.div>

          {/* Card 2: Madrinhas */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <ElegantCard
              title="Madrinhas"
              subtitle="Elegância e Harmonia"
              footer="2/4"
            >
              <p>
                Para manter a harmonia no altar, escolhemos uma paleta de tons de Terracota e Rose.
              </p>
              <p>
                O modelo do vestido é livre, desde que seja longo. Escolha o que te faz sentir mais linda!
              </p>
              <div className="mt-8 flex justify-center gap-4">
                 {/* Color Palette Circles */}
                 <div className="w-10 h-10 rounded-full bg-[#C27A7A] shadow-md border-2 border-white" title="Terracota"></div>
                 <div className="w-10 h-10 rounded-full bg-[#D69E9E] shadow-md border-2 border-white" title="Rose Antigo"></div>
                 <div className="w-10 h-10 rounded-full bg-[#EBC3C3] shadow-md border-2 border-white" title="Rose Claro"></div>
              </div>
            </ElegantCard>
          </motion.div>

          {/* Card 3: Padrinhos */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <ElegantCard
              title="Padrinhos"
              subtitle="Clássico e Sofisticado"
              footer="3/4"
            >
              <p>
                Para os padrinhos, definimos o uso de Terno Preto Clássico, Camisa Branca e a gravata que presenteamos vocês.
              </p>
              <p>
                Sapatos sociais pretos e cinto preto completam o visual.
              </p>
            </ElegantCard>
          </motion.div>

          {/* Card 4: Deveres */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <ElegantCard
              title="Missão dos Padrinhos"
              subtitle="Muito além do altar"
              footer="4/4"
            >
              <ul className="text-left list-none space-y-4 inline-block max-w-md mx-auto">
                <li className="flex gap-3">
                  <span className="text-[var(--gold)]">✦</span>
                  Animar a pista de dança até o fim
                </li>
                <li className="flex gap-3">
                  <span className="text-[var(--gold)]">✦</span>
                  Ajudar a organizar a gravata e sapatinho
                </li>
                <li className="flex gap-3">
                  <span className="text-[var(--gold)]">✦</span>
                  Estar sempre por perto para o que precisarmos
                </li>
              </ul>
            </ElegantCard>
          </motion.div>

        </div>
      </div>
    </AuthGuard>
  );
}
