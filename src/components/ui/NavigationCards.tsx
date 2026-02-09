"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarCheck, Gift, Camera, BookOpen, Info, Star } from "lucide-react";

const cards = [
  {
    title: "Confirmar Presença",
    description: "Sua presença é essencial para nós.",
    icon: CalendarCheck,
    href: "/rsvp",
    delay: 0.1,
  },
  {
    title: "Lista de Presentes",
    description: "Mimos para nossa nova vida.",
    icon: Gift,
    href: "/presentes",
    delay: 0.2,
  },
  {
    title: "Manual dos Convidados",
    description: "Dicas e informações importantes.",
    icon: Info,
    href: "/manual-convidados",
    delay: 0.3,
  },
  {
    title: "Manual dos Padrinhos",
    description: "Para os nossos escolhidos.",
    icon: Star,
    href: "/manual-padrinhos",
    delay: 0.4,
  },
  {
    title: "Nossa História",
    description: "Como tudo começou.",
    icon: BookOpen,
    href: "/historia",
    delay: 0.5,
  },
  {
    title: "Memórias",
    description: "Compartilhe suas fotos conosco.",
    icon: Camera,
    href: "/memorias",
    delay: 0.6,
  },
];

export default function NavigationCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 mt-12 mb-20">
      {cards.map((card, index) => (
        <Link href={card.href} key={index} className="block h-full">
          <motion.div
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { delay: card.delay, duration: 0.6, ease: "easeOut" }
              },
              hover: { 
                y: -12, 
                scale: 1.02,
                boxShadow: "0 20px 40px -5px rgba(201, 163, 74, 0.15)", // Gold shadow
                borderColor: "rgba(201, 163, 74, 0.4)",
                transition: { duration: 0.3, ease: "easeOut" }
              },
              tap: { 
                scale: 0.97,
                boxShadow: "0 5px 15px -5px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.1 }
              }
            }}
            className="bg-white p-8 rounded-xl shadow-sm border border-transparent h-full flex flex-col items-center text-center cursor-pointer relative overflow-hidden"
          >
            {/* Background Gradient Effect on Hover */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-[#FDFBF7] to-white opacity-0"
              variants={{
                hover: { opacity: 1 }
              }}
            />

            <motion.div 
              className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center mb-4"
              variants={{
                visible: {
                  backgroundColor: "#FDFBF7", // var(--champagne)
                  color: "#9C8B7A", // var(--gold-dark)
                },
                hover: { 
                  backgroundColor: "#C9A34A", // var(--gold)
                  color: "#ffffff",
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                  transition: { 
                    rotate: { duration: 0.5, ease: "easeInOut", repeat: 0 },
                    backgroundColor: { duration: 0.3 },
                    scale: { duration: 0.3 }
                  }
                }
              }}
            >
              <card.icon size={28} strokeWidth={1.5} />
            </motion.div>

            <motion.h3 
              className="relative z-10 text-xl font-serif mb-2"
              variants={{
                visible: { color: "#2C2C2C" }, // var(--text-primary)
                hover: { color: "#C9A34A" } // var(--gold)
              }}
            >
              {card.title}
            </motion.h3>

            <p className="relative z-10 text-[#5A5A5A] text-sm font-light">
              {card.description}
            </p>

            {/* Shine Effect */}
            <motion.div
              className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
              variants={{
                hover: {
                  left: "100%",
                  transition: { duration: 0.7, ease: "easeInOut" }
                }
              }}
            />
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
