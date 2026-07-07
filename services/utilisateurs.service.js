import Utilisateur from "../models/utilisateurs.model.js";
import { ErreurMetier } from "../errors/ErreurMetier.js";

const ROLES_VALIDES = ["secretaire", "responsable"];
// Champs qu'un utilisateur peut modifier lui-même sur son propre profil.
// password et email sont EXCLUS volontairement : ils restent gérés par Better-Auth.
const CHAMPS_PROFIL_AUTORISES = ["nom", "prenom", "phone", "photo"];

export const listerUtilisateursService = async () => {
    return await Utilisateur.find();
};

export const getUtilisateurService = async (id) => {
    const utilisateur = await Utilisateur.findById(id);
    if (!utilisateur) {
        throw new ErreurMetier("Utilisateur non trouvé.", 404);
    }
    return utilisateur;
};

export const modifierProfilService = async (id, nouvellesdonnees) => {
    // On ne garde que les champs autorisés, pour empêcher un utilisateur
    // d'injecter role/isActive/password/email dans sa propre requête.
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
};

export const modifierRoleService = async (id, nouveauRole) => {
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
};

export const desactiverUtilisateurService = async (id) => {
    const utilisateurDesactive = await Utilisateur.findByIdAndUpdate(
        id,
        { $set: { isActive: false, deletedAt: Date.now() } },
        { returnDocument: "after" }
    );

    if (!utilisateurDesactive) {
        throw new ErreurMetier("Utilisateur non trouvé.", 404);
    }

    return utilisateurDesactive;
};