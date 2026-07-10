import { Router } from "express";
import { annulerVente, creerVente, deleteVente, getVente, getVentes } from "../controllers/ventes.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireVerifiedEmail } from "../middlewares/verifiedemail.middleware.js";
import { requireRole } from "../middlewares/requireRole.middleware.js";
import { paginationMiddleware } from "../middlewares/pagination.middleware.js";

const venteRouter = Router();


// ==========================================
// ROUTES ACCESSIBLES À TOUT EMPLOYÉ CONNECTÉ
// ==========================================
venteRouter.get("/",
    /* #swagger.tags = ['Ventes'] */
    /* #swagger.summary = 'Lister toutes les ventes' */
    authMiddleware, paginationMiddleware(), getVentes
);
venteRouter.get("/:id",
    /* #swagger.tags = ['Ventes'] */
    /* #swagger.summary = 'Obtenir une vente par ID' */
    authMiddleware, getVente
);


// ==========================================
// ROUTES ACCESSIBLES AU RESPONSABLE (OU ADMIN)
// ==========================================
venteRouter.post("/",
    /* #swagger.tags = ['Ventes'] */
    /* #swagger.summary = 'Créer une vente' */
    authMiddleware, requireVerifiedEmail, requireRole("admin", "responsable"), creerVente
);
venteRouter.patch("/:id",
    /* #swagger.tags = ['Ventes'] */
    /* #swagger.summary = 'Annuler une vente' */
    authMiddleware, requireVerifiedEmail, requireRole("admin", "responsable"), annulerVente
);


// ==========================================
// ROUTES RÉSERVÉES À L'ADMINISTRATEUR
// ==========================================
venteRouter.delete("/:id",
    /* #swagger.tags = ['Ventes'] */
    /* #swagger.summary = 'Supprimer une vente' */
    authMiddleware, requireVerifiedEmail, requireRole("admin"), deleteVente
);


export default venteRouter;
