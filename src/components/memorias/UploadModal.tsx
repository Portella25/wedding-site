"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestId: string;
  onSuccess: () => void;
}

export default function UploadModal({ isOpen, onClose, guestId, onSuccess }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [legenda, setLegenda] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const originalFile = e.target.files[0];
      
      // Validar tipo
      if (!originalFile.type.startsWith("image/")) {
        toast.error("Por favor, selecione apenas imagens.");
        return;
      }

      try {
        // Comprimir imagem
        const options = {
          maxSizeMB: 2,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        
        const compressedFile = await imageCompression(originalFile, options);
        setFile(compressedFile);
        setPreview(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error("Erro na compressão:", error);
        toast.error("Erro ao processar imagem.");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      // 1. Obter URL assinada
      const resUrl = await fetch("/api/memorias/upload-url", {
        method: "POST",
        body: JSON.stringify({
          filename: file.name,
          fileType: file.type,
        }),
      });

      const { uploadUrl, key, error, mock } = await resUrl.json();

      if (error) throw new Error(error);

      // 2. Upload para R2/S3 (se não for mock)
      if (!mock) {
          const uploadRes = await fetch(uploadUrl, {
            method: "PUT",
            body: file,
            headers: {
              "Content-Type": file.type,
            },
          });

          if (!uploadRes.ok) throw new Error("Falha no upload para o storage.");
      } else {
          console.warn("MOCK UPLOAD: Simulando envio para R2");
          await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // 3. Registrar no banco
      const resReg = await fetch("/api/memorias/register", {
        method: "POST",
        body: JSON.stringify({
          guestId,
          key,
          legenda,
        }),
      });

      const regResult = await resReg.json();

      if (regResult.error) throw new Error(regResult.error);

      toast.success("Foto enviada com sucesso! Ela aparecerá após aprovação.");
      onSuccess();
      onClose();
      setFile(null);
      setPreview(null);
      setLegenda("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao enviar foto.";
      console.error(message);
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-[var(--gold)] p-4 flex justify-between items-center text-white">
              <h3 className="font-serif text-xl flex items-center gap-2">
                <Upload size={20} /> Compartilhar Memória
              </h3>
              <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {!preview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl h-48 flex flex-col items-center justify-center text-gray-400 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <ImageIcon size={48} className="mb-2" />
                  <p className="text-sm">Toque para selecionar uma foto</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative h-48 rounded-xl overflow-hidden border border-gray-200">
                    <img src={preview} alt="Preview" className="w-full h-full object-contain bg-gray-50" />
                    <button
                      onClick={() => {
                        setFile(null);
                        setPreview(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">
                      Legenda (opcional)
                    </label>
                    <input
                      type="text"
                      value={legenda}
                      onChange={(e) => setLegenda(e.target.value)}
                      placeholder="Quem está na foto?"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="w-full py-3 bg-[var(--gold)] hover:bg-[var(--gold-dark)] text-white font-medium rounded-lg transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Foto"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
