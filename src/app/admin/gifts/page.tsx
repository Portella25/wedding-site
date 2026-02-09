"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, CheckCircle, XCircle, DollarSign, Package } from "lucide-react";
import { toast } from "sonner";
import { getGifts, saveGift, deleteGift, toggleGiftAvailability, getTransactions } from "@/app/actions/admin";

export default function AdminGiftsPage() {
  const [activeTab, setActiveTab] = useState<"inventory" | "transactions">("inventory");
  const [gifts, setGifts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal e Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<any>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    preco: 0,
    categoria: "Lua de Mel",
    tipo: "completo",
    imagem_url: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
        const giftsData = await getGifts();
        setGifts(giftsData || []);

        const transData = await getTransactions();
        setTransactions(transData || []);
    } catch (err) {
        toast.error("Erro ao carregar dados.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveGift = async () => {
    if (!formData.titulo) return toast.error("Título obrigatório");

    try {
      if (editingGift) {
        await saveGift({ ...formData, id: editingGift.id });
        toast.success("Presente atualizado!");
      } else {
        await saveGift(formData);
        toast.success("Presente criado!");
      }
      setIsModalOpen(false);
      setEditingGift(null);
      setFormData({ titulo: "", descricao: "", preco: 0, categoria: "Lua de Mel", tipo: "completo", imagem_url: "" });
      fetchData();
    } catch (err: any) {
      toast.error("Erro ao salvar: " + err.message);
    }
  };

  const toggleAvailability = async (id: string, current: boolean) => {
    try {
      await toggleGiftAvailability(id, current);
      fetchData();
      toast.success("Disponibilidade alterada.");
    } catch (err) {
      toast.error("Erro ao alterar.");
    }
  };

  const handleDeleteGift = async (id: string) => {
    if (!confirm("Excluir este presente?")) return;
    try {
      await deleteGift(id);
      fetchData();
      toast.success("Presente excluído.");
    } catch (err) {
      toast.error("Erro ao excluir.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestão de Presentes</h2>
          <p className="text-gray-500">Gerencie a lista e visualize os recebimentos.</p>
        </div>
        <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm flex">
            <button
              onClick={() => setActiveTab("inventory")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                activeTab === "inventory" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Package size={16} /> Inventário
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                activeTab === "transactions" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <DollarSign size={16} /> Extrato
            </button>
        </div>
      </div>

      {activeTab === "inventory" ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
           <div className="p-4 border-b border-gray-200 flex justify-end">
             <button
                onClick={() => {
                    setEditingGift(null);
                    setFormData({ titulo: "", descricao: "", preco: 0, categoria: "Lua de Mel", tipo: "completo", imagem_url: "" });
                    setIsModalOpen(true);
                }}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Plus size={18} /> Adicionar Presente
              </button>
           </div>
           
           <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                <tr>
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4">Valor</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {gifts.map((gift) => (
                    <tr key={gift.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{gift.titulo}</td>
                    <td className="px-6 py-4 text-gray-500">{gift.categoria}</td>
                    <td className="px-6 py-4 font-mono">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(gift.preco)}
                        {gift.tipo === 'cota' && <span className="text-xs text-gray-400 block">Arrecadado: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(gift.valor_arrecadado)}</span>}
                    </td>
                    <td className="px-6 py-4">
                        <button 
                            onClick={() => toggleAvailability(gift.id, gift.disponivel)}
                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${gift.disponivel ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                        >
                            {gift.disponivel ? <CheckCircle size={12} /> : <XCircle size={12} />}
                            {gift.disponivel ? 'Disponível' : 'Indisponível'}
                        </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => { setEditingGift(gift); setFormData(gift); setIsModalOpen(true); }} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit2 size={16} /></button>
                        <button onClick={() => handleDeleteGift(gift.id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
           </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">Total Arrecadado</h3>
                    <span className="text-2xl font-bold text-green-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                            transactions.reduce((acc, t) => acc + (t.status_pagamento === 'pago' ? Number(t.valor) : 0), 0)
                        )}
                    </span>
                </div>
            </div>
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                <tr>
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4">Convidado</th>
                    <th className="px-6 py-4">Presente</th>
                    <th className="px-6 py-4">Valor</th>
                    <th className="px-6 py-4">Status</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {transactions.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Nenhuma contribuição ainda.</td></tr>
                ) : (
                    transactions.map((t) => (
                        <tr key={t.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-500">{new Date(t.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-medium">{t.convidados?.nome || "Anônimo"}</td>
                        <td className="px-6 py-4">{t.presentes?.titulo || "Presente removido"}</td>
                        <td className="px-6 py-4 font-mono text-green-700 font-medium">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.valor)}
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${t.status_pagamento === 'pago' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {t.status_pagamento}
                            </span>
                        </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
      )}

      {/* Modal de Edição/Criação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">{editingGift ? "Editar Presente" : "Novo Presente"}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
            </div>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input type="text" value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <textarea value={formData.descricao} onChange={(e) => setFormData({...formData, descricao: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                        <input type="number" value={formData.preco} onChange={(e) => setFormData({...formData, preco: parseFloat(e.target.value)})} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                        <select value={formData.tipo} onChange={(e) => setFormData({...formData, tipo: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                            <option value="completo">Item Completo</option>
                            <option value="cota">Cota (Valor Aberto)</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <input type="text" value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="Ex: Lua de Mel, Casa Nova" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
                    <input type="text" value={formData.imagem_url} onChange={(e) => setFormData({...formData, imagem_url: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="https://..." />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                    <button onClick={handleSaveGift} className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">Salvar</button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
