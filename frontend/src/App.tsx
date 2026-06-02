// frontend/src/App.tsx
import { useState } from "react";
import { Login } from "./pages/Login";
import { IntegratedFlow } from "./pages/IntegratedFlow";
import { Dashboard } from "./pages/Dashboard";
import { Operacoes } from "./pages/Operacoes"; // Importado
import { Sidebar } from "./components/Sidebar";

function App() {
  const [tela, setTela] = useState<
    "login" | "fluxo" | "dashboard" | "operacoes"
  >("login");

  return (
    <div className="w-full min-h-screen bg-gray-950 text-white font-sans antialiased">
      {/* Sidebar ativa fora do Login */}
      {tela !== "login" && <Sidebar telaAtiva={tela} setTela={setTela} />}

      <main>
        {tela === "login" && (
          <div
            onClick={(e) => {
              if ((e.target as HTMLElement).tagName === "BUTTON") {
                setTimeout(() => setTela("dashboard"), 1000);
              }
            }}
          >
            <Login />
          </div>
        )}
        {tela === "dashboard" && <Dashboard />}
        {tela === "operacoes" && <Operacoes />}
        {tela === "fluxo" && <IntegratedFlow />}
      </main>
    </div>
  );
}

export default App;
