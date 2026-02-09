"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import PhotoGallery from "@/components/memorias/PhotoGallery";
import UploadModal from "@/components/memorias/UploadModal";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Camera, Download } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

type MemoryPhoto = {
  id: string;
  url: string;
  legenda?: string;
  created_at?: string;
};

export default function MemoriasPage() {
  const [photos, setPhotos] = useState<MemoryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [guestId, setGuestId] = useState("");

  const fetchPhotos = async () => {
    try {
      // Buscar apenas fotos aprovadas
      const { data, error } = await supabase
        .from("fotos")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data)
        setPhotos(
          data.map((row) => ({ ...row, legenda: row.legenda ?? undefined }))
        );
    } catch (err) {
      console.error("Erro ao buscar fotos:", err);
      // Mock para demo
      if (photos.length === 0) {
          setPhotos([
              { id: '1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070', legenda: 'Cerimônia linda!' },
              { id: '2', url: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=2070', legenda: 'Os noivos' },
              { id: '3', url: 'https://images.unsplash.com/photo-1520854221256-17451cc330e7?q=80&w=2070', legenda: 'Festa!' },
          ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
    setGuestId(localStorage.getItem("guest_id") || "");
  }, []);

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
              <h1 className="font-serif text-4xl text-[var(--gold-dark)] mb-2">Nossas Memórias</h1>
              <p className="text-[var(--text-secondary)]">
                Compartilhe seus registros desse dia especial.
              </p>
            </div>

            <div className="flex gap-4">
               {/* Botão de Upload */}
               <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsUploadOpen(true)}
                className="flex items-center gap-2 bg-[var(--gold)] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[var(--gold-dark)] transition-colors font-medium"
              >
                <Camera size={20} />
                <span className="hidden md:inline">Enviar Foto</span>
              </motion.button>
            </div>
          </div>

          {/* Galeria */}
          {loading ? (
             <div className="flex justify-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--gold)]"></div>
             </div>
          ) : (
            <PhotoGallery photos={photos} />
          )}
        </div>

        {/* Modal */}
        <UploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          guestId={guestId}
          onSuccess={fetchPhotos}
        />
      </div>
    </AuthGuard>
  );
}
