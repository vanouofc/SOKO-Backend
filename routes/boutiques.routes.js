import { Router } from "express";
import { ajouterResponsable, ajouterSecretaire, creerBoutique, deleteBoutique, getBoutique, getBoutiques, restoreBoutique, retirerResponsable, retirerSecretaire, updateBoutique } from "../controllers/boutiques.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/requireRole.middleware.js";
import { requireResponsableOuAdmin } from "../middlewares/responsableouadmin.middleware.js";
import { paginationMiddleware } from "../middlewares/pagination.middleware.js";

const boutiqueRouter = Router();


// ==========================================
// ROUTES ACCESSIBLES À TOUT EMPLOYÉ CONNECTÉ
// ==========================================
boutiqueRouter.get("/:id",
    /* #swagger.tags = ['Boutiques'] */
    /* #swagger.summary = 'Obtenir une boutique par ID' */
    authMiddleware, getBoutique
);


// ==========================================
// ROUTES RÉSERVÉES À L'ADMINISTRATEUR
// ==========================================
boutiqueRouter.post("/",
    /* #swagger.tags = ['Boutiques'] */
    /* #swagger.summary = 'Créer une boutique' */
    /* #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/definitions/Boutique" } } } } */
    /* #swagger.responses[201] = { description: 'Boutique créée avec succès' } */
    /* #swagger.responses[400] = { description: 'Données invalides' } */
    /* #swagger.responses[401] = { description: 'Non authentifié' } */
    /* #swagger.responses[403] = { description: 'Accès refusé' } */
    authMiddleware, requireRole("admin"), creerBoutique
);
boutiqueRouter.get("/",
    /* #swagger.tags = ['Boutiques'] */
    /* #swagger.summary = 'Lister toutes les boutiques' */
    authMiddleware, requireRole("admin"), paginationMiddleware(), getBoutiques
);
boutiqueRouter.patch("/:id/restore",
    /* #swagger.tags = ['Boutiques'] */
    /* #swagger.summary = 'Restaurer une boutique supprimée' */
    authMiddleware, requireRole("admin"), restoreBoutique
);
boutiqueRouter.patch("/:id/responsables",
    /* #swagger.tags = ['Boutiques'] */
    /* #swagger.summary = 'Ajouter un responsable à une boutique' */
    authMiddleware, requireRole("admin"), ajouterResponsable
);
boutiqueRouter.delete("/:id/responsables/:utilisateurId",
    /* #swagger.tags = ['Boutiques'] */
    /* #swagger.summary = 'Retirer un responsable de boutique' */
    authMiddleware, requireRole("admin"), retirerResponsable
);


// ==========================================
// ROUTES ACCESSIBLES AU RESPONSABLE DE LA BOUTIQUE (OU ADMIN)
// ==========================================
boutiqueRouter.patch("/:id",
    /* #swagger.tags = ['Boutiques'] */
    /* #swagger.summary = 'Mettre à jour une boutique' */
    authMiddleware, requireResponsableOuAdmin, updateBoutique
);
boutiqueRouter.delete("/:id",
    /* #swagger.tags = ['Boutiques'] */
    /* #swagger.summary = 'Supprimer une boutique (soft delete)' */
    authMiddleware, requireResponsableOuAdmin, deleteBoutique
);
boutiqueRouter.patch("/:id/secretaires",
    /* #swagger.tags = ['Boutiques'] */
    /* #swagger.summary = 'Ajouter un secrétaire à une boutique' */
    authMiddleware, requireVerifiedEmail, requireResponsableOuAdmin, ajouterSecretaire
);
boutiqueRouter.delete("/:id/secretaires/:utilisateurId",
    /* #swagger.tags = ['Boutiques'] */
    /* #swagger.summary = 'Retirer un secrétaire de boutique' */
    authMiddleware, requireVerifiedEmail, requireResponsableOuAdmin, retirerSecretaire
);


export default boutiqueRouter;
