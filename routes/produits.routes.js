import { Router } from "express";
import { createProduit, deleteProduit, getProduit, getProduits, updateProduit } from "../controllers/produit.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireVerifiedEmail } from "../middlewares/verifiedemail.middleware.js";
import { requireRole } from "../middlewares/requireRole.middleware.js";
import { paginationMiddleware } from "../middlewares/pagination.middleware.js";


const produitRouter = Router();


// ==========================================
// ROUTES ACCESSIBLES À TOUT EMPLOYÉ CONNECTÉ
// ==========================================
produitRouter.get("/:id",
    /* #swagger.tags = ['Produits'] */
    /* #swagger.summary = 'Obtenir un produit par ID' */
    authMiddleware, getProduit
);


// ==========================================
// ROUTES RÉSERVÉES À L'ADMINISTRATEUR
// ==========================================
produitRouter.get("/",
    /* #swagger.tags = ['Produits'] */
    /* #swagger.summary = 'Lister tous les produits' */
    authMiddleware, requireVerifiedEmail, requireRole("admin"), paginationMiddleware(), getProduits
);


// ==========================================
// ROUTES ACCESSIBLES AU RESPONSABLE (OU ADMIN)
// ==========================================
produitRouter.post("/",
    /* #swagger.tags = ['Produits'] */
    /* #swagger.summary = 'Créer un produit' */
    authMiddleware, requireVerifiedEmail, requireRole("admin", "responsable"), createProduit
);
produitRouter.patch("/:id",
    /* #swagger.tags = ['Produits'] */
    /* #swagger.summary = 'Mettre à jour un produit' */
    authMiddleware, requireVerifiedEmail, requireRole("admin", "responsable"), updateProduit
);
produitRouter.delete("/:id",
    /* #swagger.tags = ['Produits'] */
    /* #swagger.summary = 'Supprimer un produit' */
    authMiddleware, requireVerifiedEmail, requireRole("admin", "responsable"), deleteProduit
);


export default produitRouter;
