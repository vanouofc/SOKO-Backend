import { Router } from "express";
import { createProduit, deleteProduit, getProduit, getProduits, updateProduit, uploadProduitPhoto } from "../controllers/produit.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/requireRole.middleware.js";
import { paginationMiddleware } from "../middlewares/pagination.middleware.js";
import { uploadProduitImage } from "../middlewares/upload.middleware.js";


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
    authMiddleware, requireRole("admin"), paginationMiddleware(), getProduits
);


// ==========================================
// ROUTES ACCESSIBLES AU RESPONSABLE (OU ADMIN)
// ==========================================
produitRouter.post("/upload",
    /* #swagger.tags = ['Produits'] */
    /* #swagger.summary = 'Téléverser la photo d\'un produit (multipart/form-data, champ "photo")' */
    authMiddleware, requireRole("admin", "responsable"), uploadProduitImage, uploadProduitPhoto
);
produitRouter.post("/",
    /* #swagger.tags = ['Produits'] */
    /* #swagger.summary = 'Créer un produit' */
    authMiddleware, requireRole("admin", "responsable"), createProduit
);
produitRouter.patch("/:id",
    /* #swagger.tags = ['Produits'] */
    /* #swagger.summary = 'Mettre à jour un produit' */
    authMiddleware, requireRole("admin", "responsable"), updateProduit
);
produitRouter.delete("/:id",
    /* #swagger.tags = ['Produits'] */
    /* #swagger.summary = 'Supprimer un produit' */
    authMiddleware, requireRole("admin", "responsable"), deleteProduit
);


export default produitRouter;
