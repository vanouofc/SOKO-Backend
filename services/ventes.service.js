import mongoose from "mongoose";
import Vente from "../models/ventes.model.js";
import Stock from "../models/stocks.model.js";
import { ErreurMetier } from "../errors/ErreurMetier.js";
import { getproduitService } from "./produits.service.js";

/**
 * Crée une vente et déduit automatiquement les quantités du stock de la boutique
 * @param {Object} donnéesVente - { numeroFacture, boutique, items, utilisateur }
 */

export const creerVenteService = async (donnéesVente) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { boutique, items, numeroFacture, utilisateur } = donnéesVente;
        let montantTotal = 0;
        let itemsVente = [];
        
        for(const item of items) {

            if(item.quantite <= 0 || item.prixdeVente < 0) {
                throw new ErreurMetier("La quantite et/ou le prix doivent etre superieur a 0.", 400);
            };

            await getproduitService(item.produit);

            const stockProduit = await Stock.findOne({produit: item.produit, boutique: boutique}).session(session);
            if(!stockProduit) {
                throw new ErreurMetier("Le stock de ce produit n'existe pas.");
            };

            if(stockProduit.quantite < item.quantite) {
                throw new ErreurMetier("Stock insuffisant.", 400);
            };

            montantTotal += item.prixdeVente * item.quantite;

            stockProduit.quantite -= item.quantite;

            itemsVente.push({
              produit: item.produit,
              quantite: item.quantite,
              prixdeVente: item.prixdeVente,
            });

            await stockProduit.save({session});
        };

        const vente = new Vente({
            numeroFacture,
            boutique,
            items: itemsVente,
            montantTotal,
            utilisateur
        });
        await vente.save({session});

        await session.commitTransaction();
        session.endSession();

        return vente;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const getVentesService = async ({skip, limit}) => {
    try {
        const [ventes, total] = await Promise.all([
            Vente.find().sort({createdAt: -1}).skip(skip).limit(limit),
            Vente.countDocuments({ isActive: true })
        ]); 
        if(total === 0) {
            throw new ErreurMetier("Aucune vente enregistrée.", 404);
        };
        
        return {ventes, total};
    } catch (error) {
        throw error;
    }
};

export const getVenteService = async (venteId) => {
    try {
        const vente = await Vente.findById(venteId);
        if(!vente) {
            throw new ErreurMetier("Cette vente est introuvable.", 404);
        };

        return vente;
    } catch (error) {
        throw error;
    }
};

export const annulerVenteService = async (venteId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const vente = await getVenteService(venteId);

        for (const item of vente.items) {

            const stock = await Stock.findOne({produit: item.produit, boutique: vente.boutique}).session(session);

            if (!stock) {
                throw new ErreurMetier("Stock introuvable.", 404);
            };

            stock.quantite += item.quantite;

            await stock.save({ session });
        };

        vente.isActive = false;
        vente.deletedAt = new Date();

        await vente.save({session});

        await session.commitTransaction();
        session.endSession();

        return vente;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const deleteVenteService = async (venteId) => {
    try {
        await getVenteService(venteId);

        const deletedVente = await Vente.findByIdAndUpdate(
            venteId,
            {isActive: false, deletedAt: new Date()},
            {runValidators: true, returnDocument: "after"}
        );
        
        return deletedVente;
    } catch (error) {
        throw error;
    }
};