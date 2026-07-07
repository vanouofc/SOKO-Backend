import { getBoutiqueService } from "../services/boutiques.service.js";

export const requireResponsableOuAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Non autorisé. Veuillez vous connecter."
            });
        }

        const { id } = req.params;
        const boutique = await getBoutiqueService(id);

        if (!boutique) {
            return res.status(404).json({
                success: false,
                message: "Aucune boutique trouvée."
            });
        }

        // Un admin passe toujours ; sinon il faut être le responsable de CETTE boutique
        const estAdmin = req.user.role === "admin";
        const estResponsable = boutique.responsables.some(
            r => r.toString() === req.user.id.toString()
        );

        if (!estAdmin && !estResponsable) {
            return res.status(403).json({
                success: false,
                message: "Vous ne pouvez pas modifier cette boutique."
            });
        }

        // On attache la boutique à req pour éviter un second appel getBoutiqueService dans le controller
        req.boutique = boutique;

        next();
    } catch (error) {
        next(error);
    }
};