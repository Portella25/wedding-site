"use client";

import { useAuth } from "@/hooks/useAuth";
import AuthGuard from "@/components/auth/AuthGuard";
import CountdownTimer from "@/components/ui/CountdownTimer";
import WelcomePopup from "@/components/ui/WelcomePopup";
import NavigationCards from "@/components/ui/NavigationCards";
import { ElegantCard } from "@/components/ui/ElegantCard";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

export default function HomePage() {
  const { guestName, logout } = useAuth();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[var(--champagne)] overflow-x-hidden">
        {/* Welcome Popup */}
        {guestName && <WelcomePopup guestName={guestName} />}

        {/* Hero Section with Background Photo */}
        <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 overflow-hidden">
          
          {/* Background Image */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-no-repeat transition-transform duration-[20s] ease-in-out hover:scale-105"
            style={{ 
              backgroundImage: "url('/hero-bg.jpg')", 
              backgroundPosition: "center 35%",
            }}
          />
          
          {/* Overlay - Gradient for readability */}
          <div 
            className="absolute inset-0 z-10"
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.5) 100%)"
            }}
          />

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative z-20 text-center space-y-6"
          >
             <h1 className="font-serif text-5xl md:text-8xl text-white tracking-tight drop-shadow-lg">
                Letícia <span className="text-[#E5D5A8]">&</span> Adriano
             </h1>
             
             <div className="flex items-center justify-center gap-4 text-white/95">
               <div className="h-[1px] w-12 bg-[#E5D5A8]/80 shadow-[0_1px_2px_rgba(0,0,0,0.3)]"></div>
               <p className="uppercase tracking-[0.3em] text-xs md:text-sm font-light drop-shadow-md">
                  19 . 09 . 2026
               </p>
               <div className="h-[1px] w-12 bg-[#E5D5A8]/80 shadow-[0_1px_2px_rgba(0,0,0,0.3)]"></div>
             </div>
          </motion.div>
        </section>

        {/* Countdown Section */}
        <section className="px-4 relative z-20 -mt-16 mb-12">
           <motion.div
             initial={{ opacity: 0, y: 40 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5, duration: 0.8 }}
           >
             <ElegantCard className="max-w-5xl py-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)]">
                <div className="mb-2">
                  <p className="text-[#9a9a9a] uppercase tracking-[0.2em] text-[10px] md:text-xs font-medium">
                     Nos vemos em breve
                  </p>
                </div>
                <CountdownTimer />
             </ElegantCard>
           </motion.div>
        </section>

        {/* Navigation Cards */}
        <section className="py-12 bg-white/50 backdrop-blur-sm">
          <NavigationCards />
        </section>

        {/* Footer com Logout */}
        <footer className="py-12 text-center">
          <button
            onClick={logout}
            className="inline-flex items-center text-[#9C8B7A] hover:text-[#C9A34A] transition-colors text-xs uppercase tracking-widest gap-2"
          >
            <LogOut size={14} />
            Sair
          </button>
          
          <p className="mt-8 text-[10px] text-[#9C8B7A]/50 uppercase tracking-widest">
            Feito com amor ❤️
          </p>
        </footer>
      </div>
    </AuthGuard>
  );
}
