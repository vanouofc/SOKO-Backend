import {
    listerUtilisateursService,
    getUtilisateurService,
    modifierProfilService,
    modifierRoleService,
    desactiverUtilisateurService,
} from "../services/utilisateurs.service.js";
import { buildPaginatedResponse } from "../utils/pagination.util.js";

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

export const getMonProfil = async (req, res, next) => {
    try {
        const utilisateur = await getUtilisateurService(req.user.id);

        return res.status(200).json({
            success: true,
            message: "Profil récupéré avec succès.",
            data: utilisateur
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

export const modifierMonProfil = async (req, res, next) => {
    try {
        const { nom, prenom, phone, photo } = req.body;

        const utilisateur = await modifierProfilService(req.user.id, { nom, prenom, phone, photo });

        return res.status(200).json({
            success: true,
            message: "Profil mis à jour avec succès.",
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
                message: "Le nouveau rôle est requis."
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

        // Empêche un admin de se désactiver lui-même par erreur et de se
        // retrouver bloqué hors du système.
        if (id === req.user.id.toString()) {
            return res.status(400).json({
                success: false,
                message: "Vous ne pouvez pas désactiver votre propre compte."
            });
        }

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
