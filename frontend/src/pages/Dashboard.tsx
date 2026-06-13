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
import { api } from "../services/api";

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

  const totalDemandas = tarefas.length;
  const concluidas = tarefas.filter((t) => t.status === "CONCLUIDO").length;
  const emAndamento = tarefas.filter(
    (t) => t.status !== "CONCLUIDO" && t.status !== "RECEBIDO",
  ).length;
  const criticas = tarefas.filter((t) => t.prioridade === "Crítica").length;

  const taxaConclusao =
    totalDemandas > 0 ? Math.round((concluidas / totalDemandas) * 100) : 0;

  if (carregando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-teal-400 gap-3 font-medium">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-xs font-mono tracking-widest uppercase">
          Carregando dados do Dashboard...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 sm:p-6 md:p-8 overflow-x-hidden">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
          Painel de Controle Estratégico
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
          Visão geral das operações e desempenho dos grupos operacionais.
        </p>
      </div>

      {/* Grid de Cards KPIs Globais: Duas colunas em mobile compacto para salvar espaço */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {/* Total */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3.5 flex items-center justify-between shadow-md">
          <div>
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Total
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5 font-mono">
              {totalDemandas}
            </h3>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 p-2 rounded-lg text-blue-400 hidden sm:block">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        {/* Em Andamento */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3.5 flex items-center justify-between shadow-md">
          <div>
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Execução
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5 font-mono">
              {emAndamento}
            </h3>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-2 rounded-lg text-yellow-400 hidden sm:block">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Concluídas */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3.5 flex items-center justify-between shadow-md">
          <div>
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Concluídas
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5 font-mono">
              {concluidas}
            </h3>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 p-2 rounded-lg text-green-400 hidden sm:block">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        {/* Críticas */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3.5 flex items-center justify-between shadow-md">
          <div>
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Críticos
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5 font-mono">
              {criticas}
            </h3>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 p-2 rounded-lg text-red-400 hidden sm:block">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Barra de Eficiência */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6 shadow-md">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-teal-400" /> Eficiência
            Geral
          </span>
          <span className="text-xs font-black font-mono text-teal-400">
            {taxaConclusao}%
          </span>
        </div>
        <div className="w-full bg-gray-950 h-2 rounded-full border border-gray-800/60 overflow-hidden">
          <div
            className="bg-linear-to-r from-teal-500 to-emerald-500 h-full transition-all duration-500 rounded-full"
            style={{ width: `${taxaConclusao}%` }}
          />
        </div>
      </div>

      {/* Subtítulo dos Setores */}
      <h2 className="text-base font-black text-white mb-3 uppercase tracking-wider">
        Fluxo por Grupo Operacional
      </h2>

      {/* Grid de Setores Remodelado: Lista corrida e compacta em telas menores */}
      {/* Substitua a linha do grid de setores por esta abaixo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {SETORES_OFICIAIS.map((nomeSetor) => {
          const tarefasDoSetor = tarefas.filter(
            (t) => t.setorDestino === nomeSetor,
          );
          const totalDoSetor = tarefasDoSetor.length;
          const concluidasDoSetor = tarefasDoSetor.filter(
            (t) => t.status === "CONCLUIDO",
          ).length;
          const porcetagemSetor =
            totalDoSetor > 0
              ? Math.round((concluidasDoSetor / totalDoSetor) * 100)
              : 0;

          return (
            <div
              key={nomeSetor}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col justify-between shadow-md hover:border-gray-700 transition-all"
            >
              <div className="flex flex-col gap-1">
                <h4
                  className="text-sm font-bold text-gray-200 tracking-tight leading-snug line-clamp-1"
                  title={nomeSetor}
                >
                  {nomeSetor}
                </h4>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-2xl font-black text-teal-400 font-mono">
                    {totalDoSetor}
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wide font-bold">
                    demandas
                  </span>
                </div>
              </div>

              {/* Micro indicador de progresso interno */}
              <div className="mt-4 pt-3 border-t border-gray-800/50 flex items-center justify-between text-[11px] text-gray-400 font-mono">
                <span>Feitas: {concluidasDoSetor}</span>
                <span className="bg-gray-950 border border-gray-800 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-teal-400">
                  {porcetagemSetor}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
