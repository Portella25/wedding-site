"use client";

import { useState, useEffect } from "react";
import { Plus, Upload, Trash2, Edit2, Search, X, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";
import { getGuests, saveGuest, deleteGuest } from "@/app/actions/admin";

export default function AdminGuestsPage() {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    acompanhantes_max: 0,
    mensagem_personalizada: "",
  });

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const data = await getGuests();
      setGuests(data || []);
    } catch (err) {
      toast.error("Erro ao carregar convidados.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleSave = async () => {
    if (!formData.nome) return toast.error("Nome é obrigatório");

    try {
      if (editingGuest) {
        await saveGuest({ ...formData, id: editingGuest.id });
        toast.success("Convidado atualizado!");
      } else {
        // Gerar token único simples (primeiro nome + random 4 chars)
        const token = (formData.nome.split(" ")[0] + Math.random().toString(36).substring(2, 6)).toUpperCase();
        await saveGuest({ ...formData, token });
        toast.success("Convidado criado!");
      }
      setIsModalOpen(false);
      setEditingGuest(null);
      setFormData({ nome: "", telefone: "", acompanhantes_max: 0, mensagem_personalizada: "" });
      fetchGuests();
    } catch (err: any) {
      toast.error("Erro ao salvar: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    try {
      await deleteGuest(id);
      toast.success("Convidado excluído.");
      setGuests(guests.filter(g => g.id !== id));
    } catch (err) {
      toast.error("Erro ao excluir.");
    }
  };

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: any) => {
        const rows = results.data;
        let successCount = 0;
        let errorCount = 0;

        // Processar em chunks ou um a um? Vamos um a um para feedback, mas paralelo seria melhor.
        const promises = rows.map(async (row: any) => {
            if (!row.nome) return;
            const token = (row.nome.split(" ")[0] + Math.random().toString(36).substring(2, 6)).toUpperCase();
            try {
                await saveGuest({
                    nome: row.nome,
                    telefone: row.telefone || "",
                    acompanhantes_max: parseInt(row.acompanhantes_max) || 0,
                    mensagem_personalizada: row.mensagem_personalizada || "",
                    token
                });
                successCount++;
            } catch (e) {
                errorCount++;
            }
        });

        await Promise.all(promises);
        toast.success(`Importação concluída: ${successCount} salvos, ${errorCount} erros.`);
        fetchGuests();
      },
      error: (err) => {
          toast.error("Erro ao ler CSV.");
      }
    });
  };

  const filteredGuests = guests.filter(g => 
    g.nome.toLowerCase().includes(search.toLowerCase()) || 
    g.token.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestão de Convidados</h2>
          <p className="text-gray-500">Gerencie a lista de presença e tokens de acesso.</p>
        </div>
        <div className="flex gap-3">
          <label className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium">
            <Upload size={18} />
            Importar CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleCSVImport} />
          </label>
          <button
            onClick={() => {
                setEditingGuest(null);
                setFormData({ nome: "", telefone: "", acompanhantes_max: 0, mensagem_personalizada: "" });
                setIsModalOpen(true);
            }}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Plus size={18} />
            Novo Convidado
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nome ou token..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Token</th>
                <th className="px-6 py-4">Acompanhantes</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                 <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Carregando...</td></tr>
              ) : filteredGuests.length === 0 ? (
                 <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Nenhum convidado encontrado.</td></tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{guest.nome}</td>
                    <td className="px-6 py-4">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono border border-gray-200 flex w-fit items-center gap-2">
                            {guest.token}
                            <button onClick={() => {navigator.clipboard.writeText(guest.token); toast.success("Copiado!");}} className="hover:text-blue-600"><Copy size={12} /></button>
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        {guest.acompanhantes_confirmados} / {guest.acompanhantes_max}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        guest.status_rsvp === 'confirmado' ? 'bg-green-100 text-green-700' :
                        guest.status_rsvp === 'recusado' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {guest.status_rsvp}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => {
                            setEditingGuest(guest);
                            setFormData({
                                nome: guest.nome,
                                telefone: guest.telefone || "",
                                acompanhantes_max: guest.acompanhantes_max,
                                mensagem_personalizada: guest.mensagem_personalizada || ""
                            });
                            setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(guest.id)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">{editingGuest ? "Editar Convidado" : "Novo Convidado"}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                    <input
                        type="text"
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <input
                        type="text"
                        value={formData.telefone}
                        onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Máx. Acompanhantes</label>
                    <input
                        type="number"
                        min="0"
                        value={formData.acompanhantes_max}
                        onChange={(e) => setFormData({...formData, acompanhantes_max: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem Personalizada</label>
                    <textarea
                        rows={3}
                        value={formData.mensagem_personalizada}
                        onChange={(e) => setFormData({...formData, mensagem_personalizada: e.target.value})}
                        placeholder="Ex: Querida tia, esperamos você!"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
                    />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">Salvar</button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
