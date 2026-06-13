// backend/src/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "🚨 A variável de ambiente DATABASE_URL não foi encontrada no arquivo .env",
  );
}

// Inicializa o cliente de conexão do Postgres nativo
const queryClient = postgres(process.env.DATABASE_URL);

// Exporta a instância do Drizzle já injetando o seu schema com as tabelas de usuários e tarefas
export const db = drizzle(queryClient, { schema });
