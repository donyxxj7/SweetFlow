// backend/src/middlewares/authMiddleware.ts
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "chave_mestra_secreta_sweetflow";

export interface RequestAutenticada extends Request {
  usuarioToken?: {
    id: string;
    cargo: string;
  };
}

export function verificarToken(
  req: RequestAutenticada,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ erro: "Acesso negado. Token não fornecido." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    // @ts-ignore - Supressão necessária devido ao conflito estrito de sobrecarga da biblioteca local @types/jsonwebtoken
    const decodificado = jwt.verify(token, JWT_SECRET) as any;

    req.usuarioToken = decodificado;

    next();
  } catch (error) {
    res.status(403).json({ erro: "Token inválido ou expirado." });
  }
}
