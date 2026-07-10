import { Router } from "express";
import { createProduit, deleteProduit, getProduit, getProduits, updateProduit } from "../controllers/produit.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { paginationMiddleware } from "../middlewares/pagination.middleware.js";


const produitRouter = Router();


produitRouter.post("/", authMiddleware, createProduit);
produitRouter.get("/", authMiddleware, paginationMiddleware(), getProduits);
produitRouter.get("/:id", authMiddleware, getProduit);
produitRouter.patch("/:id", authMiddleware, updateProduit);
produitRouter.delete("/:id", authMiddleware, deleteProduit);


export default produitRouter;