// backend/src/db/seed.ts
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { usuarios, tarefas } from "./schema.js";

if (!process.env.DATABASE_URL) {
  throw new Error("🚨 DATABASE_URL não encontrada no .env para rodar o seed.");
}

const client = postgres(process.env.DATABASE_URL, { max: 1 });
const db = drizzle(client);

async function main() {
  console.log(
    "🌱 Iniciando semeio de dados (Seed) com a equipe oficial no Neon Tech...",
  );

  // 1. Limpa o banco de dados antes para evitar conflitos de IDs
  await db.delete(tarefas);
  await db.delete(usuarios);

  console.log("🧹 Tabelas limpas para reestruturação.");

  // 2. Injeta todos os integrantes da sua equipe com os mesmos UUIDs sequenciais do Frontend
  const usuariosEquipe = await db.insert(usuarios).values([
    // Gerenciamento de operações
    {
      id: "00000000-0000-0000-0000-000000000000",
      nome: "Endony",
      login: "endony",
      senha: "123",
      setor: "Gerenciamento de Operações",
    },
    {
      id: "66666666-6666-6666-6666-222222222222",
      nome: "Lucas",
      login: "lucas",
      senha: "123",
      setor: "Gerenciamento de Operações",
    },
    {
      id: "66666666-6666-6666-6666-333333333333",
      nome: "Gabriel",
      login: "gabriel",
      senha: "123",
      setor: "Gerenciamento de Operações",
    },

    // Atendimento ao cliente
    {
      id: "11111111-1111-1111-1111-111111111111",
      nome: "Maria Eduarda",
      login: "maria eduarda",
      senha: "123",
      setor: "Atendimento ao Cliente",
    },
    {
      id: "11111111-1111-1111-1111-222222222222",
      nome: "Yaskara",
      login: "yaskara",
      senha: "123",
      setor: "Atendimento ao Cliente",
    },

    // Coleta de informações
    {
      id: "22222222-2222-2222-2222-111111111111",
      nome: "Giovana",
      login: "giovana",
      senha: "123",
      setor: "Coleta de Informações",
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      nome: "Mariana",
      login: "mariana",
      senha: "123",
      setor: "Coleta de Informações",
    },

    // Mídias
    {
      id: "33333333-3333-3333-3333-111111111111",
      nome: "Maira",
      login: "maira",
      senha: "123",
      setor: "Mídias",
    },
    {
      id: "33333333-3333-3333-3333-222222222222",
      nome: "Khauan",
      login: "khauan",
      senha: "123",
      setor: "Mídias",
    },
    {
      id: "33333333-3333-3333-3333-333333333333",
      nome: "Luiza",
      login: "luiza",
      senha: "123",
      setor: "Mídias",
    },

    // Escrita de textos
    {
      id: "44444444-4444-4444-4444-111111111111",
      nome: "Gustavo",
      login: "gustavo",
      senha: "123",
      setor: "Escrita de Textos",
    },
    {
      id: "44444444-4444-4444-4444-222222222222",
      nome: "Pedro Ramos",
      login: "pedro ramos",
      senha: "123",
      setor: "Escrita de Textos",
    },
    {
      id: "44444444-4444-4444-4444-333333333333",
      nome: "Pedro Venturini",
      login: "pedro venturini",
      senha: "123",
      setor: "Escrita de Textos",
    },

    // Atendimento aos fornecedores
    {
      id: "55555555-5555-5555-5555-111111111111",
      nome: "Guilherme",
      login: "guilherme",
      senha: "123",
      setor: "Atendimento aos Fornecedores",
    },
    {
      id: "55555555-5555-5555-5555-222222222222",
      nome: "Breno",
      login: "breno",
      senha: "123",
      setor: "Atendimento aos Fornecedores",
    },
    {
      id: "55555555-5555-5555-5555-333333333333",
      nome: "Jatniel",
      login: "jatniel",
      senha: "123",
      setor: "Atendimento aos Fornecedores",
    },

    // Organização de eventos
    {
      id: "77777777-7777-7777-7777-111111111111",
      nome: "Maria Clara",
      login: "maria clara",
      senha: "123",
      setor: "Organização de Eventos",
    },
    {
      id: "77777777-7777-7777-7777-222222222222",
      nome: "Isabele",
      login: "isabele",
      senha: "123",
      setor: "Organização de Eventos",
    },
    {
      id: "77777777-7777-7777-7777-333333333333",
      nome: "Victor",
      login: "victor",
      senha: "123",
      setor: "Organização de Eventos",
    },
  ]);

  console.log(
    `👤 ${usuariosEquipe.length} Integrantes reais inseridos na tabela de usuários.`,
  );

  // 3. Injeta demandas iniciais amarradas aos IDs reais correspondentes
  await db.insert(tarefas).values([
    {
      titulo: "Estruturar tabela de preços para novos doces de morango",
      setorDestino: "Atendimento ao Cliente",
      prioridade: "Alta",
      status: "RECEBIDO",
      prazo: "15/06/2026",
      responsavelId: "11111111-1111-1111-1111-111111111111", // Maria Eduarda
    },
    {
      titulo: "Mapear ingredientes e custos com fornecedores locais",
      setorDestino: "Atendimento aos Fornecedores",
      prioridade: "Crítica",
      status: "EM_ANALISE",
      prazo: "12/06/2026",
      responsavelId: "55555555-5555-5555-5555-111111111111", // Guilherme
    },
    {
      titulo: "Criar artes dos posts e storys para o Instagram da fábrica",
      setorDestino: "Mídias",
      prioridade: "Média",
      status: "EM_DESENVOLVIMENTO",
      prazo: "18/06/2026",
      responsavelId: "33333333-3333-3333-3333-222222222222", // Khauan
    },
  ]);

  console.log("📋 Demandas operacionais iniciais distribuídas com sucesso!");
  console.log(
    "✨ Semeio de dados finalizado no Postgres do Neon com Sucesso Total!",
  );

  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("🚨 Erro catastrófico ao rodar o seed:", err);
  process.exit(1);
});
