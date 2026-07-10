import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { annulerPerte, creerPerte, deletePerte, getPerte, getPertes } from "../controllers/pertes.controller.js";
import { requireVerifiedEmail } from "../middlewares/verifiedemail.middleware.js";
import { requireRole } from "../middlewares/requireRole.middleware.js";
import { paginationMiddleware } from "../middlewares/pagination.middleware.js";

const perteRouter = Router();


// ==========================================
// ROUTES ACCESSIBLES À TOUT EMPLOYÉ CONNECTÉ
// ==========================================
perteRouter.get("/",
    /* #swagger.tags = ['Pertes'] */
    /* #swagger.summary = 'Lister toutes les pertes' */
    authMiddleware, paginationMiddleware(), getPertes
);
perteRouter.get("/:id",
    /* #swagger.tags = ['Pertes'] */
    /* #swagger.summary = 'Obtenir une perte par ID' */
    authMiddleware, getPerte
);


// ==========================================
// ROUTES ACCESSIBLES AU RESPONSABLE (OU ADMIN)
// ==========================================
perteRouter.post("/",
    /* #swagger.tags = ['Pertes'] */
    /* #swagger.summary = 'Créer une perte' */
    authMiddleware, requireVerifiedEmail, requireRole("admin", "responsable"), creerPerte
);
perteRouter.patch("/:id",
    /* #swagger.tags = ['Pertes'] */
    /* #swagger.summary = 'Annuler une perte' */
    authMiddleware, requireVerifiedEmail, requireRole("admin", "responsable"), annulerPerte
);


// ==========================================
// ROUTES RÉSERVÉES À L'ADMINISTRATEUR
// ==========================================
perteRouter.delete("/:id",
    /* #swagger.tags = ['Pertes'] */
    /* #swagger.summary = 'Supprimer une perte' */
    authMiddleware, requireVerifiedEmail, requireRole("admin"), deletePerte
);


export default perteRouter;
