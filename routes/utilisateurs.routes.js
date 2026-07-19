import { Router } from "express";
import { desactiverUtilisateur, getProfil, getUtilisateur, listerUtilisateurs, modifierProfil, modifierRole, reactiverUtilisateur } from "../controllers/utilisateurs.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireVerifiedEmail } from "../middlewares/verifiedemail.middleware.js";
import { requireRole } from "../middlewares/requireRole.middleware.js";
import { paginationMiddleware } from "../middlewares/pagination.middleware.js";

const utilisateurRouter = Router();


// ==========================================
// ROUTES ACCESSIBLES À TOUT EMPLOYÉ CONNECTÉ
// ==========================================
utilisateurRouter.get("/me",
    /* #swagger.tags = ['Utilisateurs'] */
    /* #swagger.summary = 'Obtenir son propre profil' */
    authMiddleware, getProfil
);
utilisateurRouter.patch("/me",
    /* #swagger.tags = ['Utilisateurs'] */
    /* #swagger.summary = 'Modifier son propre profil' */
    authMiddleware, requireVerifiedEmail, modifierProfil
);


// ==========================================
// ROUTES RÉSERVÉES À L'ADMINISTRATEUR
// ==========================================
utilisateurRouter.get("/",
    /* #swagger.tags = ['Utilisateurs'] */
    /* #swagger.summary = 'Lister tous les utilisateurs' */
    authMiddleware, requireVerifiedEmail, requireRole("admin"), paginationMiddleware(), listerUtilisateurs
);
utilisateurRouter.get("/:id",
    /* #swagger.tags = ['Utilisateurs'] */
    /* #swagger.summary = 'Obtenir un utilisateur par ID' */
    authMiddleware, requireVerifiedEmail, requireRole("admin"), getUtilisateur
);
utilisateurRouter.patch("/:id/role",
    /* #swagger.tags = ['Utilisateurs'] */
    /* #swagger.summary = 'Modifier le role d\'un utilisateur' */
    authMiddleware, requireVerifiedEmail, requireRole("admin"), modifierRole
);
utilisateurRouter.patch("/:id/desactiver",
    /* #swagger.tags = ['Utilisateurs'] */
    /* #swagger.summary = 'Désactiver un utilisateur' */
    authMiddleware, requireVerifiedEmail, requireRole("admin"), desactiverUtilisateur
);
utilisateurRouter.patch("/:id/reactiver",
    /* #swagger.tags = ['Utilisateurs'] */
    /* #swagger.summary = 'Réactiver un utilisateur' */
    authMiddleware, requireVerifiedEmail, requireRole("admin"), reactiverUtilisateur
);


export default utilisateurRouter;
