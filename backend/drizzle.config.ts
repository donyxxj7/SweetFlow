// backend/drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // O drizzle-kit lê a variável DATABASE_URL direto do seu arquivo .env em segundo plano
    url: String(process.env.DATABASE_URL),
  },
});
