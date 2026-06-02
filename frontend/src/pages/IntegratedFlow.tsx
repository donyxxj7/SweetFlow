import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  HeadphonesIcon,
  Settings,
  PenTool,
  Image,
  CheckCircle,
} from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Fábrica De Balas",
    icon: Users,
    desc: "Inicia a solicitação ou chamado.",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Atendimento",
    icon: HeadphonesIcon,
    desc: "Filtra e categoriza a demanda.",
    color: "bg-purple-500",
  },
  {
    id: 3,
    title: "Gerenciamento de Operações",
    icon: Settings,
    desc: "Analisa, aprova e delega.",
    color: "bg-brand-500",
  },
  {
    id: 4,
    title: "Escrita",
    icon: PenTool,
    desc: "Produz o conteúdo textual.",
    color: "bg-yellow-500",
  },
  {
    id: 5,
    title: "Mídia",
    icon: Image,
    desc: "Cria artes e campanhas.",
    color: "bg-pink-500",
  },
  {
    id: 6,
    title: "Entrega da Solução",
    icon: CheckCircle,
    desc: "Demanda finalizada com sucesso.",
    color: "bg-green-500",
  },
];

export function IntegratedFlow() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 flex flex-col items-center justify-center font-sans">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-brand-500 to-blue-500 bg-clip-text text-transparent">
          SweetFlow: Integração Total
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Acompanhe em tempo real como uma demanda viaja entre nossas empresas
          terceirizadas, do cliente final até a entrega da solução perfeita.
        </p>
      </div>

      <div className="relative w-full max-w-5xl flex flex-col items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Cartão da Etapa */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.8, duration: 0.6 }}
              className="relative z-10 w-full md:w-2/3 bg-gray-800 border border-gray-700 rounded-xl p-6 flex items-center shadow-xl shadow-black/50"
            >
              <div
                className={`p-4 rounded-full ${step.color} bg-opacity-20 mr-6`}
              >
                <step.icon
                  className={`w-8 h-8 ${step.color.replace("bg-", "text-")}`}
                />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-1">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            </motion.div>

            {/* Linha de Conexão Animada (Seta) */}
            {index < steps.length - 1 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 60, opacity: 1 }}
                transition={{ delay: index * 0.8 + 0.4, duration: 0.4 }}
                className="w-1 bg-linear-to-b from-gray-600 to-brand-500 my-2 relative"
              >
                {/* Partícula fluindo */}
                <motion.div
                  animate={{ y: [0, 60] }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#fff]"
                />
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
