// frontend/src/pages/Login.tsx
import React, { useState } from "react";
import { Lock, User, ArrowRight } from "lucide-react";
import { api } from "../services/api"; // Importa a nossa ponte do Axios
import Swal from "sweetalert2"; // IMPORTANTE: Importa o SweetAlert2 para os pop-ups customizados

interface LoginProps {
  onLoginSuccess: () => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleEntrar = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação estrita de campos vazios antes de gastar processamento de rede
    if (usuario.trim() === "" || senha.trim() === "") {
      Swal.fire({
        title: "Campos Vazios",
        text: "Por favor, preencha todos os campos antes de continuar.",
        icon: "warning",
        background: "#111827",
        color: "#f3f4f6",
        confirmButtonColor: "#14b8a6", // Teal customizado
        customClass: {
          popup: "border border-gray-800 rounded-2xl shadow-2xl",
        },
      });
      return;
    }

    try {
      setCarregando(true);

      // CORREÇÃO: Dispara a requisição POST real. O .toLowerCase() mantém os espaços internos dos nomes!
      const resposta = await api.post("/login", {
        login: usuario.trim().toLowerCase(), // Limpa pontas mas preserva o espaço interno ("maria eduarda")
        senha: senha.trim(),
      });

      // Se a API retornar sucesso (Status 200), salvamos o operador da vez
      if (resposta.data) {
        localStorage.setItem("@SweetFlow:user_id", resposta.data.id);
        localStorage.setItem("@SweetFlow:user_name", resposta.data.nome);
        localStorage.setItem("@SweetFlow:user_setor", resposta.data.setor);

        // Feedback sênior rápido de sucesso (Toast) antes de entrar no Dashboard
        Swal.fire({
          title: "Acesso Permitido!",
          text: `Bem-vindo de volta, ${resposta.data.nome}.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: "#111827",
          color: "#f3f4f6",
        });

        setTimeout(() => {
          onLoginSuccess(); // Libera as rotas e altera o estado no App.tsx
        }, 1500);
      }
    } catch (error: any) {
      console.error("Falha na tentativa de login:", error);

      let mensagemErro =
        "Não foi possível conectar ao servidor de autenticação.";

      // Captura erros estruturados enviados pelo Fastify (Ex: Usuário incorreto - Status 401)
      if (error.response && error.response.status === 401) {
        mensagemErro = "Usuário ou senha de acesso não foram encontrados.";
      } else if (error.response && error.response.status === 400) {
        mensagemErro = "Campos inválidos enviados.";
      }

      // POP-UP CUSTOMIZADO: Substituindo o visual do erro antigo
      Swal.fire({
        title: "Falha na Autenticação",
        text: mensagemErro,
        icon: "error",
        background: "#111827", // bg-gray-900
        color: "#f3f4f6", // text-gray-100
        confirmButtonColor: "#14b8a6", // Botão Teal combinando com o tema
        customClass: {
          popup: "border border-gray-800 rounded-2xl shadow-2xl",
        },
      });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-950 px-4 relative overflow-hidden">
      {/* Detalhes Visuais de Fundo (Neon Glow) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card de Login */}
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl relative z-10">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-linear-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20 p-3 rounded-2xl mb-3 text-teal-400 font-mono font-black tracking-widest text-xl">
            SF
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Sistema SweetFlow
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            Insira suas credenciais administrativas para acessar o sistema.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleEntrar} className="space-y-4">
          {/* Input de Usuário */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Usuário / Operador
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                disabled={carregando}
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Digite seu usuário"
                className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-teal-500 transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          {/* Input de Senha */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                disabled={carregando}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-teal-500 transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          {/* Botão Submit */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-linear-to-r from-teal-500 to-emerald-500 text-gray-950 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer text-sm shadow-lg shadow-teal-500/10 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {carregando ? (
              <span className="w-5 h-5 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Autenticar no Sistema <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Rodapé Interno */}
        <div className="mt-8 pt-4 border-t border-gray-800/60 text-center">
          <p className="text-[10px] text-gray-600 font-mono">
            Acesso restrito para turmas e equipes SweetFlow.
          </p>
        </div>
      </div>
    </div>
  );
}
