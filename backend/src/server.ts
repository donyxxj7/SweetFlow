// backend/src/server.ts
import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { db } from "./db/index.js";
import { tarefas, usuarios } from "./db/schema.js";
import { eq, and } from "drizzle-orm";

const fastify = Fastify({
  logger: true,
});

async function bootstrap() {
  await fastify.register(cors, {
    origin: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // ROTA: AUTENTICAÇÃO DE LOGIN
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

      return reply.status(200).send({
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

  // ROTA: ATUALIZAÇÃO DO KANBAN (PATCH)
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

  // =========================================================================
  // NOVA ROTA SÊNIOR: EXCLUSÃO DE DEMANDA (DELETE)
  // =========================================================================
  fastify.delete("/tarefas/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      // Executa o comando DELETE físico na nuvem do Neon Tech filtrando pelo ID único
      const resultado = await db
        .delete(tarefas)
        .where(eq(tarefas.id, id))
        .returning();

      // Se o array voltar vazio, significa que esse ID já não existia no banco
      if (resultado.length === 0) {
        return reply
          .status(404)
          .send({ error: "Tarefa não encontrada no banco de dados." });
      }

      return reply
        .status(200)
        .send({ success: true, message: "Demanda deletada com sucesso." });
    } catch (erro) {
      fastify.log.error(erro);
      return reply
        .status(500)
        .send({ error: "Erro ao tentar deletar registro no Postgres." });
    }
  });

  try {
    await fastify.listen({ port: 3333, host: "0.0.0.0" });
    console.log("🚀 SweetFlow API ativa e rodando em: http://localhost:3333");
  } catch (err) {
    process.exit(1);
  }
}

bootstrap();
