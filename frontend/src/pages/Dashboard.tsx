// frontend/src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import {
  Layers,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { api } from "../services/api"; // Instância do Axios

export type SetorTipo =
  | "Atendimento ao Cliente"
  | "Coleta de Informações"
  | "Mídias"
  | "Escrita de Textos"
  | "Atendimento aos Fornecedores"
  | "Gerenciamento de Operações"
  | "Organização de Eventos";

export interface TarefaItem {
  id: string;
  titulo: string;
  setorDestino: SetorTipo;
  prioridade: "Baixa" | "Média" | "Alta" | "Crítica";
  status:
    | "RECEBIDO"
    | "EM_ANALISE"
    | "EM_DESENVOLVIMENTO"
    | "EM_APROVACAO"
    | "CONCLUIDO";
  prazo: string;
}

// Lista oficial dos 7 setores para renderização dos cards
const SETORES_OFICIAIS: SetorTipo[] = [
  "Atendimento ao Cliente",
  "Coleta de Informações",
  "Mídias",
  "Escrita de Textos",
  "Atendimento aos Fornecedores",
  "Gerenciamento de Operações",
  "Organização de Eventos",
];

export function Dashboard() {
  const [tarefas, setTarefas] = useState<TarefaItem[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Busca todas as demandas da fábrica salvas no Neon Postgres
  async function carregarDadosDashboard() {
    try {
      setCarregando(true);
      const resposta = await api.get("/tarefas");
      setTarefas(resposta.data);
    } catch (erro) {
      console.error("Erro ao alimentar estatísticas do Dashboard:", erro);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDadosDashboard();
  }, []);

  // Operações matemáticas de alta performance baseadas no estado da API
  const totalDemandas = tarefas.length;
  const concluidas = tarefas.filter((t) => t.status === "CONCLUIDO").length;
  const emAndamento = tarefas.filter(
    (t) => t.status !== "CONCLUIDO" && t.status !== "RECEBIDO",
  ).length;
  const criticas = tarefas.filter((t) => t.prioridade === "Crítica").length;

  // Porcentagem de eficiência operacional para a barra de progresso
  const taxaConclusao =
    totalDemandas > 0 ? Math.round((concluidas / totalDemandas) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-8 ml-0 md:ml-64 transition-all duration-300">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-white">
          Painel de Controle Estratégico
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Métricas gerais de produtividade das esteiras da SweetFlow.
        </p>
      </div>

      {carregando ? (
        <div className="flex flex-col items-center justify-center min-h-100 text-teal-400 gap-3 font-medium">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-sm font-mono tracking-widest">
            COMPILANDO MÉTRICAS DA AWS...
          </span>
        </div>
      ) : (
        <>
          {/* Grid de Cards de Alto Nível (KPIs Globais) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Card 1: Total */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Total de Demandas
                </span>
                <h3 className="text-3xl font-black text-white mt-1 font-mono">
                  {totalDemandas}
                </h3>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl text-blue-400">
                <Layers className="w-6 h-6" />
              </div>
            </div>

            {/* Card 2: Em Andamento */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Em Execução
                </span>
                <h3 className="text-3xl font-black text-white mt-1 font-mono">
                  {emAndamento}
                </h3>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl text-yellow-400">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            {/* Card 3: Concluídas */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Concluídas
                </span>
                <h3 className="text-3xl font-black text-white mt-1 font-mono">
                  {concluidas}
                </h3>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl text-green-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            {/* Card 4: Críticas */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Alertas Críticos
                </span>
                <h3 className="text-3xl font-black text-white mt-1 font-mono">
                  {criticas}
                </h3>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Seção Intermediária: Barra de Eficiência */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8 shadow-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-400" /> Eficiência
                Operacional Geral
              </span>
              <span className="text-sm font-black font-mono text-teal-400">
                {taxaConclusao}%
              </span>
            </div>
            <div className="w-full bg-gray-950 h-3 rounded-full border border-gray-800 overflow-hidden">
              <div
                className="bg-linear-to-r from-teal-500 to-emerald-500 h-full transition-all duration-500 rounded-full shadow-lg shadow-teal-500/20"
                style={{ width: `${taxaConclusao}%` }}
              />
            </div>
          </div>

          {/* Subtítulo dos Setores */}
          <h2 className="text-xl font-extrabold text-white mb-4 tracking-tight">
            Fluxo por Grupo Operacional
          </h2>

          {/* Grid dos 7 Setores Oficiais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {SETORES_OFICIAIS.map((nomeSetor) => {
              // Filtra as tarefas pertencentes a este setor específico
              const tarefasDoSetor = tarefas.filter(
                (t) => t.setorDestino === nomeSetor,
              );
              const totalDoSetor = tarefasDoSetor.length;
              const concluidasDoSetor = tarefasDoSetor.filter(
                (t) => t.status === "CONCLUIDO",
              ).length;

              return (
                <div
                  key={nomeSetor}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-4.5 hover:border-gray-700 transition-all flex flex-col justify-between shadow-md"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight leading-snug line-clamp-1">
                      {nomeSetor}
                    </h4>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl font-black text-teal-400 font-mono">
                        {totalDoSetor}
                      </span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">
                        demandas
                      </span>
                    </div>
                  </div>

                  {/* Micro barra de progresso interna do setor */}
                  <div className="mt-4 pt-3 border-t border-gray-800/60 flex items-center justify-between text-[11px] text-gray-400 font-mono">
                    <span>Concluídas: {concluidasDoSetor}</span>
                    <span className="bg-gray-950 border border-gray-800 px-1.5 py-0.5 rounded-sm text-[10px] font-bold text-gray-500">
                      {totalDoSetor > 0
                        ? Math.round((concluidasDoSetor / totalDoSetor) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
