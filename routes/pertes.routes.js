import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { annulerPerte, creerPerte, deletePerte, getPerte, getPertes } from "../controllers/pertes.controller.js";

const perteRouter = Router();

perteRouter.post("/", authMiddleware, creerPerte);
perteRouter.get("/", authMiddleware, getPertes);
perteRouter.get("/:id", authMiddleware, getPerte);
perteRouter.patch("/:id", authMiddleware, annulerPerte);
perteRouter.delete("/:id", authMiddleware, deletePerte);

export default perteRouter;