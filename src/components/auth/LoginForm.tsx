"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function LoginForm() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Por favor, digite seu código de acesso.");
      return;
    }

    setLoading(true);

    try {
      // Verifica se o token existe na tabela de convidados
      const { data, error } = await supabase
        .from("convidados")
        .select("*")
        .eq("token", token.trim())
        .single();

      if (error || !data) {
        toast.error("Código inválido. Verifique e tente novamente.");
        setLoading(false);
        return;
      }

      // Salva o token no localStorage (ou cookie)
      localStorage.setItem("wedding_token", token.trim());
      localStorage.setItem("guest_name", data.nome);
      localStorage.setItem("guest_id", data.id);

      toast.success(`Bem-vindo(a), ${data.nome}!`);
      
      // Redireciona para a home
      router.push("/home");
    } catch (err) {
      console.error(err);
      toast.error("Ocorreu um erro ao tentar entrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-[var(--gold-light)]"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-[var(--gold-dark)] mb-2">Acesso Exclusivo</h2>
        <p className="text-[var(--text-secondary)]">Digite o código presente no seu convite</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value.toUpperCase())}
            placeholder="CÓDIGO DO CONVITE"
            className="w-full px-4 py-3 text-center tracking-widest text-lg border border-[var(--gold-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent bg-white/50 uppercase placeholder:text-gray-400"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 bg-[var(--gold)] hover:bg-[var(--gold-dark)] text-white font-medium rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Verificando..." : "Entrar"}
        </button>
      </form>
    </motion.div>
  );
}
