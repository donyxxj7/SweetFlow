// frontend/src/pages/Login.tsx
import React, { useState } from "react";
import { Candy, Eye, EyeOff, Lock, Mail } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    // Validação simples
    if (!email || !senha) {
      setErro("Por favor, preencha todos os campos.");
      setCarregando(false);
      return;
    }

    try {
      // Aqui faremos a conexão real com o nosso backend usando fetch:
      // const response = await fetch('http://localhost:3333/api/auth/login', { ... })

      // Simulando a requisição por enquanto para testar o comportamento visual
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert(`Login simulado com sucesso para: ${email}`);
    } catch (err) {
      setErro("Falha ao conectar com o servidor operacional.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center p-4 antialiased selection:bg-teal-500 selection:text-black">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
        {/* Logotipo Interno */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl mb-3">
            <Candy className="w-8 h-8 text-teal-400 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            SweetFlow
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Gerenciamento Operacional Integrado
          </p>
        </div>

        {/* Mensagem de Erro */}
        {erro && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center">
            {erro}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              E-mail Corporativo
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome.sobrenome@industria.com"
                className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2.5 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 transition-colors text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2.5 pl-11 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 transition-colors text-sm"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
              >
                {mostrarSenha ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 text-xs text-gray-400 cursor-pointer select-none">
              <input
                type="checkbox"
                className="rounded bg-gray-950 border-gray-800 text-teal-500 focus:ring-0"
              />
              <span>Lembrar neste dispositivo</span>
            </label>
            <a href="#" className="text-xs text-teal-400 hover:underline">
              Esqueceu a senha?
            </a>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-linear-to-r from-teal-500 to-emerald-500 text-gray-950 font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity focus:outline-none disabled:opacity-50 text-sm mt-2 flex items-center justify-center cursor-pointer"
          >
            {carregando ? (
              <div className="w-5 h-5 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              "Autenticar no Sistema"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
