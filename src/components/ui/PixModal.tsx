"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, QrCode, DollarSign } from "lucide-react";
import QRCode from "qrcode";
import { generatePixPayload } from "@/lib/pix";
import { Presente } from "@/types";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

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
  
  // Payment Mode States
  const [paymentMode, setPaymentMode] = useState<'full' | 'partial'>('full');
  const [partialAmount, setPartialAmount] = useState<string>("");

  // Determine effective value based on mode
  const rawPartialValue = parseFloat(partialAmount.replace(',', '.')) || 0;
  const effectiveValue = paymentMode === 'full' 
    ? valor 
    : rawPartialValue;

  // Calculate remaining amount
  // Assuming presente.valor_arrecadado is available and up to date
  const remainingAmount = Math.max(0, valor - (presente.valor_arrecadado || 0));

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPaymentMode('full');
      setPartialAmount("");
      setMensagem("");
    }
  }, [isOpen]);

  useEffect(() => {
    // Only generate payload if value is valid according to rules
    const isValidPartial = paymentMode === 'partial' 
      ? (rawPartialValue >= 20 && rawPartialValue <= remainingAmount)
      : true;

    if (isOpen && presente && effectiveValue > 0 && isValidPartial) {
      // Gerar Payload Pix
      // TODO: Substituir por chave real via ENV
      const payload = generatePixPayload({
        key: "leticiaeadriano@email.com", // Chave Pix (exemplo)
        name: "Leticia e Adriano",
        city: "Sao Paulo",
        txid: `GIFT${presente.id.substring(0, 4)}${Date.now().toString().substring(8)}`, // ID único curto
        value: effectiveValue,
        message: `Presente: ${presente.titulo} (${paymentMode === 'partial' ? 'Parcial' : 'Total'})`,
      });

      setPixCode(payload);

      QRCode.toDataURL(payload, { width: 300, margin: 2 })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error(err));
    } else {
       // Clear code if invalid
       setPixCode("");
       setQrCodeUrl("");
    }
  }, [isOpen, presente, effectiveValue, paymentMode, rawPartialValue, remainingAmount]);

  const handleCopy = () => {
    if (!pixCode) return;
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast.success("Código Pix copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = async () => {
    // Validation Logic
    if (paymentMode === 'partial') {
        if (rawPartialValue < 20) {
            toast.error("O valor mínimo para pagamento parcial é de R$ 20,00.");
            return;
        }
        if (rawPartialValue > remainingAmount) {
            toast.error(`O valor máximo permitido é de R$ ${remainingAmount.toFixed(2).replace('.', ',')} (valor restante).`);
            return;
        }
    }

    if (effectiveValue <= 0) {
      toast.error("O valor do pagamento deve ser maior que zero.");
      return;
    }

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
          valor: effectiveValue,
          mensagem: mensagem,
          tipo_pagamento: paymentMode, // Optional: send mode if backend needs it
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

  const isPartialInvalid = paymentMode === 'partial' && (rawPartialValue < 20 || rawPartialValue > remainingAmount);
  const showQrCode = effectiveValue > 0 && qrCodeUrl && !isPartialInvalid;

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
                <h4 className="font-serif text-2xl text-[var(--gold-dark)] font-bold leading-tight">{presente.titulo}</h4>
                
                {/* Selector for gifts > 500 */}
                {valor > 500 && (
                  <div className="mt-4 flex bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setPaymentMode('full')}
                      className={cn(
                        "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                        paymentMode === 'full' 
                          ? "bg-white text-[var(--gold-dark)] shadow-sm" 
                          : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      Pagar Tudo
                    </button>
                    <button
                      onClick={() => setPaymentMode('partial')}
                      className={cn(
                        "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                        paymentMode === 'partial' 
                          ? "bg-white text-[var(--gold-dark)] shadow-sm" 
                          : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      Pagar Parcial
                    </button>
                  </div>
                )}

                {/* Display Value or Input */}
                <div className="mt-3">
                  {paymentMode === 'full' ? (
                    <p className="text-xl font-bold text-green-600">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor)}
                    </p>
                  ) : (
                    <div className="relative max-w-[150px] mx-auto">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">R$</span>
                      <input
                        type="text" // using text to handle currency formatting better manually if needed, or simple number
                        value={partialAmount}
                        onChange={(e) => {
                           // Allow only numbers and comma/dot
                           const val = e.target.value.replace(/[^0-9,.]/g, '');
                           setPartialAmount(val);
                        }}
                        placeholder="0,00"
                        className={cn(
                          "w-full pl-10 pr-4 py-2 border rounded-lg text-center text-lg font-bold text-green-600 focus:outline-none focus:ring-2",
                          isPartialInvalid && partialAmount ? "border-red-300 focus:ring-red-200" : "border-[var(--gold-light)] focus:ring-[var(--gold)]"
                        )}
                        autoFocus
                      />
                    </div>
                  )}
                  {paymentMode === 'partial' && (
                    <div className="mt-1 space-y-1">
                        <p className="text-xs text-gray-400">
                            Digite um valor entre <strong>R$ 20,00</strong> e <strong>{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(remainingAmount)}</strong>
                        </p>
                        {remainingAmount < valor && (
                            <p className="text-[10px] text-green-600 font-medium bg-green-50 py-1 px-2 rounded-full inline-block">
                                Já arrecadado: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(presente.valor_arrecadado || 0)}
                            </p>
                        )}
                    </div>
                  )}
                </div>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-6">
                {showQrCode ? (
                  <div className="p-2 border-2 border-[var(--gold-light)] rounded-xl relative">
                    <img src={qrCodeUrl} alt="QR Code Pix" className="w-48 h-48 md:w-56 md:h-56" />
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm text-center p-4">
                    {paymentMode === 'partial' && isPartialInvalid && partialAmount 
                        ? "Valor fora dos limites permitidos" 
                        : (effectiveValue <= 0 ? "Defina um valor" : "Carregando...")}
                  </div>
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
                    value={showQrCode ? pixCode : ""}
                    readOnly
                    placeholder={!showQrCode ? "Aguardando valor válido..." : ""}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-500 font-mono truncate"
                  />
                  <button
                    onClick={handleCopy}
                    disabled={!showQrCode}
                    className="bg-[var(--gold-light)] hover:bg-[var(--gold)] text-[var(--gold-dark)] hover:text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={loading || !showQrCode}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
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
