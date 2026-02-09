"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import GiftCard from "@/components/ui/GiftCard";
import PixModal from "@/components/ui/PixModal";
import { supabase } from "@/lib/supabase";
import { Presente } from "@/types";
import { ArrowLeft, Filter, Gift } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PresentesPage() {
  const [presentes, setPresentes] = useState<Presente[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"todos" | "disponiveis" | "indisponiveis">("todos");
  const [selectedGift, setSelectedGift] = useState<Presente | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestId, setGuestId] = useState<string>("");

  useEffect(() => {
    const fetchPresentes = async () => {
      try {
        const { data, error } = await supabase
          .from("presentes")
          .select("*")
          .order("preco", { ascending: true });

        if (error) throw error;
        if (data) setPresentes(data);
      } catch (err) {
        console.error("Erro ao buscar presentes:", err);
        // Mock data para demonstração se o banco estiver vazio
        setPresentes([
          {
            id: "1",
            titulo: "Jantar Romântico em Paris",
            descricao: "Um jantar inesquecível na Torre Eiffel para celebrar nossa lua de mel.",
            preco: 500,
            imagem_url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop",
            categoria: "Lua de Mel",
            tipo: "completo",
            valor_arrecadado: 0,
            disponivel: true,
          },
          {
            id: "2",
            titulo: "Passeio de Gôndola em Veneza",
            descricao: "Para curtirmos o romantismo dos canais italianos.",
            preco: 350,
            imagem_url: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2066&auto=format&fit=crop",
            categoria: "Lua de Mel",
            tipo: "completo",
            valor_arrecadado: 0,
            disponivel: true,
          },
          {
            id: "3",
            titulo: "Cafeteira Nespresso",
            descricao: "Para começarmos o dia com energia e amor.",
            preco: 800,
            imagem_url: "https://images.unsplash.com/photo-1517701604599-bb29b5dd7359?q=80&w=2070&auto=format&fit=crop",
            categoria: "Casa Nova",
            tipo: "completo",
            valor_arrecadado: 0,
            disponivel: true,
          },
          {
            id: "4",
            titulo: "Cota para Passagens Aéreas",
            descricao: "Ajude-nos a voar para o nosso destino dos sonhos.",
            preco: 5000,
            imagem_url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop",
            categoria: "Lua de Mel",
            tipo: "cota",
            valor_arrecadado: 1500,
            disponivel: true,
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPresentes();
    setGuestId(localStorage.getItem("guest_id") || "anon");
  }, []);

  const filteredPresentes = presentes.filter((p) => {
    if (filter === "todos") return true;
    if (filter === "disponiveis") return p.disponivel;
    if (filter === "indisponiveis") return !p.disponivel;
    return true;
  });

  const handleSelectGift = (presente: Presente) => {
    setSelectedGift(presente);
    setIsModalOpen(true);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[var(--champagne)]">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <Link href="/home" className="self-start md:self-auto flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--gold-dark)] transition-colors">
              <ArrowLeft size={20} />
              <span className="text-sm uppercase tracking-wider">Voltar</span>
            </Link>

            <div className="text-center">
              <h1 className="font-serif text-4xl text-[var(--gold-dark)] mb-2">Lista de Presentes</h1>
              <p className="text-[var(--text-secondary)] max-w-lg">
                Escolha um item para nos presentear. Sua contribuição fará parte da nossa nova história.
              </p>
            </div>

            <div className="w-full md:w-auto flex justify-center">
               {/* Espaço para balancear o header ou ação futura */}
               <div className="w-20 hidden md:block"></div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex justify-center mb-12">
            <div className="bg-white p-1 rounded-full shadow-sm border border-gray-100 flex items-center">
              <button
                onClick={() => setFilter("todos")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === "todos" ? "bg-[var(--gold)] text-white shadow-md" : "text-gray-500 hover:text-[var(--gold)]"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilter("disponiveis")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === "disponiveis" ? "bg-[var(--gold)] text-white shadow-md" : "text-gray-500 hover:text-[var(--gold)]"
                }`}
              >
                Disponíveis
              </button>
              <button
                onClick={() => setFilter("indisponiveis")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === "indisponiveis" ? "bg-[var(--gold)] text-white shadow-md" : "text-gray-500 hover:text-[var(--gold)]"
                }`}
              >
                Já Presenteados
              </button>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
             <div className="flex justify-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--gold)]"></div>
             </div>
          ) : (
            <>
              {filteredPresentes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {filteredPresentes.map((presente, index) => (
                    <GiftCard
                      key={presente.id}
                      presente={presente}
                      index={index}
                      onSelect={handleSelectGift}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-[var(--text-secondary)]">
                  <Gift size={48} className="mx-auto mb-4 opacity-30" />
                  <p>Nenhum presente encontrado nesta categoria.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal */}
        {selectedGift && (
          <PixModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            presente={selectedGift}
            valor={selectedGift.preco} // Se fosse cota, poderia ser parcial
            guestId={guestId}
          />
        )}
      </div>
    </AuthGuard>
  );
}
