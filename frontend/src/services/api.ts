// frontend/src/services/api.ts
import axios from "axios";

// Substitua o localhost diretamente pelo link oficial da sua API na Vercel
// ATENÇÃO: Deixe SEM a barra "/" no final do link!
export const api = axios.create({
  baseURL: "https://sweet-flow-nine.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});
