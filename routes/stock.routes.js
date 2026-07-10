import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { approvisionnerStock, creerStock, deleteStock, getStock, getStocks, removeQuantiteStock, restoreStock, updateStock } from "../controllers/stocks.controller.js";
import { requireResponsableOuAdmin } from "../middlewares/responsableouadmin.middleware.js";
import { paginationMiddleware } from "../middlewares/pagination.middleware.js";

const stockRouter = Router();

stockRouter.post("/", authMiddleware, creerStock);
stockRouter.get("/", authMiddleware, paginationMiddleware(), getStocks);
stockRouter.get("/:id", authMiddleware, getStock);
stockRouter.delete("/:id", authMiddleware, deleteStock);
stockRouter.patch("/:id", authMiddleware, updateStock);
stockRouter.patch("/:id/restore", authMiddleware, restoreStock);
stockRouter.patch("/:id/add", authMiddleware, approvisionnerStock);
stockRouter.patch("/:id/remove", authMiddleware, removeQuantiteStock);

export default stockRouter;