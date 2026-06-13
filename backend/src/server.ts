// backend/src/server.ts
import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { db } from "./db/index.js";
import { tarefas, usuarios } from "./db/schema.js";
import { eq, and } from "drizzle-orm";

// 1. MODIFICAÇÃO SÊNIOR: Exportamos a constante para a Vercel conseguir ler o servidor
export const fastify = Fastify({
  logger: true,
});

async function bootstrap() {
  await fastify.register(cors, {
    origin: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // ROTA: LOGIN
  fastify.post("/login", async (request, reply) => {
    try {
      const { login, senha } = request.body as { login: string; senha: string };
      if (!login || !senha)
        return reply.status(400).send({ error: "Campos obrigatórios." });
      const [usuarioEncontrado] = await db
        .select()
        .from(usuarios)
        .where(and(eq(usuarios.login, login), eq(usuarios.senha, senha)));
      if (!usuarioEncontrado)
        return reply.status(401).send({ error: "Incorretos." });
      return reply
        .status(200)
        .send({
          id: usuarioEncontrado.id,
          nome: usuarioEncontrado.nome,
          setor: usuarioEncontrado.setor,
        });
    } catch (erro) {
      return reply.status(500).send({ error: "Erro no login." });
    }
  });

  // ROTA: LISTAGEM (GET)
  fastify.get("/tarefas", async (request, reply) => {
    try {
      const listaTarefas = await db.select().from(tarefas);
      return listaTarefas;
    } catch (erro) {
      return reply.status(500).send({ error: "Falha ao buscar tarefas." });
    }
  });

  // ROTA: CRIAÇÃO (POST)
  fastify.post("/tarefas", async (request, reply) => {
    try {
      const { titulo, setorDestino, prioridade, prazo } = request.body as any;
      const novaTarefa = await db
        .insert(tarefas)
        .values({
          titulo,
          setorDestino,
          prioridade,
          prazo,
          responsavelId: "00000000-0000-0000-0000-000000000000",
        })
        .returning();
      return reply.status(201).send(novaTarefa[0]);
    } catch (erro) {
      return reply.status(500).send({ error: "Erro ao salvar." });
    }
  });

  // ROTA: ATUALIZAÇÃO (PATCH)
  fastify.patch("/tarefas/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const { status } = request.body as { status: any };
      await db.update(tarefas).set({ status }).where(eq(tarefas.id, id));
      return reply.status(200).send({ success: true });
    } catch (erro) {
      return reply.status(500).send({ error: "Falha ao atualizar." });
    }
  });

  // ROTA: EXCLUSÃO (DELETE)
  fastify.delete("/tarefas/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const resultado = await db
        .delete(tarefas)
        .where(eq(tarefas.id, id))
        .returning();
      if (resultado.length === 0)
        return reply.status(404).send({ error: "Não encontrada." });
      return reply.status(200).send({ success: true });
    } catch (erro) {
      return reply.status(500).send({ error: "Erro ao deletar." });
    }
  });

  // 2. MODIFICAÇÃO SÊNIOR: Só damos o listen se NÃO estivermos rodando no ambiente da Vercel
  if (process.env.NODE_ENV !== "production") {
    try {
      await fastify.listen({ port: 3333, host: "0.0.0.0" });
      console.log("🚀 Local: http://localhost:3333");
    } catch (err) {
      process.exit(1);
    }
  }
}

bootstrap();
