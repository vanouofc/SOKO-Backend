import { Router } from "express";
import {
    listerUtilisateurs,
    getMonProfil,
    getUtilisateur,
    modifierMonProfil,
    modifierRole,
    desactiverUtilisateur,
} from "../controllers/utilisateurs.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/requireRole.middleware.js";
import { paginationMiddleware } from "../middlewares/pagination.middleware.js";

const utilisateurRouter = Router();


// ==========================================
// ROUTES ACCESSIBLES À TOUT EMPLOYÉ CONNECTÉ
// ==========================================
utilisateurRouter.get("/me",
    /* #swagger.tags = ['Utilisateurs'] */
    /* #swagger.summary = 'Obtenir mon profil' */
    authMiddleware, getMonProfil
);
utilisateurRouter.patch("/me",
    /* #swagger.tags = ['Utilisateurs'] */
    /* #swagger.summary = 'Mettre à jour mon profil (nom, prénom, téléphone, photo)' */
    authMiddleware, modifierMonProfil
);


// ==========================================
// ROUTES RÉSERVÉES À L'ADMINISTRATEUR
// ==========================================
utilisateurRouter.get("/",
    /* #swagger.tags = ['Utilisateurs'] */
    /* #swagger.summary = 'Lister tous les utilisateurs' */
    authMiddleware, requireRole("admin"), paginationMiddleware(), listerUtilisateurs
);
utilisateurRouter.get("/:id",
    /* #swagger.tags = ['Utilisateurs'] */
    /* #swagger.summary = 'Obtenir un utilisateur par ID' */
    authMiddleware, requireRole("admin"), getUtilisateur
);
utilisateurRouter.patch("/:id/role",
    /* #swagger.tags = ['Utilisateurs'] */
    /* #swagger.summary = "Modifier le rôle d'un utilisateur" */
    authMiddleware, requireRole("admin"), modifierRole
);
utilisateurRouter.patch("/:id/desactiver",
    /* #swagger.tags = ['Utilisateurs'] */
    /* #swagger.summary = 'Désactiver un utilisateur' */
    authMiddleware, requireRole("admin"), desactiverUtilisateur
);


export default utilisateurRouter;
