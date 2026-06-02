// backend/src/routes/authRoutes.ts
import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";

const router = Router();

router.post("/registrar", AuthController.registrar);
router.post("/login", AuthController.login);

export default router;
