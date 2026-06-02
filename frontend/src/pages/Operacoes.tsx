// frontend/src/pages/Operacoes.tsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Filter,
  Search,
  Calendar,
  SlidersHorizontal,
} from "lucide-react";

interface TarefaItem {
  id: string;
  titulo: string;
  setor: string;
  responsavel: string;
  prioridade: "Baixa" | "Média" | "Alta" | "Crítica";
  status:
    | "RECEBIDO"
    | "EM_ANALISE"
    | "EM_DESENVOLVIMENTO"
    | "EM_APROVACAO"
    | "CONCLUIDO";
  prazo: string;
}

export function Operacoes() {
  // 1. Inicializa o estado buscando os dados salvos no navegador, ou um array vazio se não houver nada
  const [tarefas, setTarefas] = useState<TarefaItem[]>(() => {
    const dadosSalvos = localStorage.getItem("@sweetflow:tarefas");
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  });

  const [busca, setBusca] = useState("");
  const [filtroSetor, setFiltroSetor] = useState("Todos");
  const [filtroPrioridade, setFiltroPrioridade] = useState("Todos");

  const [modalAberto, setModalAberto] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoSetor, setNovoSetor] = useState("Mídia");
  const [novoResponsavel, setNovoResponsavel] = useState("");
  const [novaPrioridade, setNovaPrioridade] = useState<
    "Baixa" | "Média" | "Alta" | "Crítica"
  >("Média");
  const [novoPrazo, setNovoPrazo] = useState("");

  // 2. Sempre que a lista de tarefas mudar, nós atualizamos o localStorage automaticamente
  useEffect(() => {
    localStorage.setItem("@sweetflow:tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  const handleCriarTarefa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoTitulo || !novoResponsavel || !novoPrazo) return;

    const nova: TarefaItem = {
      // Gera um ID baseado no timestamp atual para evitar IDs duplicados
      id: String(Date.now()),
      titulo: novoTitulo,
      setor: novoSetor,
      responsavel: novoResponsavel,
      prioridade: novaPrioridade,
      status: "RECEBIDO",
      prazo: new Date(novoPrazo).toLocaleDateString("pt-BR"),
    };

    setTarefas([nova, ...tarefas]);
    setModalAberto(false);

    setNovoTitulo("");
    setNovoResponsavel("");
    setNovoPrazo("");
  };

  const tarefasFiltradas = tarefas.filter((t) => {
    const bateBusca =
      t.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      t.responsavel.toLowerCase().includes(busca.toLowerCase());
    const bateSetor = filtroSetor === "Todos" || t.setor === filtroSetor;
    const batePrioridade =
      filtroPrioridade === "Todos" || t.prioridade === filtroPrioridade;
    return bateBusca && bateSetor && batePrioridade;
  });

  const getEstiloStatus = (status: string) => {
    switch (status) {
      case "RECEBIDO":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "EM_ANALISE":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "EM_DESENVOLVIMENTO":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "EM_APROVACAO":
        return "bg-pink-500/10 text-pink-400 border-pink-500/20";
      case "CONCLUIDO":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-400";
    }
  };

  const getEstiloPrioridade = (p: string) => {
    switch (p) {
      case "Crítica":
        return "text-red-400 bg-red-500/10 border-red-500/20 font-bold";
      case "Alta":
        return "text-orange-400 bg-orange-500/10 border-orange-500/20";
      case "Média":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "Baixa":
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
      default:
        return "text-gray-400 bg-gray-500/10";
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-8 ml-0 md:ml-64 transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Gerenciamento de Operações
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Controle estratégico, delegação e aprovação de fluxos da fábrica.
          </p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="bg-linear-to-r from-teal-500 to-emerald-500 text-gray-950 font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer text-sm shadow-lg shadow-teal-500/10"
        >
          <Plus className="w-4 h-4 stroke-3" /> Criar Solicitação
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-6 flex flex-col lg:flex-row gap-4 justify-between items-center shadow-xl">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por demanda ou responsável..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
          <div className="flex items-center gap-2 bg-gray-950 border border-gray-800 px-3 py-1.5 rounded-xl text-xs text-gray-400">
            <Filter className="w-3.5 h-3.5 text-teal-400" />
            <span>Setor:</span>
            <select
              value={filtroSetor}
              onChange={(e) => setFiltroSetor(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer ml-1"
            >
              <option value="Todos" className="bg-gray-900">
                Todos os Setores
              </option>
              <option value="Mídia" className="bg-gray-900">
                Mídia
              </option>
              <option value="Escrita" className="bg-gray-900">
                Escrita
              </option>
              <option value="Atendimento" className="bg-gray-900">
                Atendimento
              </option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-gray-950 border border-gray-800 px-3 py-1.5 rounded-xl text-xs text-gray-400">
            <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
            <span>Prioridade:</span>
            <select
              value={filtroPrioridade}
              onChange={(e) => setFiltroPrioridade(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer ml-1"
            >
              <option value="Todos" className="bg-gray-900">
                Todas
              </option>
              <option value="Crítica" className="bg-gray-900">
                Crítica
              </option>
              <option value="Alta" className="bg-gray-900">
                Alta
              </option>
              <option value="Média" className="bg-gray-900">
                Média
              </option>
              <option value="Baixa" className="bg-gray-900">
                Baixa
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Demanda / Solicitação</th>
                <th className="px-6 py-4">Responsável</th>
                <th className="px-6 py-4">Setor Destino</th>
                <th className="px-6 py-4">Prioridade</th>
                <th className="px-6 py-4">Status Atual</th>
                <th className="px-6 py-4">Prazo Final</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-sm">
              {tarefasFiltradas.length > 0 ? (
                tarefasFiltradas.map((tarefa) => (
                  <tr
                    key={tarefa.id}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4.5 font-medium text-white max-w-xs md:max-w-md truncate">
                      {tarefa.titulo}
                    </td>
                    <td className="px-6 py-4.5 text-gray-300">
                      {tarefa.responsavel}
                    </td>
                    <td className="px-6 py-4.5">
                      <span className="bg-gray-950 px-2.5 py-1 rounded-md border border-gray-800 text-xs font-medium text-gray-400">
                        {tarefa.setor}
                      </span>
                    </td>
                    <td className="px-6 py-4.5">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs border ${getEstiloPrioridade(tarefa.prioridade)}`}
                      >
                        {tarefa.prioridade}
                      </span>
                    </td>
                    <td className="px-6 py-4.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getEstiloStatus(tarefa.status)}`}
                      >
                        {tarefa.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-gray-400 text-xs font-mono flex items-center gap-1.5 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />{" "}
                      {tarefa.prazo}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500 text-sm"
                  >
                    Nenhuma demanda operacional registrada ainda. Clique em
                    "Criar Solicitação" para iniciar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold text-white mb-1">
              Nova Solicitação Operacional
            </h3>
            <p className="text-gray-400 text-xs mb-6">
              Insira os parâmetros para delegar o fluxo de trabalho.
            </p>

            <form onSubmit={handleCriarTarefa} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Título da Demanda
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Redigir termos do sabor Morango Ácido"
                  value={novoTitulo}
                  onChange={(e) => setNovoTitulo(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Setor Encarregado
                  </label>
                  <select
                    value={novoSetor}
                    onChange={(e) => setNovoSetor(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Mídia">Mídia (Campanhas)</option>
                    <option value="Escrita">Escrita (Conteúdo)</option>
                    <option value="Atendimento">Atendimento (Chamados)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Responsável Direto
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Calebe"
                    value={novoResponsavel}
                    onChange={(e) => setNovoResponsavel(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Nível de Prioridade
                  </label>
                  <select
                    value={novaPrioridade}
                    onChange={(e) => setNovaPrioridade(e.target.value as any)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica (Urgente)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Prazo de Conclusão
                  </label>
                  <input
                    type="date"
                    required
                    value={novoPrazo}
                    onChange={(e) => setNovoPrazo(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800 mt-6">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-linear-to-r from-teal-500 to-emerald-500 text-gray-950 font-bold py-2 px-4 rounded-xl text-sm hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Confirmar Envio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
