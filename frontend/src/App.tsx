// frontend/src/App.tsx
import { useState } from "react";
import { Login } from "./pages/Login";
import { IntegratedFlow } from "./pages/IntegratedFlow";
import { Dashboard } from "./pages/Dashboard";
import { Operacoes } from "./pages/Operacoes";
import { Sidebar } from "./components/Sidebar";
import { Menu, X } from "lucide-react";

function App() {
  const [tela, setTela] = useState<
    "login" | "fluxo" | "dashboard" | "operacoes"
  >("login");
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);

  return (
    <div className="w-full min-h-screen bg-gray-950 text-white font-sans antialiased relative flex flex-col md:flex-row">
      {/* BARRA DE TOPO EXCLUSIVA PARA MOBILE */}
      {tela !== "login" && (
        <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-gray-900 border-b border-gray-800 px-4 flex items-center justify-between z-40 shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-wider text-teal-400">
              SweetFlow
            </span>
          </div>
          <button
            onClick={() => setMenuMobileAberto(!menuMobileAberto)}
            className="p-2 text-gray-400 hover:text-white transition-colors focus:outline-none"
          >
            {menuMobileAberto ? (
              <X className="w-6" />
            ) : (
              <Menu className="w-6" />
            )}
          </button>
        </header>
      )}

      {/* COMPONENTE SIDEBAR/DRAWER */}
      {tela !== "login" && (
        <Sidebar
          telaAtiva={tela}
          setTela={(novaTela) => {
            setTela(novaTela);
            setMenuMobileAberto(false);
          }}
          mobileAberto={menuMobileAberto}
          setMobileAberto={setMenuMobileAberto}
        />
      )}

      {/* CONTAINER PRINCIPAL CORRIGIDO: Removido o md:ml-64 que duplicava o espaçamento no PC */}
      <main
        className={`flex-1 w-full min-h-screen transition-all duration-300 ${
          tela !== "login" ? "pt-16 md:pt-0" : ""
        }`}
      >
        {tela === "login" && (
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
