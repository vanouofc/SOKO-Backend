import mongoose from "mongoose";
import { Boutique } from "../models/boutique.model.js";
import { ErreurMetier } from "../errors/ErreurMetier.js";

/**
 * Crée une nouvelle boutique
 * @param {Object} donneesBoutique - {nom, adresse, contact, localisation, responsable }
 */
export const creerBoutiqueService = async (donneesBoutique) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { nom, adresse, contact, responsable } = donneesBoutique;

        const existBoutique = await Boutique.findOne({ nom: nom, adresse: adresse }).session(session);
        if (existBoutique) {
            throw new ErreurMetier(`La boutique avec le nom "${nom}" existe déjà à cette adresse.`, 409);
        };

        const nouvelleBoutique = new Boutique({
            nom,
            adresse,
            contact,
            responsables: [responsable]
        });
        await nouvelleBoutique.save({ session });
        await session.commitTransaction();
        session.endSession();

        return nouvelleBoutique;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

/**
 * Recuperer toutes les boutiques.
 */
export const getBoutiquesService = async () => {
    try {

        const boutiques = await Boutique.find();
        if (!boutiques || boutiques.length === 0) {
            throw new ErreurMetier("Aucune boutique n'a été trouvée.", 404);
        };

        return boutiques;

    } catch (error) {
        throw error;
    }
};


/**
 * Recuperer une boutique.
 * @param id 
 */
export const getBoutiqueService = async (id) => {
    try {
        const boutique = await Boutique.findById(id);
        if (!boutique) {
            throw new ErreurMetier("Boutique non trouvée.", 404);
        };

        return boutique;

    } catch (error) {
        throw error;
    }
};

/**
 * Modifier une boutique.
 * @param {String} id - Identifiant de la boutique
 * @param {Object} nouvellesdonnees - Les nouveaux champs à modifier ({nom, adresse, contact, localisation})
 * @returns {Object} La boutique mise à jour
 */
export const updateBoutiqueService = async (id, nouvellesdonnees) => {
    try {

        const nouvelleBoutique = await Boutique.findByIdAndUpdate(
            id,
            nouvellesdonnees,
            { returnDocument: "after", runValidators: true }
        );

        if (!nouvelleBoutique) {
            throw new ErreurMetier("Boutique non trouvée.", 404);
        }

        return nouvelleBoutique;
    } catch (error) {
        throw error;
    }
};

export const deleteBoutiqueService = async (id) => {
    try {

        const boutiqueSupprimee = await Boutique.findByIdAndUpdate(
            id,
            { isActive: false, deletedAt: Date.now() },
            { returnDocument: "after" }
        );

        if (!boutiqueSupprimee) {
            throw new ErreurMetier("Boutique non trouvée.", 404);
        };

        return boutiqueSupprimee;

    } catch (error) {
        throw error;
    }
};

export const restoreBoutiqueService = async (id) => {
    try {

        const boutiquerestoree = await Boutique.findByIdAndUpdate(
            id,
            { isActive: true, restoredAt: Date.now() },
            { returnDocument: "after" }
        );

        if (!boutiquerestoree) {
            throw new ErreurMetier('Boutique non trouvée.', 404);
        };

        return boutiquerestoree;

    } catch (error) {
        throw error;
    }
};

export const ajouterResponsableService = async (id, utilisateurId) => {
    const boutique = await Boutique.findById(id);
    if (!boutique) return null;

    const dejaResponsable = boutique.responsables.some(
        r => r.toString() === utilisateurId.toString()
    );
    if (dejaResponsable) {
        throw new ErreurMetier("Cet utilisateur est déjà responsable de cette boutique.", 409);
    };

    boutique.responsables.push(utilisateurId);
    return await boutique.save();
};

export const retirerResponsableService = async (id, utilisateurId) => {
    const boutique = await Boutique.findById(id);
    if (!boutique) return null;

    if (boutique.responsables.length <= 1) {
        throw new ErreurMetier("Impossible de retirer le dernier responsable de la boutique.", 206);
    };

    boutique.responsables = boutique.responsables.filter(
        r => r.toString() !== utilisateurId.toString()
    );
    return await boutique.save();
};