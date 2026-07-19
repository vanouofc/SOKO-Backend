import { desactiverUtilisateurService, getUtilisateurService, listerUtilisateursService, modifierProfilService, modifierRoleService, reactiverUtilisateurService } from "../services/utilisateurs.service.js";
import { buildPaginatedResponse } from "../utils/pagination.util.js";

export const getProfil = async (req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Profil récupéré avec succès.",
            data: req.user
        });
    } catch (error) {
        next(error);
    }
};

export const modifierProfil = async (req, res, next) => {
    try {
        const utilisateur = await modifierProfilService(req.user.id, req.body);

        return res.status(200).json({
            success: true,
            message: "Profil mis à jour avec succès.",
            data: utilisateur
        });
    } catch (error) {
        next(error);
    }
};

export const listerUtilisateurs = async (req, res, next) => {
    try {
        const { utilisateurs, total } = await listerUtilisateursService(req.pagination);
        const response = buildPaginatedResponse(utilisateurs, total, req.pagination);

        return res.status(200).json({
            success: true,
            message: "Liste des utilisateurs récupérée avec succès.",
            ...response
        });
    } catch (error) {
        next(error);
    }
};

export const getUtilisateur = async (req, res, next) => {
    try {
        const { id } = req.params;
        const utilisateur = await getUtilisateurService(id);

        return res.status(200).json({
            success: true,
            message: "Utilisateur récupéré avec succès.",
            data: utilisateur
        });
    } catch (error) {
        next(error);
    }
};

export const modifierRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({
                success: false,
                message: "Le champ 'role' est requis."
            });
        }

        const utilisateur = await modifierRoleService(id, role);

        return res.status(200).json({
            success: true,
            message: "Rôle mis à jour avec succès.",
            data: utilisateur
        });
    } catch (error) {
        next(error);
    }
};

export const desactiverUtilisateur = async (req, res, next) => {
    try {
        const { id } = req.params;
        const utilisateur = await desactiverUtilisateurService(id);

        return res.status(200).json({
            success: true,
            message: "Utilisateur désactivé avec succès.",
            data: utilisateur
        });
    } catch (error) {
        next(error);
    }
};

export const reactiverUtilisateur = async (req, res, next) => {
    try {
        const { id } = req.params;
        const utilisateur = await reactiverUtilisateurService(id);

        return res.status(200).json({
            success: true,
            message: "Utilisateur réactivé avec succès.",
            data: utilisateur
        });
    } catch (error) {
        next(error);
    }
};
