// frontend/src/App.tsx
import { useState } from "react";
import { Login } from "./pages/Login";
import { IntegratedFlow } from "./pages/IntegratedFlow";
import { Dashboard } from "./pages/Dashboard";
import { Operacoes } from "./pages/Operacoes";
import { Sidebar } from "./components/Sidebar";

function App() {
  // Estado centralizador de rotas com "login" como tela inicial padrão
  const [tela, setTela] = useState<
    "login" | "fluxo" | "dashboard" | "operacoes"
  >("login");

  return (
    <div className="w-full min-h-screen bg-gray-950 text-white font-sans antialiased flex flex-col md:flex-row">
      {/* 1. Sidebar fixa renderizada apenas se o usuário não estiver na tela de login */}
      {tela !== "login" && <Sidebar telaAtiva={tela} setTela={setTela} />}

      {/* 2. Container principal flexível para gerenciar o viewport de conteúdo */}
      <main className="flex-1 w-full min-h-screen">
        {tela === "login" && (
          // Injeta a função de callback direto para o componente de Login gerenciar o sucesso
          <Login onLoginSuccess={() => setTela("dashboard")} />
        )}

        {tela === "dashboard" && <Dashboard />}
        {tela === "operacoes" && <Operacoes />}
        {tela === "fluxo" && <IntegratedFlow />}
      </main>
    </div>
  );
}

export default App;
