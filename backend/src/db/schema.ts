// backend/src/db/schema.ts
import { pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from "uuid";

// Definição dos Enums no Banco de Dados
export const setorEnum = pgEnum("setor", [
  "Atendimento ao Cliente",
  "Coleta de Informações",
  "Mídias",
  "Escrita de Textos",
  "Atendimento aos Fornecedores",
  "Gerenciamento de Operações",
  "Organização de Eventos",
]);

export const prioridadeEnum = pgEnum("prioridade", [
  "Baixa",
  "Média",
  "Alta",
  "Crítica",
]);

export const statusEnum = pgEnum("status", [
  "RECEBIDO",
  "EM_ANALISE",
  "EM_DESENVOLVIMENTO",
  "EM_APROVACAO",
  "CONCLUIDO",
]);

// Tabela de Usuários
export const usuarios = pgTable("usuarios", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  nome: text("nome").notNull(),
  login: text("login").notNull().unique(),
  senha: text("senha").notNull(),
  setor: setorEnum("setor").default("Gerenciamento de Operações").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela de Tarefas
export const tarefas = pgTable("tarefas", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  titulo: text("titulo").notNull(),
  setorDestino: setorEnum("setor_destino").notNull(),
  prioridade: prioridadeEnum("prioridade").default("Média").notNull(),
  status: statusEnum("status").default("RECEBIDO").notNull(),
  prazo: text("prazo").notNull(),

  // CORREÇÃO SENIOR: Mudamos a chave do objeto para 'responsavelId' explicitamente,
  // mantendo o nome físico no banco como "responsavel_id"
  responsavelId: text("responsavel_id")
    .notNull()
    .references(() => usuarios.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
