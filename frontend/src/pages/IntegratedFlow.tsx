// frontend/src/pages/IntegratedFlow.tsx
import { useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  ShieldAlert,
  Layers,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { api } from "../services/api"; // Ponte de conexão do Axios

// 1. Alinhamento Estrito de Tipagens com o Neon Postgres
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

// Definição estática das colunas da esteira industrial
const COLUNAS = [
  {
    id: "RECEBIDO",
    titulo: "Recebido",
    cor: "border-t-blue-500 text-blue-400 bg-blue-500/5",
  },
  {
    id: "EM_ANALISE",
    titulo: "Em Análise",
    cor: "border-t-purple-500 text-purple-400 bg-purple-500/5",
  },
  {
    id: "EM_DESENVOLVIMENTO",
    titulo: "Em Desenvolvimento",
    cor: "border-t-yellow-500 text-yellow-400 bg-yellow-500/5",
  },
  {
    id: "EM_APROVACAO",
    titulo: "Aprovação",
    cor: "border-t-pink-500 text-pink-400 bg-pink-500/5",
  },
  {
    id: "CONCLUIDO",
    titulo: "Concluído",
    cor: "border-t-green-500 text-green-400 bg-green-500/5",
  },
] as const;

export function IntegratedFlow() {
  const [tarefas, setTarefas] = useState<TarefaItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizandoId, setAtualizandoId] = useState<string | null>(null);

  // Busca os dados reais da API toda vez que a tela monta
  async function carregarDemandas() {
    try {
      setCarregando(true);
      const resposta = await api.get("/tarefas");
      setTarefas(resposta.data);
    } catch (erro) {
      console.error("Erro ao sincronizar quadro Kanban:", erro);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDemandas();
  }, []);

  // Controla o avanço ou recuo do card atualizando o banco de dados via PATCH
  async function moverStatus(
    tarefaId: string,
    statusAtual: string,
    direcao: "proximo" | "anterior",
  ) {
    const ordemStatus: TarefaItem["status"][] = [
      "RECEBIDO",
      "EM_ANALISE",
      "EM_DESENVOLVIMENTO",
      "EM_APROVACAO",
      "CONCLUIDO",
    ];

    const indiceAtual = ordemStatus.indexOf(statusAtual as any);
    let novoIndice = direcao === "proximo" ? indiceAtual + 1 : indiceAtual - 1;

    // Evita estouro de limites do array de colunas
    if (novoIndice < 0 || novoIndice >= ordemStatus.length) return;

    const novoStatus = ordemStatus[novoIndice];
    if (!novoStatus) return;

    try {
      setAtualizandoId(tarefaId); // Ativa efeito visual de transição apenas no card movido

      // Faz o disparo de atualização parcial direto na rota PATCH do Fastify
      await api.patch(`/tarefas/${tarefaId}`, { status: novoStatus });

      // Atualização otimista no estado local para movimentação fluida na tela
      setTarefas((listaAntiga) =>
        listaAntiga.map((t) =>
          t.id === tarefaId ? { ...t, status: novoStatus } : t,
        ),
      );
    } catch (erro) {
      console.error("Falha ao salvar movimentação no Neon:", erro);
      alert(
        "Não foi possível mover o card. O servidor remoto está inacessível.",
      );
    } finally {
      setAtualizandoId(null);
    }
  }

  const getEstiloPrioridade = (p: string) => {
    switch (p) {
      case "Crítica":
        return "text-red-400 bg-red-500/10 border-red-500/20 font-bold animate-pulse";
      case "Alta":
        return "text-orange-400 bg-orange-500/10 border-orange-500/20";
      case "Média":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-8 ml-0 md:ml-64 transition-all duration-300">
      {/* Cabeçalho da Esteira */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
          Esteira de Fluxo Integrado
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Visualize e gerencie o ciclo completo das demandas operacionais.
        </p>
      </div>

      {carregando ? (
        <div className="flex flex-col items-center justify-center min-h-100t-teal-400 gap-3 font-medium">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-sm font-mono tracking-widest">
            SINCRONIZANDO PIPELINE...
          </span>
        </div>
      ) : (
        /* Grid das 5 Colunas Kanban */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 items-start">
          {COLUNAS.map((coluna) => {
            const tarefasDaColuna = tarefas.filter(
              (t) => t.status === coluna.id,
            );

            return (
              <div
                key={coluna.id}
                className={`bg-gray-900/60 border border-gray-800 border-t-4 rounded-2xl p-4 flex flex-col min-h-125dow-lg transition-all ${coluna.cor}`}
              >
                {/* Header da Coluna */}
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-800/60">
                  <span className="font-bold text-sm text-gray-200 tracking-wide">
                    {coluna.titulo}
                  </span>
                  <span className="bg-gray-950 border border-gray-800 px-2 py-0.5 rounded-md text-xs font-mono font-bold text-gray-400">
                    {tarefasDaColuna.length}
                  </span>
                </div>

                {/* Lista de Cards de Demandas */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-150 pr-1">
                  {tarefasDaColuna.length > 0 ? (
                    tarefasDaColuna.map((tarefa) => (
                      <div
                        key={tarefa.id}
                        className={`bg-gray-950 border border-gray-800/80 rounded-xl p-3.5 shadow-md hover:border-gray-700 transition-all group relative overflow-hidden ${
                          atualizandoId === tarefa.id
                            ? "opacity-40 pointer-events-none scale-95"
                            : ""
                        }`}
                      >
                        {/* Indicador superior do setor destino */}
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-teal-400 uppercase tracking-wider mb-2">
                          <Layers className="w-3 h-3 text-teal-500" />
                          <span className="truncate max-w-37.5">
                            {tarefa.setorDestino}
                          </span>
                        </div>

                        {/* Corpo/Título da tarefa */}
                        <p className="text-gray-200 text-xs font-medium leading-relaxed mb-3 group-hover:text-white transition-colors">
                          {tarefa.titulo}
                        </p>

                        {/* Footer do Card com Metadados */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-900 text-[11px]">
                          <div className="flex items-center gap-1 text-gray-400 font-mono">
                            <Calendar className="w-3 h-3 text-gray-600" />
                            <span>
                              {tarefa.prazo.split("/")[0]}/
                              {tarefa.prazo.split("/")[1]}
                            </span>
                          </div>

                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] border ${getEstiloPrioridade(tarefa.prioridade)}`}
                          >
                            {tarefa.prioridade}
                          </span>
                        </div>

                        {/* Controles de Navegação Lateral (Setinhas do Kanban) */}
                        <div className="flex items-center justify-end gap-1.5 mt-3 pt-2 border-t border-gray-900/40 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity">
                          {coluna.id !== "RECEBIDO" && (
                            <button
                              onClick={() =>
                                moverStatus(
                                  tarefa.id,
                                  tarefa.status,
                                  "anterior",
                                )
                              }
                              className="p-1 rounded-md bg-gray-900 border border-gray-800 hover:border-teal-500/40 hover:text-teal-400 transition-colors cursor-pointer"
                              title="Recuar etapa"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {coluna.id !== "CONCLUIDO" ? (
                            <button
                              onClick={() =>
                                moverStatus(tarefa.id, tarefa.status, "proximo")
                              }
                              className="p-1 rounded-md bg-gray-900 border border-gray-800 hover:border-teal-500/40 hover:text-teal-400 transition-colors cursor-pointer"
                              title="Avançar etapa"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <div className="flex items-center gap-1 text-green-400 text-[10px] font-bold px-1.5 py-0.5 bg-green-500/5 rounded-md border border-green-500/10">
                              <CheckCircle2 className="w-3 h-3 text-green-500" />{" "}
                              Finalizado
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 px-2 border border-dashed border-gray-800/40 rounded-xl text-center">
                      <ShieldAlert className="w-4 h-4 text-gray-700 mb-1" />
                      <span className="text-[10px] text-gray-600 font-mono uppercase">
                        Vazio
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
