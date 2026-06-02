// backend/src/controllers/AuthController.ts
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "chave_mestra_secreta_sweetflow";

export const AuthController = {
  // Cadastro de novos funcionários/usuários
  async registrar(req: Request, res: Response): Promise<void> {
    try {
      const { nome, email, senha, cargo } = req.body;

      // 1. Validação simples se o usuário já existe
      const usuarioExistente = await prisma.usuario.findUnique({
        where: { email },
      });
      if (usuarioExistente) {
        res
          .status(400)
          .json({ erro: "Este e-mail já está cadastrado no sistema." });
        return;
      }

      // 2. Criptografia da senha (Segurança básica corporativa)
      const salt = await bcrypt.genSalt(10);
      const senha_hash = await bcrypt.hash(senha, salt);

      // 3. Salvar no banco PostgreSQL usando nosso schema em português
      const novoUsuario = await prisma.usuario.create({
        data: {
          nome,
          email,
          senha_hash,
          cargo, // ADMINISTRADOR, USUARIO_MIDIA, etc.
        },
        select: { id: true, nome: true, email: true, cargo: true }, // Não retorna o hash por segurança
      });

      res
        .status(201)
        .json({
          mensagem: "Usuário registrado com sucesso!",
          usuario: novoUsuario,
        });
    } catch (error) {
      res.status(500).json({ erro: "Falha interna ao registrar usuário." });
    }
  },

  // Login na plataforma
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, senha } = req.body;

      // 1. Buscar usuário pelo e-mail
      const usuario = await prisma.usuario.findUnique({ where: { email } });
      if (!usuario) {
        res.status(401).json({ erro: "Credenciais inválidas." });
        return;
      }

      // 2. Comparar a senha digitada com o hash salvo no banco
      const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
      if (!senhaValida) {
        res.status(401).json({ erro: "Credenciais inválidas." });
        return;
      }

      // 3. Gerar o Token JWT embutindo o ID e o Cargo para controle de acesso (RBAC)
      const token = jwt.sign(
        { id: usuario.id, cargo: usuario.cargo },
        JWT_SECRET,
        { expiresIn: "1d" }, // Token expira em 24 horas
      );

      res.json({
        mensagem: "Login efetuado com sucesso!",
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          cargo: usuario.cargo,
        },
      });
    } catch (error) {
      res.status(500).json({ erro: "Falha interna ao tentar fazer login." });
    }
  },
};
