// backend/src/server.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Injeção das rotas de autenticação globais
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "SweetFlow API rodando com sucesso e integrada ao Prisma v5!",
  });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`🚀 Servidor SweetFlow online na porta ${PORT}`);
});
