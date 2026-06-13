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
import Swal from "sweetalert2"; // IMPORTANTE: Importa o SweetAlert2 para os pop-ups customizados

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
    if (
      responsaveisFiltradosDoModal.length > 0 &&
      responsaveisFiltradosDoModal[0]
    ) {
      setNovoResponsavelId(responsaveisFiltradosDoModal[0].id);
    } else {
      setNovoResponsavelId("");
    }
  }, [novoSetor]);

  async function carregarTarefas() {
    try {
      setCarregando(true);
      const resposta = await api.get("/tarefas");
      const dadosFormatados = resposta.data.map((t: any) => {
        const miembro = LISTA_MEMBROS_EQUIPE.find(
          (m) => m.id === t.responsavelId,
        );
        return {
          ...t,
          setorDestino: t.setorDestino || t.setor,
          responsavel: miembro ? miembro.nome : "Operador SweetFlow",
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

  // =========================================================================
  // POP-UP ATUALIZADO: Deletar Tarefa com SweetAlert2 integrado ao Dark Mode
  // =========================================================================
  const handleExcluirTarefa = async (id: string, titulo: string) => {
    const resultadoSwal = await Swal.fire({
      title: "Confirmar Exclusão?",
      text: `Deseja realmente deletar a solicitação: "${titulo}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, Deletar",
      cancelButtonText: "Cancelar",
      background: "#111827", // bg-gray-900 do seu tema
      color: "#f3f4f6", // text-gray-100
      confirmButtonColor: "#ef4444", // Vermelho destrutivo
      cancelButtonColor: "#374151", // Botão cinza discreto
      customClass: {
        popup: "border border-gray-800 rounded-2xl shadow-2xl",
      },
    });

    if (!resultadoSwal.isConfirmed) return;

    try {
      setExcluindoId(id);
      await api.delete(`/tarefas/${id}`);
      setTarefas((listaAntiga) => listaAntiga.filter((t) => t.id !== id));

      // Feedback visual moderno de sucesso (estilo toast rápido)
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
      console.error("Falha ao deletar item no Neon:", erro);
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

      // Feedback moderno de criação com sucesso
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
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-8 ml-0 md:ml-64 transition-all duration-300">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Gerenciamento de Operações
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Sincronização imediata com banco relacional PostgreSQL do Neon Tech.
          </p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="bg-linear-to-r from-teal-500 to-emerald-500 text-gray-950 font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer text-sm shadow-lg shadow-teal-500/10"
        >
          <Plus className="w-4 h-4 stroke-3" /> Criar Solicitação
        </button>
      </div>

      {/* Filtros */}
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
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer ml-1 text-xs"
            >
              <option value="Todos" className="bg-gray-900">
                Todos os Setores
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

          <div className="flex items-center gap-2 bg-gray-950 border border-gray-800 px-3 py-1.5 rounded-xl text-xs text-gray-400">
            <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
            <span>Prioridade:</span>
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

      {/* Tabela Administrativa Principal */}
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
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-sm">
              {carregando ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500 text-sm"
                  >
                    <div className="flex items-center justify-center gap-2 text-teal-400 font-medium">
                      <Loader2 className="w-4 h-4 animate-spin" /> Buscando
                      fluxos operacionais na nuvem...
                    </div>
                  </td>
                </tr>
              ) : tarefasFiltradas.length > 0 ? (
                tarefasFiltradas.map((tarefa) => (
                  <tr
                    key={tarefa.id}
                    className={`hover:bg-gray-800/30 transition-colors ${excluindoId === tarefa.id ? "opacity-30 pointer-events-none" : ""}`}
                  >
                    <td className="px-6 py-4.5 font-medium text-white max-w-xs md:max-w-md truncate">
                      {tarefa.titulo}
                    </td>
                    <td className="px-6 py-4.5 text-gray-300">
                      {tarefa.responsavel}
                    </td>
                    <td className="px-6 py-4.5">
                      <span className="bg-gray-950 px-2.5 py-1 rounded-md border border-gray-800 text-xs font-medium text-gray-400 whitespace-nowrap">
                        {tarefa.setorDestino}
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
                    <td className="px-6 py-4.5 text-gray-400 text-xs font-mono">
                      <div className="flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />{" "}
                        {tarefa.prazo}
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-center">
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

      {/* MODAL PARA CRIAR SOLICITAÇÃO REAIS */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold text-white mb-1">
              Nova Solicitação Operacional
            </h3>
            <p className="text-gray-400 text-xs mb-6">
              Gravação e persistência estruturada via API.
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
                  placeholder="Ex: Desenhar cronograma de postagens ou conferir lote"
                  value={novoTitulo}
                  onChange={(e) => setNovoTitulo(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-teal-500 transition-colors disabled:opacity-40"
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
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-teal-500 cursor-pointer h-9.5 disabled:opacity-40"
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
                    disabled={
                      enviando || responsaveisFiltradosDoModal.length === 0
                    }
                    value={novoResponsavelId}
                    onChange={(e) => setNovoResponsavelId(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-teal-500 cursor-pointer h-9.5 disabled:opacity-40"
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
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-teal-500 cursor-pointer disabled:opacity-40"
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

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800 mt-6">
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
                  className="bg-linear-to-r from-teal-500 to-emerald-500 text-gray-950 font-bold py-2 px-4 rounded-xl text-sm hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center disabled:opacity-50"
                >
                  {enviando ? "Salvando na nuvem..." : "Confirmar Envio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
