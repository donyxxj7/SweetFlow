// frontend/src/pages/Operacoes.tsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Filter,
  Search,
  Calendar,
  SlidersHorizontal,
  Loader2,
  Trash2,
} from "lucide-react";
import { api } from "../services/api";
import Swal from "sweetalert2";

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
  responsavel: string;
  responsavelId: string;
  prioridade: "Baixa" | "Média" | "Alta" | "Crítica";
  status:
    | "RECEBIDO"
    | "EM_ANALISE"
    | "EM_DESENVOLVIMENTO"
    | "EM_APROVACAO"
    | "CONCLUIDO";
  prazo: string;
}

const LISTA_MEMBROS_EQUIPE = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    nome: "Maria Eduarda",
    setor: "Atendimento ao Cliente",
  },
  {
    id: "11111111-1111-1111-1111-222222222222",
    nome: "Yaskara",
    setor: "Atendimento ao Cliente",
  },
  {
    id: "22222222-2222-2222-2222-111111111111",
    nome: "Giovana",
    setor: "Coleta de Informações",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    nome: "Mariana",
    setor: "Coleta de Informações",
  },
  {
    id: "33333333-3333-3333-3333-111111111111",
    nome: "Maira",
    setor: "Mídias",
  },
  {
    id: "33333333-3333-3333-3333-222222222222",
    nome: "Khauan",
    setor: "Mídias",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    nome: "Luiza",
    setor: "Mídias",
  },
  {
    id: "44444444-4444-4444-4444-111111111111",
    nome: "Gustavo",
    setor: "Escrita de Textos",
  },
  {
    id: "44444444-4444-4444-4444-222222222222",
    nome: "Pedro Ramos",
    setor: "Escrita de Textos",
  },
  {
    id: "44444444-4444-4444-4444-333333333333",
    nome: "Pedro Venturini",
    setor: "Escrita de Textos",
  },
  {
    id: "55555555-5555-5555-5555-111111111111",
    nome: "Guilherme",
    setor: "Atendimento aos Fornecedores",
  },
  {
    id: "55555555-5555-5555-5555-222222222222",
    nome: "Breno",
    setor: "Atendimento aos Fornecedores",
  },
  {
    id: "55555555-5555-5555-5555-333333333333",
    nome: "Jatniel",
    setor: "Atendimento aos Fornecedores",
  },
  {
    id: "00000000-0000-0000-0000-000000000000",
    nome: "Endony",
    setor: "Gerenciamento de Operações",
  },
  {
    id: "66666666-6666-6666-6666-222222222222",
    nome: "Lucas",
    setor: "Gerenciamento de Operações",
  },
  {
    id: "66666666-6666-6666-6666-333333333333",
    nome: "Gabriel",
    setor: "Gerenciamento de Operações",
  },
  {
    id: "77777777-7777-7777-7777-111111111111",
    nome: "Maria Clara",
    setor: "Organização de Eventos",
  },
  {
    id: "77777777-7777-7777-7777-222222222222",
    nome: "Isabele",
    setor: "Organização de Eventos",
  },
  {
    id: "77777777-7777-7777-7777-333333333333",
    nome: "Victor",
    setor: "Organização de Eventos",
  },
];

export function Operacoes() {
  const [tarefas, setTarefas] = useState<TarefaItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [excluindoId, setExcluindoId] = useState<string | null>(null);

  const [busca, setBusca] = useState("");
  const [filtroSetor, setFiltroSetor] = useState<string>("Todos");
  const [filtroPrioridade, setFiltroPrioridade] = useState<string>("Todos");

  const [modalAberto, setModalAberto] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoSetor, setNovoSetor] = useState<SetorTipo>(
    "Gerenciamento de Operações",
  );
  const [novoResponsavelId, setNovoResponsavelId] = useState("");
  const [novaPrioridade, setNovaPrioridade] = useState<
    "Baixa" | "Média" | "Alta" | "Crítica"
  >("Média");
  const [novoPrazo, setNovoPrazo] = useState("");

  const responsaveisFiltradosDoModal = LISTA_MEMBROS_EQUIPE.filter(
    (m) => m.setor === novoSetor,
  );

  useEffect(() => {
    const filtrados = LISTA_MEMBROS_EQUIPE.filter((m) => m.setor === novoSetor);
    if (filtrados.length > 0 && filtrados[0]) {
      setNovoResponsavelId(filtrados[0].id);
    } else {
      setNovoResponsavelId("");
    }
  }, [novoSetor]);

  async function carregarTarefas() {
    try {
      setCarregando(true);
      // CORREÇÃO: Variável corrigida para 'resposta'
      const resposta = await api.get("/tarefas");
      const dadosFormatados = resposta.data.map((t: any) => {
        const miembro = LISTA_MEMBROS_EQUIPE.find(
          (m) =>
            String(m.id).toLowerCase() ===
            String(t.responsavelId).toLowerCase(),
        );
        return {
          ...t,
          setorDestino: t.setorDestino || t.setor,
          responsavel: miembro
            ? miembro.nome
            : t.responsavel || "Operador SweetFlow",
        };
      });
      setTarefas(dadosFormatados);
    } catch (erro) {
      console.error("Erro ao carregar demandas:", erro);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarTarefas();
  }, []);

  const handleExcluirTarefa = async (id: string, titulo: string) => {
    const resultadoSwal = await Swal.fire({
      title: "Confirmar Exclusão?",
      text: `Deseja realmente deletar a solicitação: "${titulo}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, Deletar",
      cancelButtonText: "Cancelar",
      background: "#111827",
      color: "#f3f4f6",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#374151",
      customClass: { popup: "border border-gray-800 rounded-2xl shadow-2xl" },
    });

    if (!resultadoSwal.isConfirmed) return;

    try {
      setExcluindoId(id);
      await api.delete(`/tarefas/${id}`);
      setTarefas((listaAntiga) => listaAntiga.filter((t) => t.id !== id));

      Swal.fire({
        title: "Deletado!",
        text: "A solicitação foi apagada com sucesso.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "#111827",
        color: "#f3f4f6",
      });
    } catch (erro) {
      Swal.fire({
        title: "Erro Crítico",
        text: "Não foi possível excluir do servidor remoto.",
        icon: "error",
        background: "#111827",
        color: "#f3f4f6",
      });
    } finally {
      setExcluindoId(null);
    }
  };

  const handleCriarTarefa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoTitulo || !novoResponsavelId || !novoPrazo) return;

    try {
      setEnviando(true);
      const payload = {
        titulo: novoTitulo,
        setorDestino: novoSetor,
        prioridade: novaPrioridade,
        prazo: new Date(novoPrazo).toLocaleDateString("pt-BR"),
        responsavelId: novoResponsavelId,
      };
      await api.post("/tarefas", payload);
      setModalAberto(false);
      setNovoTitulo("");
      setNovoPrazo("");
      setNovoSetor("Gerenciamento de Operações");

      Swal.fire({
        title: "Sucesso!",
        text: "Nova solicitação operacional registrada.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "#111827",
        color: "#f3f4f6",
      });

      await carregarTarefas();
    } catch (erro) {
      Swal.fire({
        title: "Erro ao Salvar",
        text: "Ocorreu um problema de comunicação com o Neon.",
        icon: "error",
        background: "#111827",
        color: "#f3f4f6",
      });
    } finally {
      setEnviando(false);
    }
  };

  // CORREÇÃO: Removido o 'tasks =>' que transformava o array em função
  const tarefasFiltradas = tarefas.filter((t) => {
    const bateBusca =
      t.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      t.responsavel.toLowerCase().includes(busca.toLowerCase());
    const bateSetor = filtroSetor === "Todos" || t.setorDestino === filtroSetor;
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
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 sm:p-6 md:p-8 transition-all duration-300 overflow-x-hidden">
      {/* Topo Responsivo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Gerenciamento de Operações
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Controle total das demandas operacionais.
          </p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="w-full sm:w-auto bg-linear-to-r from-teal-500 to-emerald-500 text-gray-950 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer text-sm shadow-lg shadow-teal-500/10"
        >
          <Plus className="w-4 h-4 stroke-3" /> Criar Solicitação
        </button>
      </div>

      {/* Painel de Filtros Avançados */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-6 flex flex-col lg:flex-row gap-4 justify-between items-center shadow-xl">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por demanda ou responsável..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto justify-end">
          <div className="flex items-center gap-2 bg-gray-950 border border-gray-800 px-3 py-2 rounded-xl text-xs text-gray-400 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-teal-400" />
              <span>Setor:</span>
            </div>
            <select
              value={filtroSetor}
              onChange={(e) => setFiltroSetor(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer ml-1 text-xs"
            >
              <option value="Todos" className="bg-gray-900">
                Todos
              </option>
              <option value="Atendimento ao Cliente" className="bg-gray-900">
                Atendimento ao Cliente
              </option>
              <option value="Coleta de Informações" className="bg-gray-900">
                Coleta de Informações
              </option>
              <option value="Mídias" className="bg-gray-900">
                Mídias
              </option>
              <option value="Escrita de Textos" className="bg-gray-900">
                Escrita de Textos
              </option>
              <option
                value="Atendimento aos Fornecedores"
                className="bg-gray-900"
              >
                Fornecedores
              </option>
              <option
                value="Gerenciamento de Operações"
                className="bg-gray-900"
              >
                Gerenciamento de Operações
              </option>
              <option value="Organização de Eventos" className="bg-gray-900">
                Organização de Eventos
              </option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-gray-950 border border-gray-800 px-3 py-2 rounded-xl text-xs text-gray-400 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
              <span>Prioridade:</span>
            </div>
            <select
              value={filtroPrioridade}
              onChange={(e) => setFiltroPrioridade(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer ml-1 text-xs"
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

      {/* ESTADO DE CARREGAMENTO */}
      {carregando && (
        <div className="py-12 px-6 bg-gray-900 border border-gray-800 rounded-2xl text-center shadow-xl flex items-center justify-center gap-2 text-teal-400 font-medium">
          <Loader2 className="w-5 h-5 animate-spin" /> Buscando fluxos
          operacionais na nuvem...
        </div>
      )}

      {/* VERSÃO MOBILE: CARDS VERTICAIS */}
      {!carregando && (
        <div className="block lg:hidden space-y-4">
          {tarefasFiltradas.length > 0 ? (
            tarefasFiltradas.map((tarefa) => (
              <div
                key={tarefa.id}
                className={`bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg relative ${excluindoId === tarefa.id ? "opacity-30 pointer-events-none" : ""}`}
              >
                <div className="flex justify-between items-start gap-2 mb-4">
                  <div className="flex flex-col gap-1.5">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${getEstiloStatus(tarefa.status)}`}
                    >
                      {tarefa.status.replace("_", " ")}
                    </span>
                    <h3 className="text-base font-black tracking-tight text-white leading-tight wrap-break-word">
                      {tarefa.titulo}
                    </h3>
                  </div>

                  <button
                    disabled={excluindoId !== null}
                    onClick={() =>
                      handleExcluirTarefa(tarefa.id, tarefa.titulo)
                    }
                    className="p-2.5 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500 hover:text-gray-950 transition-all cursor-pointer disabled:opacity-40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-4 border-t border-gray-800/60">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Responsável
                    </span>
                    <span className="text-sm font-semibold text-gray-200">
                      {tarefa.responsavel}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Prioridade
                    </span>
                    <span
                      className={`inline-flex items-center w-fit px-2 py-0.5 mt-0.5 rounded-md text-[11px] border ${getEstiloPrioridade(tarefa.prioridade)}`}
                    >
                      {tarefa.prioridade}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Setor Destino
                    </span>
                    <span className="text-xs font-medium text-teal-400 truncate">
                      {tarefa.setorDestino}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Prazo Final
                    </span>
                    <span className="text-xs font-mono font-medium text-gray-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-600" />{" "}
                      {tarefa.prazo}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-600 bg-gray-900 border border-gray-800 rounded-2xl text-xs">
              Nenhuma demanda operacional registrada no banco Neon.
            </div>
          )}
        </div>
      )}

      {/* VERSÃO DESKTOP: TABELA ADMINISTRATIVA CLÁSSICA */}
      {!carregando && (
        <div className="hidden lg:block bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-800">
            <table className="w-full text-left border-collapse min-w-200">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/50 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Demanda / Solicitação</th>
                  <th className="px-6 py-4">Responsável</th>
                  <th className="px-6 py-4">Setor Destino</th>
                  <th className="px-6 py-4">Prioridade</th>
                  <th className="px-6 py-4">Status Atual</th>
                  <th className="px-6 py-4">Prazo Final</th>
                  <th className="px-6 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-sm">
                {tarefasFiltradas.length > 0 ? (
                  tarefasFiltradas.map((tarefa) => (
                    <tr
                      key={tarefa.id}
                      className={`hover:bg-gray-800/30 transition-colors ${excluindoId === tarefa.id ? "opacity-30 pointer-events-none" : ""}`}
                    >
                      <td className="px-6 py-4 font-medium text-white max-w-xs md:max-w-md truncate wrap-break-word">
                        {tarefa.titulo}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {tarefa.responsavel}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-950 px-2.5 py-1 rounded-md border border-gray-800 text-xs font-medium text-gray-400">
                          {tarefa.setorDestino}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-xs border ${getEstiloPrioridade(tarefa.prioridade)}`}
                        >
                          {tarefa.prioridade}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getEstiloStatus(tarefa.status)}`}
                        >
                          {tarefa.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs font-mono">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-500" />{" "}
                          {tarefa.prazo}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          disabled={excluindoId !== null}
                          onClick={() =>
                            handleExcluirTarefa(tarefa.id, tarefa.titulo)
                          }
                          className="p-2 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500 hover:text-gray-950 transition-all cursor-pointer disabled:opacity-40"
                          title="Excluir solicitação permanentemente"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-gray-500 text-sm"
                    >
                      Nenhuma demanda registrada no banco.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL RESPONSIVO */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl my-auto">
            <h3 className="text-xl font-bold text-white mb-1">
              Nova Solicitação Operacional
            </h3>
            <p className="text-gray-400 text-xs mb-5">
              Preencha os detalhes para criar uma nova demanda operacional.
            </p>

            <form onSubmit={handleCriarTarefa} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Título da Demanda
                </label>
                <input
                  type="text"
                  required
                  disabled={enviando}
                  placeholder="Ex: Desenhar cronograma de postagens"
                  value={novoTitulo}
                  onChange={(e) => setNovoTitulo(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2.5 px-3 text-white text-sm focus:outline-none focus:border-teal-500 transition-colors disabled:opacity-40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Setor Encarregado
                  </label>
                  <select
                    disabled={enviando}
                    value={novoSetor}
                    onChange={(e) => setNovoSetor(e.target.value as SetorTipo)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2.5 px-3 text-white text-sm focus:outline-none focus:border-teal-500 cursor-pointer disabled:opacity-40"
                  >
                    <option value="Atendimento ao Cliente">
                      Atendimento ao Cliente
                    </option>
                    <option value="Coleta de Informações">
                      Coleta de Informações
                    </option>
                    <option value="Mídias">Mídias</option>
                    <option value="Escrita de Textos">Escrita de Textos</option>
                    <option value="Atendimento aos Fornecedores">
                      Atendimento aos Fornecedores
                    </option>
                    <option value="Gerenciamento de Operações">
                      Gerenciamento de Operações
                    </option>
                    <option value="Organização de Eventos">
                      Organização de Eventos
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Designar Responsável
                  </label>
                  <select
                    required
                    disabled={
                      enviando || responsaveisFiltradosDoModal.length === 0
                    }
                    value={novoResponsavelId}
                    onChange={(e) => setNovoResponsavelId(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2.5 px-3 text-white text-sm focus:outline-none focus:border-teal-500 cursor-pointer disabled:opacity-40 h-10.5"
                  >
                    {responsaveisFiltradosDoModal.length > 0 ? (
                      responsaveisFiltradosDoModal.map((membro) => (
                        <option key={membro.id} value={membro.id}>
                          {membro.nome}
                        </option>
                      ))
                    ) : (
                      <option value="">Nenhum aluno cadastrado</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Nível de Prioridade
                  </label>
                  <select
                    disabled={enviando}
                    value={novaPrioridade}
                    onChange={(e) => setNovaPrioridade(e.target.value as any)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2.5 px-3 text-white text-sm focus:outline-none focus:border-teal-500 cursor-pointer disabled:opacity-40"
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
                    disabled={enviando}
                    value={novoPrazo}
                    onChange={(e) => setNovoPrazo(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-teal-500 disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800 mt-5">
                <button
                  type="button"
                  disabled={enviando}
                  onClick={() => setModalAberto(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer disabled:opacity-30"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={enviando}
                  className="bg-linear-to-r from-teal-500 to-emerald-500 text-gray-950 font-bold py-2.5 px-4 rounded-xl text-sm hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center disabled:opacity-50 min-w-30"
                >
                  {enviando ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Confirmar Envio"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
