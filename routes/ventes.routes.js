import { Router } from "express";
import { annulerVente, creerVente, deleteVente, getVente, getVentes } from "../controllers/ventes.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const venteRouter = Router();

venteRouter.post("/", authMiddleware, creerVente);
venteRouter.get("/", authMiddleware, getVentes);
venteRouter.get("/:id", authMiddleware, getVente);
venteRouter.patch("/:id", authMiddleware, annulerVente);
venteRouter.delete("/:id", authMiddleware, deleteVente);

export default venteRouter;