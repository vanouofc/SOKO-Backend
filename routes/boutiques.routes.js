import { Router } from "express";
import { ajouterResponsable, creerBoutique, deleteBoutique, getBoutique, getBoutiques, restoreBoutique, retirerResponsable, updateBoutique } from "../controllers/boutiques.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireVerifiedEmail } from "../middlewares/verifiedemail.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";
import { requireResponsableOuAdmin } from "../middlewares/responsableouadmin.middleware.js";
import { paginationMiddleware } from "../middlewares/pagination.middleware.js";

const boutiqueRouter = Router();

// ==========================================
// ROUTES PUBLIC / EMPLOYÉS CONNECTÉS
// ==========================================

/**
 * @route POST /api/boutiques
 */
boutiqueRouter.get("/:id", authMiddleware, getBoutique);
/*
    #swagger.tags = ['Boutiques']
    #swagger.summary = 'Créer une boutique'
    #swagger.description = 'Permet à un administrateur de créer une nouvelle boutique.'

    #swagger.security = [{
        "bearerAuth": []
    }]

    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    nom: "Boutique Centre",
                    adresse: "Yaoundé Centre",
                    contact: "+237699999999"
                }
            }
        }
    }

    #swagger.responses[201] = {
        description: 'Boutique créée avec succès'
    }

    #swagger.responses[400] = {
        description: 'Données invalides'
    }

    #swagger.responses[401] = {
        description: 'Non authentifié'
    }

    #swagger.responses[403] = {
        description: 'Accès refusé'
    }
*/


/**
 * @route POST /api/boutiques
 */
boutiqueRouter.post("/", authMiddleware, requireVerifiedEmail, requireAdmin, creerBoutique); 
/*
    #swagger.tags = ['Boutiques']
    #swagger.summary = 'Créer une boutique'
    #swagger.description = 'Permet à un administrateur de créer une nouvelle boutique.'

    #swagger.security = [{
        "bearerAuth": []
    }]

    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    nom: "Boutique Centre",
                    adresse: "Yaoundé Centre",
                    contact: "+237699999999"
                }
            }
        }
    }

    #swagger.responses[201] = {
        description: 'Boutique créée avec succès'
    }

    #swagger.responses[400] = {
        description: 'Données invalides'
    }

    #swagger.responses[401] = {
        description: 'Non authentifié'
    }

    #swagger.responses[403] = {
        description: 'Accès refusé'
    }
*/

boutiqueRouter.get("/", authMiddleware, requireVerifiedEmail, requireAdmin, paginationMiddleware(), getBoutiques);
boutiqueRouter.patch("/:id/restore", authMiddleware, requireVerifiedEmail, requireAdmin, restoreBoutique); 
boutiqueRouter.patch("/:id/responsables", authMiddleware, requireVerifiedEmail, requireAdmin, ajouterResponsable);
boutiqueRouter.delete("/:id/responsables/:utilisateurId", authMiddleware, requireVerifiedEmail, requireAdmin, retirerResponsable);


// ==========================================
// ROUTES ACCESSIBLES AU RESPONSABLE DE LA BOUTIQUE (OU ADMIN)
// ==========================================
boutiqueRouter.patch("/:id", authMiddleware, requireVerifiedEmail, requireResponsableOuAdmin, updateBoutique); 
boutiqueRouter.delete("/:id", authMiddleware, requireVerifiedEmail, requireResponsableOuAdmin, deleteBoutique); 

export default boutiqueRouter;