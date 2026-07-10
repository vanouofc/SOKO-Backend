import { Router } from "express";
import { annulerVente, creerVente, deleteVente, getVente, getVentes } from "../controllers/ventes.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { paginationMiddleware } from "../middlewares/pagination.middleware.js";

const venteRouter = Router();

venteRouter.post("/", authMiddleware, creerVente);
venteRouter.get("/", authMiddleware, paginationMiddleware(), getVentes);
venteRouter.get("/:id", authMiddleware, getVente);
venteRouter.patch("/:id", authMiddleware, annulerVente);
venteRouter.delete("/:id", authMiddleware, deleteVente);

export default venteRouter;