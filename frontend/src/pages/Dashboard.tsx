// frontend/src/pages/Dashboard.tsx
import {
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  Headphones,
  Megaphone,
  Activity,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// Iniciamos os gráficos com valores zerados para a produção dos grupos
const dadosSetoresZerados = [
  { name: "Operações", tarefas: 0 },
  { name: "Mídia", tarefas: 0 },
  { name: "Escrita", tarefas: 0 },
  { name: "Atendimento", tarefas: 0 },
];

const dadosMensaisZerados = [
  { name: "Jan", demandas: 0 },
  { name: "Fev", demandas: 0 },
  { name: "Mar", demandas: 0 },
  { name: "Abr", demandas: 0 },
  { name: "Mai", demandas: 0 },
  { name: "Jun", demandas: 0 },
];

export function Dashboard() {
  // Todos os contadores oficiais iniciam em zero
  const cards = [
    {
      title: "Total de Tarefas",
      value: "0",
      icon: ClipboardList,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Tarefas Concluídas",
      value: "0",
      icon: CheckCircle2,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      title: "Tarefas Pendentes",
      value: "0",
      icon: AlertCircle,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      title: "Chamados Abertos",
      value: "0",
      icon: Headphones,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      title: "Campanhas Ativas",
      value: "0",
      icon: Megaphone,
      color: "text-pink-400",
      bg: "bg-pink-500/10",
    },
    {
      title: "Em Andamento",
      value: "0",
      icon: Activity,
      color: "text-teal-400",
      bg: "bg-teal-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-8 ml-0 md:ml-64 transition-all duration-300">
      {/* Cabeçalho */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-teal-400" /> Painel Operacional
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Indicadores e métricas em tempo real para a Indústria SweetFlow.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-xs bg-teal-500/10 text-teal-400 px-3 py-1 rounded-full border border-teal-500/20 font-mono">
            Ambiente: Produção Real
          </span>
        </div>
      </div>

      {/* Grade de Cards Informativos Zerados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Seção de Gráficos Prontos para Uso */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1: Demandas por Setor */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4">
            Distribuição de Tarefas por Setor
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosSetoresZerados}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    borderColor: "#374151",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="tarefas" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Volume de Demandas Mensal */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4">
            Histórico de Demandas (Mensal)
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dadosMensaisZerados}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    borderColor: "#374151",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="demandas"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
