// frontend/src/pages/Fluxo.tsx
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Inbox,
  Eye,
  AlertCircle,
} from "lucide-react";
import type { TarefaItem } from "./Operacoes";

// Definição das colunas do Kanban baseadas no nosso Schema
const COLUNAS = [
  {
    id: "RECEBIDO",
    titulo: "Recebido",
    icon: Inbox,
    color: "text-blue-400",
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
  },
  {
    id: "EM_ANALISE",
    titulo: "Em Análise",
    icon: Eye,
    color: "text-purple-400",
    border: "border-purple-500/20",
    bg: "bg-purple-500/5",
  },
  {
    id: "EM_DESENVOLVIMENTO",
    titulo: "Em Progresso",
    icon: Clock,
    color: "text-yellow-400",
    border: "border-yellow-500/20",
    bg: "bg-yellow-500/5",
  },
  {
    id: "EM_APROVACAO",
    titulo: "Em Aprovação",
    icon: AlertCircle,
    color: "text-pink-400",
    border: "border-pink-500/20",
    bg: "bg-pink-500/5",
  },
  {
    id: "CONCLUIDO",
    titulo: "Concluído",
    icon: CheckCircle2,
    color: "text-green-400",
    border: "border-green-500/20",
    bg: "bg-green-500/5",
  },
];

export function Fluxo() {
  const [tarefas, setTarefas] = useState<TarefaItem[]>(() => {
    const dadosSalvos = localStorage.getItem("@sweetflow:tarefas");
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  });

  // Salva no localStorage sempre que um card for movido de coluna
  useEffect(() => {
    localStorage.setItem("@sweetflow:tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  // Função cirúrgica para mover o status do card para frente ou para trás
  const moverStatus = (id: string, direcao: "avancar" | "recuar") => {
    const ordemStatus: TarefaItem["status"][] = [
      "RECEBIDO",
      "EM_ANALISE",
      "EM_DESENVOLVIMENTO",
      "EM_APROVACAO",
      "CONCLUIDO",
    ];

    setTarefas((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;

        const indexAtual = ordemStatus.indexOf(t.status);
        let novoIndex = indexAtual;

        if (direcao === "avancar" && indexAtual < ordemStatus.length - 1)
          novoIndex++;
        if (direcao === "recuar" && indexAtual > 0) novoIndex--;

        return { ...t, status: ordemStatus[novoIndex] };
      }),
    );
  };

  const getEstiloPrioridade = (p: string) => {
    switch (p) {
      case "Crítica":
        return "text-red-400 bg-red-500/10 border-red-500/20 font-bold";
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
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-white">
          Fluxo de Trabalho Integrado
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Gerencie os gargalos operacionais arrastando os fluxos pelas esteiras
          da fábrica.
        </p>
      </div>

      {/* Container das Colunas do Kanban */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
        {COLUNAS.map((coluna) => {
          const tarefasDaColuna = tarefas.filter((t) => t.status === coluna.id);

          return (
            <div
              key={coluna.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col min-w-62.5 shadow-xl"
            >
              {/* Header da Coluna */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-800/60">
                <div className="flex items-center gap-2">
                  <coluna.icon className={`w-4 h-4 ${coluna.color}`} />
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    {coluna.titulo}
                  </h3>
                </div>
                <span className="text-xs bg-gray-950 text-gray-500 px-2 py-0.5 rounded-md border border-gray-800 font-mono font-bold">
                  {tarefasDaColuna.length}
                </span>
              </div>

              {/* Lista de Cards da Coluna */}
              <div className="space-y-3 min-h-100">
                {tarefasDaColuna.length > 0 ? (
                  tarefasDaColuna.map((tarefa) => (
                    <div
                      key={tarefa.id}
                      className="bg-gray-950 border border-gray-800 rounded-xl p-3.5 shadow-lg hover:border-gray-700 transition-colors flex flex-col justify-between gap-3 group"
                    >
                      {/* Título e Setor */}
                      <div>
                        <span className="text-[10px] uppercase font-black text-teal-400 tracking-wider">
                          {tarefa.setorDestino}
                        </span>
                        <h4 className="text-xs font-semibold text-gray-200 mt-1 leading-relaxed wrap-break-word">
                          {tarefa.titulo}
                        </h4>
                      </div>

                      {/* Footer do Card (Responsável e Prioridade) */}
                      <div className="flex justify-between items-center border-t border-gray-900 pt-2 text-[11px]">
                        <span className="text-gray-400 font-medium truncate max-w-25">
                          👤 {tarefa.responsavel}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded border text-[10px] ${getEstiloPrioridade(tarefa.prioridade)}`}
                        >
                          {tarefa.prioridade}
                        </span>
                      </div>

                      {/* Botões de Ação de Movimentação */}
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-900/60 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          disabled={coluna.id === "RECEBIDO"}
                          onClick={() => moverStatus(tarefa.id, "recuar")}
                          className="p-1.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition-colors"
                          title="Recuar status"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>

                        <span className="text-[10px] text-gray-600 font-mono">
                          ID: {tarefa.id.slice(-4)}
                        </span>

                        <button
                          disabled={coluna.id === "CONCLUIDO"}
                          onClick={() => moverStatus(tarefa.id, "avancar")}
                          className="p-1.5 rounded-lg bg-linear-to-r from-teal-500/20 to-emerald-500/20 border border-teal-500/30 text-teal-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition-colors"
                          title="Avançar status"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-600 text-xs border border-dashed border-gray-800/40 rounded-xl">
                    Sem demandas aqui
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
