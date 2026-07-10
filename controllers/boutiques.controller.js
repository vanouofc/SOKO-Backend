
import { ajouterResponsableService, creerBoutiqueService, getBoutiquesService, getBoutiqueService, updateBoutiqueService, deleteBoutiqueService, restoreBoutiqueService, retirerResponsableService } from "../services/boutiques.service.js";
import { buildPaginatedResponse } from "../utils/pagination.util.js";

export const creerBoutique = async (req, res, next) => {
    try {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Utilisateur non authentifié."
            });
        };

        const { nom, adresse, contact, localisation } = req.body;
        const responsable = req.user.id;
        const responsables = [responsable];

        if (!nom || !adresse || !contact) {
            return res.status(400).json({
                success: false,
                message: "Données incomplètes. Le nom, l'adresse, le contact et la localisation sont requis."
            });
        };

        const nouvelleBoutique = await creerBoutiqueService({
            nom,
            adresse,
            contact,
            localisation,
            responsable
        });

        return res.status(201).json({
            success: true,
            message: "Boutique créée avec succès.",
            data: nouvelleBoutique,
        });

    } catch (error) {
        next(error);
    }
};

export const getBoutiques = async (req, res, next) => {
    try {
        const {boutiques, total} = await getBoutiquesService(req.pagination);
        const response = buildPaginatedResponse(boutiques, total, req.pagination)

        return res.status(200).json({
            success: true,
            message: "Liste des boutiques récupérée avec succès.",
            ...response
        });

    } catch (error) {
        next(error);
    }
};

export const getBoutique = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "L'identifiant de la boutique est requis dans l'URL."
            });
        };

        const boutique = await getBoutiqueService(id);

        if (!boutique) {
            return res.status(404).json({
                success: false,
                message: "Aucune boutique trouvée."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Boutique récupérée avec succès.",
            data: boutique
        });

    } catch (error) {
        next(error);
    }
};

export const updateBoutique = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Utilisateur non authentifié."
            });
        }

        const { id } = req.params;
        const { nom, adresse, contact, localisation } = req.body;
        const utilisateurId = req.user.id;

        // 2. Validation de base : s'assurer qu'on ne vide pas les champs obligatoires
        if (!nom || !adresse || !contact) {
            return res.status(400).json({
                success: false,
                message: "Tous les champs (nom, adresse, contact) sont requis pour la modification."
            });
        };

        // 3. SÉCURITÉ : Vérifier si l'utilisateur connecté est bien le propriétaire de la boutique
        const boutiqueExistante = await getBoutiqueService(id);
        if (!boutiqueExistante) {
            return res.status(404).json({
                success: false,
                message: "Aucune boutique trouvée."
            });
        };

        const boutiqueMiseAJour = await updateBoutiqueService(id, {
            nom,
            adresse,
            contact,
            localisation
        });

        return res.status(200).json({
            success: true,
            message: "Boutique mise à jour avec succès.",
            data: boutiqueMiseAJour
        });
    } catch (error) {
        next(error);
    }
};

export const deleteBoutique = async (req, res, next) => {
    try {
        if (!req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Utilisateur non authentifié."
            });
        };

        const { id } = req.params;
        const user = req.user.id;

        const boutique = await getBoutiqueService(id);
        if (!boutique) {
            return res.status(404).json({
                success: false,
                message: "Aucune boutique trouvée."
            });
        };

        const boutiquedeleted = await deleteBoutiqueService(id);

        return res.status(200).json({
            success: true,
            message: "Boutique supprimée avec succès.",
            data: boutiquedeleted
        });

    } catch (error) {
        next(error);
    }
};

export const restoreBoutique = async (req, res, next) => {
    try {
        if (!req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Utilisateur non authentifié."
            });
        };

        const { id } = req.params;

        const boutiqueRestoree = await restoreBoutiqueService(id);

        return res.status(200).json({
            success: true,
            message: "Boutique restaurée avec succès.",
            data: boutiqueRestoree
        });

    } catch (error) {
        next(error);
    }
};

export const ajouterResponsable = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { utilisateurId } = req.body;

        if (!utilisateurId) {
            return res.status(400).json({
                success: false,
                message: "L'identifiant de l'utilisateur à ajouter est requis."
            });
        }

        const boutiqueMiseAJour = await ajouterResponsableService(id, utilisateurId);

        if (!boutiqueMiseAJour) {
            return res.status(404).json({
                success: false,
                message: "Aucune boutique trouvée."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Responsable ajouté avec succès.",
            data: boutiqueMiseAJour
        });
    } catch (error) {
        next(error);
    }
};

export const retirerResponsable = async (req, res, next) => {
    try {
        const { id, utilisateurId } = req.params;

        const boutiqueMiseAJour = await retirerResponsableService(id, utilisateurId);

        if (!boutiqueMiseAJour) {
            return res.status(404).json({
                success: false,
                message: "Aucune boutique trouvée."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Responsable retiré avec succès.",
            data: boutiqueMiseAJour
        });
    } catch (error) {
        next(error);
    }
};