"use client";

import { motion } from "framer-motion";
import { Gift, Heart } from "lucide-react";
import { Presente } from "@/types";
import Image from "next/image";

interface GiftCardProps {
  presente: Presente;
  onSelect: (presente: Presente) => void;
  index: number;
}

export default function GiftCard({ presente, onSelect, index }: GiftCardProps) {
  const isAvailable = presente.disponivel;
  const isCota = presente.tipo === "cota";
  
  // Percentual arrecadado para cotas
  const percent = isCota && presente.preco > 0 
    ? Math.min(100, Math.round((presente.valor_arrecadado / presente.preco) * 100))
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col h-full group transition-all duration-300 ${
        isAvailable 
          ? "border-gray-100 hover:border-[var(--gold-light)] hover:shadow-xl" 
          : "border-gray-100 opacity-70 grayscale"
      }`}
    >
      <div className="relative h-48 w-full bg-gray-50 overflow-hidden">
        {presente.imagem_url ? (
          <Image
            src={presente.imagem_url}
            alt={presente.titulo}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[var(--champagne)] text-[var(--gold-light)]">
            <Gift size={48} strokeWidth={1} />
          </div>
        )}
        
        {!isAvailable && !isCota && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wider">
              Já presenteado
            </span>
          </div>
        )}

        {isCota && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                <div className="h-full bg-[var(--gold)]" style={{ width: `${percent}%` }}></div>
            </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] uppercase tracking-widest text-[var(--gold-dark)] font-bold border border-[var(--gold-light)] px-2 py-0.5 rounded-full">
                {presente.categoria || "Geral"}
            </span>
            {isCota && (
                <span className="text-xs text-[var(--text-secondary)]">
                    {percent}% arrecadado
                </span>
            )}
        </div>

        <h3 className="font-serif text-xl text-[var(--text-primary)] mb-2 line-clamp-2">
          {presente.titulo}
        </h3>
        
        <p className="text-sm text-[var(--text-secondary)] font-light mb-4 flex-grow">
          {presente.descricao}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-[var(--text-secondary)] uppercase">Valor</p>
              <p className="text-xl font-bold text-[var(--gold-dark)]">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(presente.preco)}
              </p>
            </div>
            
            <button
              onClick={() => isAvailable && onSelect(presente)}
              disabled={!isAvailable}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                isAvailable
                  ? "bg-[var(--gold)] hover:bg-[var(--gold-dark)] text-white shadow-md hover:shadow-lg"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Heart size={18} className={isAvailable ? "fill-white/20" : ""} />
              {isAvailable ? "Presentear" : "Indisponível"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
