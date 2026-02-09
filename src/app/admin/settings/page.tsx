"use client";

import { useState, useEffect } from "react";
import { Save, AlertTriangle, Settings as SettingsIcon, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { getSettings, saveSettings, getHistoryEvents, saveHistoryEvent, deleteHistoryEvent, reorderHistoryEvents } from "@/app/actions/admin";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    maintenance_mode: false,
    history_text: "Nos conhecemos em...",
    location_text: "Catedral Metropolitana",
  });
  const [events, setEvents] = useState<Array<any>>([]);
  const [savingEvents, setSavingEvents] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
        const data = await getSettings();
        if (data) {
          const newSettings: any = {};
          data.forEach((item: any) => {
            newSettings[item.chave] = item.valor;
          });
          setSettings(prev => ({ ...prev, ...newSettings }));
        }
        const ev = await getHistoryEvents();
        setEvents(ev || []);
    } catch (err) {
        toast.error("Erro ao carregar configurações.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      await saveSettings(settings);
      toast.success("Configurações salvas!");
    } catch (err) {
      toast.error("Erro ao salvar.");
    }
  };

  const handleAddEvent = () => {
    setEvents(prev => [...prev, { ano: "", titulo: "", descricao: "", imagem_url: "", ordem: prev.length }]);
  };

  const handleChangeEvent = (index: number, field: string, value: string) => {
    const next = [...events];
    next[index] = { ...next[index], [field]: value };
    setEvents(next);
  };

  const handleSaveEvents = async () => {
    setSavingEvents(true);
    try {
      const results = await Promise.allSettled(
        events.map((ev, i) => saveHistoryEvent({ ...ev, ordem: i }))
      );
      const ids = events.filter(e => e.id).map(e => e.id as string);
      if (ids.length) await reorderHistoryEvents(ids);
    } finally {
      try {
        await saveSettings({ history_events: events });
        toast.success("Eventos salvos!");
      } catch {
        toast.error("Erro ao salvar eventos.");
      }
      setSavingEvents(false);
    }
  };

  const handleDeleteEvent = async (index: number) => {
    const e = events[index];
    try {
      if (e.id) await deleteHistoryEvent(e.id);
      const next = [...events];
      next.splice(index, 1);
      setEvents(next.map((ev, i) => ({ ...ev, ordem: i })));
      toast.success("Evento removido.");
    } catch {
      toast.error("Erro ao remover evento.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Configurações do Site</h2>
          <p className="text-gray-500">Personalize textos e status do sistema.</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium"
        >
          <Save size={18} />
          Salvar Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status do Sistema */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <SettingsIcon size={20} className="text-gray-500" />
            Sistema
          </h3>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div>
              <span className="font-medium block">Modo Manutenção</span>
              <p className="text-sm text-gray-500">Desativa o acesso público ao site.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.maintenance_mode}
                onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          {settings.maintenance_mode && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded flex items-center gap-2">
              <AlertTriangle size={16} />
              O site está offline para visitantes!
            </div>
          )}
        </div>

        {/* Textos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Edit2 size={20} className="text-gray-500" />
            Conteúdo
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">História do Casal (Resumo)</label>
              <textarea
                rows={4}
                value={settings.history_text}
                onChange={(e) => setSettings({ ...settings, history_text: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Informações do Local</label>
              <input
                type="text"
                value={settings.location_text}
                onChange={(e) => setSettings({ ...settings, location_text: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Edit2 size={20} className="text-gray-500" />
            Linha do Tempo da História
          </h3>
          <div className="flex items-center gap-2">
            <button onClick={handleAddEvent} className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Adicionar Evento</button>
            <button onClick={handleSaveEvents} className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50" disabled={savingEvents}>{savingEvents ? "Salvando..." : "Salvar Eventos"}</button>
          </div>
        </div>
        <div className="space-y-4">
          {events.map((ev, index) => (
            <div key={ev.id ?? index} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Ano</label>
                  <input type="text" value={ev.ano || ""} onChange={(e) => handleChangeEvent(index, "ano", e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Título</label>
                  <input type="text" value={ev.titulo || ""} onChange={(e) => handleChangeEvent(index, "titulo", e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Imagem URL</label>
                  <input type="text" value={ev.imagem_url || ""} onChange={(e) => handleChangeEvent(index, "imagem_url", e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none" />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm text-gray-600 mb-1">Descrição</label>
                <textarea rows={3} value={ev.descricao || ""} onChange={(e) => handleChangeEvent(index, "descricao", e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none" />
              </div>
              <div className="mt-3 flex justify-end">
                <button onClick={() => handleDeleteEvent(index)} className="text-red-600 hover:text-red-700 px-3 py-2">Remover</button>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="text-sm text-gray-500">Nenhum evento cadastrado.</div>
          )}
        </div>
      </div>
    </div>
  );
}
