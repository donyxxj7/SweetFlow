CREATE TYPE "public"."prioridade" AS ENUM('Baixa', 'Média', 'Alta', 'Crítica');--> statement-breakpoint
CREATE TYPE "public"."setor" AS ENUM('Atendimento ao Cliente', 'Coleta de Informações', 'Mídias', 'Escrita de Textos', 'Atendimento aos Fornecedores', 'Gerenciamento de Operações', 'Organização de Eventos');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('RECEBIDO', 'EM_ANALISE', 'EM_DESENVOLVIMENTO', 'EM_APROVACAO', 'CONCLUIDO');--> statement-breakpoint
CREATE TABLE "tarefas" (
	"id" text PRIMARY KEY NOT NULL,
	"titulo" text NOT NULL,
	"setor_destino" "setor" NOT NULL,
	"prioridade" "prioridade" DEFAULT 'Média' NOT NULL,
	"status" "status" DEFAULT 'RECEBIDO' NOT NULL,
	"prazo" text NOT NULL,
	"responsavel_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"login" text NOT NULL,
	"senha" text NOT NULL,
	"setor" "setor" DEFAULT 'Gerenciamento de Operações' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "usuarios_login_unique" UNIQUE("login")
);
--> statement-breakpoint
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_responsavel_id_usuarios_id_fk" FOREIGN KEY ("responsavel_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;