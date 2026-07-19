import mongoose from "mongoose";
import Perte from "../models/pertes.model.js";
import { getproduitService } from "./produits.service.js";
import { ErreurMetier } from "../errors/ErreurMetier.js";
import Stock from "../models/stocks.model.js";

export const creerPerteService = async (perteData) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { boutique, produit, quantite, raison, details, utilisateur } = perteData;
        let montantPerte = 0;

        if(quantite <= 0) {
            throw new ErreurMetier("La quantite doit etre superieur a 0.", 400);
        };
        
        const existProduit = await getproduitService(produit);

        const stock = await Stock.findOne({produit: produit, boutique: boutique}).session(session);
        if(!stock) {
            throw new ErreurMetier("Stock introuvable.", 404);
        };

        if(stock.quantite < quantite) {
            throw new ErreurMetier("Stock insuffisant.", 400);
        };

        montantPerte = existProduit.prixAchat * quantite;

        stock.quantite -= quantite;

        await stock.save({session});

        const perte = new Perte({
            boutique,
            produit,
            quantite,
            raison,
            details,
            utilisateur,
            montantPerte
        });

        await perte.save({session});

        await session.commitTransaction();
        session.endSession();

        const perteReturned = await Perte.findById(perte._id).populate('boutique', 'nom').populate('produit', 'nom').populate('utilisateur', 'nom prenom');

        return perteReturned;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const getPertesService = async ({skip, limit}) => {
    try {
        const [pertes, total] = await Promise.all([
            Perte.find().populate('produit', 'nom').populate('utilisateur', 'nom prenom').populate('boutique', 'nom').skip(skip).limit(limit), 
            Perte.countDocuments({ isActive: true })
        ]);

        if(total === 0) {
            throw new ErreurMetier("Aucune perte trouvée", 404);
        };

        return {pertes, total};
    } catch (error) {
        throw error
    }
};

export const getPerteService = async (perteId) => {
    try {
        const perte = await Perte.findById(perteId).populate("produit", "nom").populate("utilisateur", "nom").populate("boutique", "nom");

        if(!perte) {
            throw new ErreurMetier("Perte introuvable.", 404);
        };

        return perte;
    } catch (error) {
        throw error;
    }
};

export const annulerPerteService = async (perteId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const perte = await getPerteService(perteId);

        const existProduit = await getproduitService(perte.produit._id);

        const stock = await Stock.findOne({produit: perte.produit._id, boutique: perte.boutique._id}).session(session);
        if(!stock) {
            throw new ErreurMetier("Stock introuvable.", 404);
        };

        stock.quantite += perte.quantite;
        await stock.save({session});

        perte.isActive = false;
        perte.deletedAt = new Date();

        await perte.save({session});

        await session.commitTransaction();
        await session.endSession();

        const perteReturned = await Perte.findById(perte._id).populate("produit", "nom").populate("utilisateur", "nom").populate("boutique", "nom");

        return perteReturned;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};

export const deletePerteService = async (perteId) => {
    try {
        const perte = await getPerteService(perteId);

        const deletedPerte = await Perte.findByIdAndUpdate(
            perteId,
            {isActive: false, deletedAt: new Date()},
            {returnDocument: "after", runValidators: true}
        ).populate("produit", "nom").populate("utilisateur", "nom").populate("boutique", "nom");

        return deletedPerte;
    } catch (error) {
        throw error;
    }
};