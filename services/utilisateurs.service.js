import Utilisateur from "../models/utilisateurs.model.js";
import { ErreurMetier } from "../errors/ErreurMetier.js";

const ROLES_VALIDES = ["secretaire", "responsable", "admin"];
const CHAMPS_PROFIL_AUTORISES = ["nom", "prenom", "phone", "photo"];

export const listerUtilisateursService = async ({ skip, limit }) => {
    try {
        const [utilisateurs, total] = await Promise.all([
            Utilisateur.find().skip(skip).limit(limit),
            Utilisateur.countDocuments({ isActive: true })
        ]);

        if (total === 0) {
            throw new ErreurMetier("Aucun utilisateur trouvé.", 404);
        }

        return { utilisateurs, total };
    } catch (error) {
        throw error;
    }
};

export const getUtilisateurService = async (id) => {
    try {
        const utilisateur = await Utilisateur.findById(id);
        if (!utilisateur) {
            throw new ErreurMetier("Utilisateur non trouvé.", 404);
        }
        return utilisateur;
    } catch (error) {
        throw error;
    }
};

export const modifierProfilService = async (id, nouvellesdonnees) => {
    try {
        const donneesFiltrees = {};
        for (const champ of CHAMPS_PROFIL_AUTORISES) {
            if (nouvellesdonnees[champ] !== undefined) {
                donneesFiltrees[champ] = nouvellesdonnees[champ];
            }
        }

        if (Object.keys(donneesFiltrees).length === 0) {
            throw new ErreurMetier("Aucun champ valide à mettre à jour.", 400);
        }

        const utilisateurMisAJour = await Utilisateur.findByIdAndUpdate(
            id,
            { $set: donneesFiltrees },
            { returnDocument: "after", runValidators: true }
        );

        if (!utilisateurMisAJour) {
            throw new ErreurMetier("Utilisateur non trouvé.", 404);
        }

        return utilisateurMisAJour;
    } catch (error) {
        throw error;
    }
};

export const modifierRoleService = async (id, nouveauRole) => {
    try {
        if (!ROLES_VALIDES.includes(nouveauRole)) {
            throw new ErreurMetier(
                `Rôle invalide. Valeurs acceptées : ${ROLES_VALIDES.join(", ")}.`,
                400
            );
        }

        const utilisateurMisAJour = await Utilisateur.findByIdAndUpdate(
            id,
            { $set: { role: nouveauRole } },
            { returnDocument: "after", runValidators: true }
        );

        if (!utilisateurMisAJour) {
            throw new ErreurMetier("Utilisateur non trouvé.", 404);
        }

        return utilisateurMisAJour;
    } catch (error) {
        throw error;
    }
};

export const desactiverUtilisateurService = async (id) => {
    try {
        const utilisateurDesactive = await Utilisateur.findByIdAndUpdate(
            id,
            { $set: { isActive: false, deletedAt: Date.now() } },
            { returnDocument: "after" }
        );

        if (!utilisateurDesactive) {
            throw new ErreurMetier("Utilisateur non trouvé.", 404);
        }

        return utilisateurDesactive;
    } catch (error) {
        throw error;
    }
};

export const reactiverUtilisateurService = async (id) => {
    try {
        const utilisateurReactiver = await Utilisateur.findByIdAndUpdate(
            id,
            { $set: { isActive: true, restoredAt: Date.now(), deletedAt: null } },
            { returnDocument: "after" }
        );

        if (!utilisateurReactiver) {
            throw new ErreurMetier("Utilisateur non trouvé.", 404);
        }

        return utilisateurReactiver;
    } catch (error) {
        throw error;
    }
};
