"use client";

import { useEffect, useState } from "react";
import { Check, X, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { getAdminPhotos, updatePhotoStatus, getAllApprovedPhotos } from "@/app/actions/admin";

type PhotoStatus = "pending" | "approved" | "rejected";

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<PhotoStatus>("pending");

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const data = await getAdminPhotos(activeTab);
      setPhotos(data || []);
    } catch (err) {
      toast.error("Erro ao carregar fotos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [activeTab]);

  const handleUpdateStatus = async (id: string, status: PhotoStatus) => {
    try {
      await updatePhotoStatus(id, status);
      toast.success(`Foto ${status === "approved" ? "aprovada" : "rejeitada"}!`);
      // Remover da lista local (otimização)
      setPhotos(photos.filter(p => p.id !== id));
    } catch (err) {
      toast.error("Erro ao atualizar status.");
    }
  };

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
        const zip = new JSZip();
        const folder = zip.folder("casamento-fotos");

        // Buscar todas as fotos aprovadas via Server Action
        const allPhotos = await getAllApprovedPhotos();
        
        if (!allPhotos || allPhotos.length === 0) {
            toast.error("Nenhuma foto aprovada para baixar.");
            return;
        }

        toast.info(`Iniciando download de ${allPhotos.length} fotos...`);

        const downloadPromises = allPhotos.map(async (photo: any) => {
            try {
                const response = await fetch(photo.url);
                const blob = await response.blob();
                const ext = photo.url.split('.').pop() || 'jpg';
                folder?.file(`foto-${photo.id}.${ext}`, blob);
            } catch (e) {
                console.error("Erro ao baixar foto", photo.id);
            }
        });

        await Promise.all(downloadPromises);

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "casamento-fotos.zip");
        toast.success("Download concluído!");

    } catch (err) {
        console.error(err);
        toast.error("Erro ao gerar ZIP.");
    } finally {
        setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Moderação de Fotos</h2>
          <p className="text-gray-500">Gerencie as fotos enviadas pelos convidados.</p>
        </div>

        <div className="flex gap-3">
            <button
                onClick={handleDownloadZip}
                disabled={downloading}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50"
            >
                {downloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                Baixar Aprovadas
            </button>

            <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm flex">
            {(["pending", "approved", "rejected"] as PhotoStatus[]).map((status) => (
                <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
                    activeTab === status
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                >
                {status === "pending" ? "Pendentes" : status === "approved" ? "Aprovadas" : "Rejeitadas"}
                </button>
            ))}
            </div>
        </div>
      </div>

      {loading ? (
         <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
         </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200 text-gray-400">
          <p>Nenhuma foto nesta categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col group">
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={photo.url}
                  alt={photo.legenda || "Foto"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                  {new Date(photo.created_at).toLocaleDateString()}
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {photo.convidados?.nome || "Convidado Desconhecido"}
                </p>
                {photo.legenda && (
                  <p className="text-sm text-gray-500 italic mb-4">"{photo.legenda}"</p>
                )}

                <div className="mt-auto flex gap-2 pt-4 border-t border-gray-50">
                  {activeTab === "pending" && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(photo.id, "approved")}
                        className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <Check size={16} /> Aprovar
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(photo.id, "rejected")}
                        className="flex-1 bg-red-50 text-red-700 hover:bg-red-100 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <X size={16} /> Rejeitar
                      </button>
                    </>
                  )}
                  {activeTab === "approved" && (
                     <button
                        onClick={() => handleUpdateStatus(photo.id, "rejected")}
                        className="flex-1 bg-red-50 text-red-700 hover:bg-red-100 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <X size={16} /> Rejeitar
                      </button>
                  )}
                   {activeTab === "rejected" && (
                     <button
                        onClick={() => handleUpdateStatus(photo.id, "approved")}
                        className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <Check size={16} /> Reaprovar
                      </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
