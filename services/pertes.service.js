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
            throw new ErreurMetier("La quantite ne peut pas etre superieur à 0.", 400);
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
        session.endSession();te = new P

        return perte;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const getPertesService = async () => {
    try {
        const pertes = await Perte.find().populate("produit", "nom").populate("utilisateur", "nom").populate("boutique", "nom");

        if(!pertes || pertes.length === 0) {
            throw new ErreurMetier("Aucune perte trouvée", 404);
        };

        return pertes;
    } catch (error) {
        throw error
    }
};

export const getPerteSevice = async (perteId) => {
    try {
        const perte = await Perte.findOne(perteId).populate("produit", "nom").populate("utilisateur", "nom").populate("boutique", "nom");

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
        const perte = await getPerteSevice(perteId);

        const existProduit = await getproduitService(perte.produit);

        const stock = await Stock.findOne({produit: perte.produit, boutique: perte.boutique});
        if(!stock) {
            throw new ErreurMetier("Stock introuvable.", 404);
        };

        stock.quantite += perte.quantite;

        perte.isActive = false;
        perte.deletedAt = new Date();

        await perte.save({session});

        await session.commitTransaction();
        session.endSession();

        return perte;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const deletePerteService = async (perteId) => {
    try {
        const perte = await getPerteSevice(perteId);

        const deletedPerte = await Perte.findByIdAndUpdate(
            perteId,
            {isActive: false, deletedAt: new Date()},
            {returnDocument: "after", runValidators: true}
        ); 

        return deletedPerte;
    } catch (error) {
        throw error;
    }
};