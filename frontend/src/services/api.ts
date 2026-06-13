// frontend/src/services/api.ts
import axios from "axios";

export const api = axios.create({
  // Conecta direto no servidor Fastify que você acabou de ligar
  baseURL: "http://localhost:3333",
  headers: {
    "Content-Type": "application/json",
  },
});
