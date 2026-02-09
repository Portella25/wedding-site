"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, QrCode } from "lucide-react";
import QRCode from "qrcode";
import { generatePixPayload } from "@/lib/pix";
import { Presente } from "@/types";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface PixModalProps {
  isOpen: boolean;
  onClose: () => void;
  presente: Presente;
  valor: number;
  guestId: string;
}

export default function PixModal({ isOpen, onClose, presente, valor, guestId }: PixModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [pixCode, setPixCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    if (isOpen && presente) {
      // Gerar Payload Pix
      // TODO: Substituir por chave real via ENV
      const payload = generatePixPayload({
        key: "leticiaeadriano@email.com", // Chave Pix (exemplo)
        name: "Leticia e Adriano",
        city: "Sao Paulo",
        txid: `GIFT${presente.id.substring(0, 4)}${Date.now().toString().substring(8)}`, // ID único curto
        value: valor,
        message: `Presente: ${presente.titulo}`,
      });

      setPixCode(payload);

      QRCode.toDataURL(payload, { width: 300, margin: 2 })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error(err));
    }
  }, [isOpen, presente, valor]);

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast.success("Código Pix copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      // Usar API Route para registrar pagamento e atualizar presente atomicamente
      const response = await fetch("/api/presentes/mark-paid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          presente_id: presente.id,
          convidado_id: guestId,
          valor: valor,
          mensagem: mensagem,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao processar");
      }

      toast.success("Pagamento registrado! Muito obrigado pelo presente!");
      onClose();
      // Opcional: Recarregar a página ou atualizar estado global para refletir mudança
      window.location.reload(); 
    } catch (err) {
      console.error(err);
      toast.error("Erro ao registrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-[var(--gold)] p-4 flex justify-between items-center text-white">
              <h3 className="font-serif text-xl flex items-center gap-2">
                <QrCode size={20} /> Pagamento via Pix
              </h3>
              <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="text-center mb-6">
                <p className="text-[var(--text-secondary)] mb-1">Você está presenteando com:</p>
                <h4 className="font-serif text-2xl text-[var(--gold-dark)] font-bold">{presente.titulo}</h4>
                <p className="text-xl font-bold mt-2 text-green-600">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor)}
                </p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-6">
                {qrCodeUrl ? (
                  <div className="p-2 border-2 border-[var(--gold-light)] rounded-xl">
                    <img src={qrCodeUrl} alt="QR Code Pix" className="w-48 h-48 md:w-56 md:h-56" />
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-gray-100 animate-pulse rounded-xl"></div>
                )}
              </div>

              {/* Copia e Cola */}
              <div className="mb-6">
                <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wide mb-2 block">
                  Código Copia e Cola
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pixCode}
                    readOnly
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-500 font-mono truncate"
                  />
                  <button
                    onClick={handleCopy}
                    className="bg-[var(--gold-light)] hover:bg-[var(--gold)] text-[var(--gold-dark)] hover:text-white p-2 rounded-lg transition-colors"
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              {/* Mensagem */}
              <div className="mb-6">
                <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                  Deixe uma mensagem carinhosa (opcional)
                </label>
                <textarea
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] outline-none min-h-[80px]"
                  placeholder="Escreva aqui..."
                />
              </div>

              <button
                onClick={handleConfirmPayment}
                disabled={loading}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-md disabled:opacity-70"
              >
                {loading ? "Registrando..." : "Já realizei o pagamento"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
