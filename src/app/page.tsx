import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[var(--champagne)]">
      {/* Background Pattern ou Imagem */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--gold-light)] rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--gold)] rounded-full blur-3xl opacity-10 translate-x-1/3 translate-y-1/3"></div>

      <div className="z-10 flex flex-col items-center justify-center w-full px-4">
        {/* Logo / Monograma */}
        <div className="mb-12 text-center">
          <h1 className="font-serif text-5xl md:text-7xl text-[var(--gold-dark)] mb-4 tracking-tight">
            Letícia <span className="text-[var(--gold)]">&</span> Adriano
          </h1>
          <p className="text-[var(--text-secondary)] tracking-[0.2em] uppercase text-sm md:text-base">
            19 . 09 . 2026
          </p>
        </div>

        {/* Login Form */}
        <LoginForm />

        <footer className="mt-16 text-[var(--text-secondary)] text-sm opacity-60">
          <p>Feito com amor ❤️</p>
        </footer>
      </div>
    </main>
  );
}
