"use client";

import { useEffect, useState } from "react";
import { Users, Image as ImageIcon, DollarSign, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getDashboardStats } from "@/app/actions/admin";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    confirmedGuests: 0,
    pendingGuests: 0,
    refusedGuests: 0,
    pendingPhotos: 0,
    totalRaised: 0,
    totalGuests: 0,
  });
  const [loading, setLoading] = useState(true);

  // Data do evento
  const eventDate = new Date("2026-02-08T16:00:00");
  const today = new Date();
  const daysLeft = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        toast.error("Erro ao carregar dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const chartData = [
    { name: 'Confirmados', value: stats.confirmedGuests, color: '#22c55e' }, // green-500
    { name: 'Pendentes', value: stats.pendingGuests, color: '#eab308' },   // yellow-500
    { name: 'Recusados', value: stats.refusedGuests, color: '#ef4444' },   // red-500
  ];

  const StatCard = ({ title, value, icon: Icon, color, delay }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between"
    >
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{loading ? "..." : value}</h3>
      </div>
      <div className={`p-4 rounded-full ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Visão Geral</h2>
        <p className="text-gray-500">Acompanhe o progresso do seu grande dia.</p>
      </div>

      {/* Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Dias Restantes"
          value={daysLeft}
          icon={Clock}
          color="bg-gray-900"
          delay={0.1}
        />
        <StatCard
          title="Confirmados"
          value={stats.confirmedGuests}
          icon={Users}
          color="bg-green-500"
          delay={0.2}
        />
        <StatCard
          title="Arrecadado"
          value={new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stats.totalRaised)}
          icon={DollarSign}
          color="bg-blue-500"
          delay={0.3}
        />
        <StatCard
          title="Fotos p/ Moderar"
          value={stats.pendingPhotos}
          icon={ImageIcon}
          color="bg-orange-500"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico de Presença */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
            <h3 className="text-lg font-bold mb-6">Status de Presença</h3>
            <div className="h-64 w-full">
                {stats.totalGuests > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Sem dados de convidados ainda.
                    </div>
                )}
            </div>
        </div>

        {/* Timeline / Tarefas */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold mb-6">Próximos Passos</h3>
            <div className="space-y-4">
                <div className="flex gap-3">
                    <div className="mt-1">
                        <AlertCircle size={20} className={stats.pendingPhotos > 0 ? "text-orange-500" : "text-gray-300"} />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Moderar Fotos</p>
                        <p className="text-sm text-gray-500">{stats.pendingPhotos} fotos aguardando sua aprovação.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="mt-1">
                        <AlertCircle size={20} className={daysLeft < 30 ? "text-red-500" : "text-gray-300"} />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Finalizar Lista</p>
                        <p className="text-sm text-gray-500">Garanta que todos os convites foram enviados.</p>
                    </div>
                </div>
                 {/* Item fictício de timeline */}
                 <div className="flex gap-3">
                    <div className="mt-1">
                        <Clock size={20} className="text-blue-500" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Degustação do Buffet</p>
                        <p className="text-sm text-gray-500">Agendado para 15/10/2025.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
