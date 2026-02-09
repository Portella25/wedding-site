"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function WelcomePopup({ guestName }: { guestName: string }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("welcome_popup_seen");
    if (!hasSeenPopup) {
      // Pequeno delay para uma entrada mais suave
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("welcome_popup_seen", "true");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="relative bg-white max-w-lg w-full p-8 rounded-2xl shadow-2xl border border-[var(--gold-light)] text-center"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-[var(--gold)] transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-6">
              <h2 className="text-3xl md:text-4xl font-serif text-[var(--gold-dark)] mb-2">
                Bem-vindo(a)!
              </h2>
              <p className="text-xl text-[var(--text-primary)] font-light">
                {guestName}
              </p>
            </div>

            <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
              Estamos muito felizes em compartilhar este momento único com você. 
              Preparamos este espaço com muito carinho para que você possa acompanhar 
              todos os detalhes do nosso grande dia.
            </p>

            <button
              onClick={handleClose}
              className="px-8 py-3 bg-[var(--gold)] text-white rounded-full font-medium hover:bg-[var(--gold-dark)] transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Entrar no Site
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
