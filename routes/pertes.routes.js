import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { creerPerte } from "../controllers/pertes.controller.js";

const perteRouter = Router();

perteRouter.post("/", authMiddleware, creerPerte);

export default perteRouter;