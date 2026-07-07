import { Router } from "express";
import { ajouterResponsable, creerBoutique, deleteBoutique, getBoutique, getBoutiques, restoreBoutique, retirerResponsable, updateBoutique } from "../controllers/boutiques.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireVerifiedEmail } from "../middlewares/verifiedemail.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";
import { requireResponsableOuAdmin } from "../middlewares/responsableouadmin.middleware.js";

const boutiqueRouter = Router();

// ==========================================
// ROUTES PUBLIC / EMPLOYÉS CONNECTÉS
// ==========================================
boutiqueRouter.get("/:id", authMiddleware, getBoutique);


// ==========================================
// ROUTES RÉSERVÉES AUX ADMINISTRATEURS
// ==========================================
boutiqueRouter.post("/", authMiddleware, requireVerifiedEmail, requireAdmin, creerBoutique); 
boutiqueRouter.get("/", authMiddleware, requireVerifiedEmail, requireAdmin, getBoutiques);
boutiqueRouter.patch("/:id/restore", authMiddleware, requireVerifiedEmail, requireAdmin, restoreBoutique); 
boutiqueRouter.patch("/:id/responsables", authMiddleware, requireVerifiedEmail, requireAdmin, ajouterResponsable);
boutiqueRouter.delete("/:id/responsables/:utilisateurId", authMiddleware, requireVerifiedEmail, requireAdmin, retirerResponsable);


// ==========================================
// ROUTES ACCESSIBLES AU RESPONSABLE DE LA BOUTIQUE (OU ADMIN)
// ==========================================
boutiqueRouter.patch("/:id", authMiddleware, requireVerifiedEmail, requireResponsableOuAdmin, updateBoutique); 
boutiqueRouter.delete("/:id", authMiddleware, requireVerifiedEmail, requireResponsableOuAdmin, deleteBoutique); 

export default boutiqueRouter;