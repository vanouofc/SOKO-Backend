import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { approvisionnerStock, creerStock, deleteStock, getStock, getStocks, removeQuantiteStock, restoreStock, updateStock } from "../controllers/stocks.controller.js";
import { requireVerifiedEmail } from "../middlewares/verifiedemail.middleware.js";
import { requireRole } from "../middlewares/requireRole.middleware.js";
import { paginationMiddleware } from "../middlewares/pagination.middleware.js";

const stockRouter = Router();


// ==========================================
// ROUTES ACCESSIBLES À TOUT EMPLOYÉ CONNECTÉ
// ==========================================
stockRouter.get("/",
    /* #swagger.tags = ['Stocks'] */
    /* #swagger.summary = 'Lister tous les stocks' */
    authMiddleware, paginationMiddleware(), getStocks
);
stockRouter.get("/:id",
    /* #swagger.tags = ['Stocks'] */
    /* #swagger.summary = 'Obtenir un stock par ID' */
    authMiddleware, getStock
);


// ==========================================
// ROUTES ACCESSIBLES AU RESPONSABLE (OU ADMIN)
// ==========================================
stockRouter.post("/",
    /* #swagger.tags = ['Stocks'] */
    /* #swagger.summary = 'Créer une entrée de stock' */
    authMiddleware, requireVerifiedEmail, requireRole("admin", "responsable"), creerStock
);
stockRouter.patch("/:id",
    /* #swagger.tags = ['Stocks'] */
    /* #swagger.summary = 'Mettre à jour un stock' */
    authMiddleware, requireVerifiedEmail, requireRole("admin", "responsable"), updateStock
);
stockRouter.patch("/:id/add",
    /* #swagger.tags = ['Stocks'] */
    /* #swagger.summary = 'Approvisionner un stock' */
    authMiddleware, requireVerifiedEmail, requireRole("admin", "responsable"), approvisionnerStock
);
stockRouter.patch("/:id/remove",
    /* #swagger.tags = ['Stocks'] */
    /* #swagger.summary = 'Retirer une quantité de stock' */
    authMiddleware, requireVerifiedEmail, requireRole("admin", "responsable"), removeQuantiteStock
);
stockRouter.delete("/:id",
    /* #swagger.tags = ['Stocks'] */
    /* #swagger.summary = 'Supprimer un stock' */
    authMiddleware, requireVerifiedEmail, requireRole("admin", "responsable"), deleteStock
);
stockRouter.patch("/:id/restore",
    /* #swagger.tags = ['Stocks'] */
    /* #swagger.summary = 'Restaurer un stock supprimé' */
    authMiddleware, requireVerifiedEmail, requireRole("admin", "responsable"), restoreStock
);


export default stockRouter;
