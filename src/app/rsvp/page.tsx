"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AuthGuard from "@/components/auth/AuthGuard";
import { supabase } from "@/lib/supabase";
import { triggerConfetti } from "@/lib/confetti";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Check, X, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface GuestData {
  id: string;
  nome: string;
  telefone: string;
  status_rsvp: "pendente" | "confirmado" | "recusado";
  acompanhantes_max: number;
  acompanhantes_confirmados: number;
  mensagem_rsvp: string;
}

export default function RSVPPage() {
  const { guestName } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<GuestData>({
    id: "",
    nome: guestName || "",
    telefone: "",
    status_rsvp: "pendente",
    acompanhantes_max: 0,
    acompanhantes_confirmados: 0,
    mensagem_rsvp: "",
  });

  useEffect(() => {
    const fetchGuestData = async () => {
      try {
        const token = localStorage.getItem("wedding_token");
        if (!token) return;

        // Tentar buscar do Supabase
        const { data: guest, error } = await supabase
          .from("convidados")
          .select("*")
          .eq("token", token)
          .single();

        if (error) {
          console.error("Erro ao buscar dados (pode ser falta de credenciais):", error);
          // Fallback para dados locais se Supabase falhar (para teste)
          setData((prev) => ({
            ...prev,
            id: "mock-id",
            nome: localStorage.getItem("guest_name") || "Convidado",
            acompanhantes_max: 2, // Mock
          }));
        } else if (guest) {
          setData(guest);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuestData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("wedding_token");
      
      // Atualizar no Supabase
      const { error } = await supabase
        .from("convidados")
        .update({
          status_rsvp: data.status_rsvp,
          acompanhantes_confirmados: data.acompanhantes_confirmados,
          mensagem_rsvp: data.mensagem_rsvp,
        })
        .eq("token", token);

      if (error) {
        // Se der erro (ex: sem credenciais), simular sucesso para UX
        console.warn("Simulando sucesso (Supabase error):", error);
        toast.warning("Modo de demonstração: Dados não salvos no banco.");
      } else {
        toast.success("Presença confirmada com sucesso!");
      }

      if (data.status_rsvp === "confirmado") {
        triggerConfetti();
        setTimeout(() => router.push("/home"), 3000);
      } else {
        toast.info("Agradecemos por nos avisar.");
        setTimeout(() => router.push("/home"), 2000);
      }
    } catch (err) {
      toast.error("Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[var(--champagne)] py-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-[var(--gold-light)] p-8 md:p-12 relative"
        >
          <Link href="/home" className="absolute top-6 left-6 text-[var(--text-secondary)] hover:text-[var(--gold)] transition-colors">
            <ArrowLeft size={24} />
          </Link>

          <div className="text-center mb-10 mt-4">
            <h1 className="font-serif text-4xl text-[var(--gold-dark)] mb-4">Confirmação de Presença</h1>
            <p className="text-[var(--text-secondary)]">
              Olá, <strong>{data.nome}</strong>! Por favor, confirme sua presença até <strong>20/01/2026</strong>.
            </p>
          </div>

          {loading ? (
             <div className="flex justify-center py-12">
               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--gold)]"></div>
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Seleção de Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setData({ ...data, status_rsvp: "confirmado" })}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${
                    data.status_rsvp === "confirmado"
                      ? "border-[var(--gold)] bg-[var(--gold-light)]/20 text-[var(--gold-dark)]"
                      : "border-gray-100 hover:border-[var(--gold-light)] text-gray-500"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${data.status_rsvp === "confirmado" ? "bg-[var(--gold)] text-white" : "bg-gray-100"}`}>
                    <Check size={24} />
                  </div>
                  <span className="font-medium text-lg">Sim, eu vou!</span>
                </button>

                <button
                  type="button"
                  onClick={() => setData({ ...data, status_rsvp: "recusado" })}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${
                    data.status_rsvp === "recusado"
                      ? "border-red-300 bg-red-50 text-red-600"
                      : "border-gray-100 hover:border-red-100 text-gray-500"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${data.status_rsvp === "recusado" ? "bg-red-500 text-white" : "bg-gray-100"}`}>
                    <X size={24} />
                  </div>
                  <span className="font-medium text-lg">Infelizmente não posso</span>
                </button>
              </div>

              {/* Campos Condicionais */}
              {data.status_rsvp === "confirmado" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-6 overflow-hidden"
                >
                  {data.acompanhantes_max > 0 && (
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                        <Users size={16} />
                        Total de pessoas (incluindo você)
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="1"
                          max={data.acompanhantes_max + 1} // +1 contando o titular
                          value={data.acompanhantes_confirmados || 1}
                          onChange={(e) => setData({ ...data, acompanhantes_confirmados: parseInt(e.target.value) })}
                          className="w-full accent-[var(--gold)]"
                        />
                        <span className="text-2xl font-serif text-[var(--gold-dark)] font-bold w-12 text-center">
                          {data.acompanhantes_confirmados || 1}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Seu convite permite até {data.acompanhantes_max + 1} pessoas.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Mensagem */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Deixe uma mensagem para os noivos (opcional)
                </label>
                <textarea
                  value={data.mensagem_rsvp || ""}
                  onChange={(e) => setData({ ...data, mensagem_rsvp: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] outline-none min-h-[100px] bg-white"
                  placeholder="Escreva algo especial..."
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-4 bg-[var(--gold)] hover:bg-[var(--gold-dark)] text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl disabled:opacity-70 text-lg tracking-wide"
              >
                {saving ? "Enviando..." : "Confirmar Resposta"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AuthGuard>
  );
}
