// frontend/src/components/Sidebar.tsx
import { Candy, LayoutDashboard, Share2, Settings, LogOut } from "lucide-react";

interface SidebarProps {
  telaAtiva: string;
  setTela: (tela: "login" | "fluxo" | "dashboard" | "operacoes") => void;
}

export function Sidebar({ telaAtiva, setTela }: SidebarProps) {
  const menuItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "operacoes" as const, label: "Operações", icon: Settings }, // Adicionado
    { id: "fluxo" as const, label: "Fluxo Integrado", icon: Share2 },
  ];

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col justify-between z-40 max-md:hidden">
      <div>
        {/* Identidade do Sistema */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="p-2 bg-teal-500/10 border border-teal-500/20 rounded-xl">
            <Candy className="w-6 h-6 text-teal-400" />
          </div>
          <span className="text-xl font-black tracking-wider text-white">
            SweetFlow
          </span>
        </div>

        {/* Links de Navegação */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setTela(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border ${
                telaAtiva === item.id
                  ? "bg-linear-to-r from-teal-500/10 to-emerald-500/5 border-teal-500/20 text-teal-400"
                  : "text-gray-400 hover:bg-gray-800/60 hover:text-gray-200 border-transparent"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div>
        <button
          onClick={() => setTela("login")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-red-500/10 hover:text-red-400 border border-transparent transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
}
