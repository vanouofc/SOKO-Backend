import mongoose from "mongoose";
import Produit from "../models/produits.model.js";
import { ErreurMetier } from "../errors/ErreurMetier.js";

export const creerProduitService = async (produitdata) => {
  try {
    const { sku, nom, photo, boutique, description, type, prixachat, model } = produitdata;

    if (!sku ||!nom ||!photo ||!boutique ||!description ||!type || !prixachat) {
      throw new ErreurMetier(
        "Toutes les informations du produit ne sont pas renseigner.",
        400,
      );
    };

    const existProduit = await Produit.findOne({nom: nom, boutique: boutique, model: model });
    if (existProduit) {
        throw new ErreurMetier("Ce produit existe déjà.", 409);
    };

    const nouveuProduit = new Produit({
        sku,
        nom,
        photo,
        boutique,
        description,
        type,
        model,
        prixAchat: prixachat
    });
    await nouveuProduit.save();

    return nouveuProduit;

  } catch (error) {
    throw error;
  }
};

export const getProduitsService = async ({skip, limit}) => {
    try {
        const [produits, total] = await Promise.all([
            Produit.find().sort({createdAt: -1}).skip(skip).limit(limit),
            Produit.countDocuments({ isActive: true })
        ]);
        if (total === 0 ) {
            throw new ErreurMetier("Aucun produit n'a été trouvé.", 404);
        };

        return {produits, total};

    } catch (error) {
        throw error;
    }
};

export const getproduitService = async (produitId) => {
    try {
        const produit = await Produit.findById(produitId);
        if (!produit) {
            throw new ErreurMetier("Produit introuvable.", 404);
        };

        return produit;

    } catch (error) {
        throw error;
    }
};

export const updateProduitService = async (produitId, produitData) => {
    try {
        const produit = await getproduitService(produitId);
        
        const updatedProduit = await Produit.findByIdAndUpdate(
            produitId, produitData, { returnDocument: "after", runValidators: true }
        );

        return updatedProduit;

    } catch (error) {
        throw error;
    }
};

export const deleteProduitService = async (produitId) => {
    try {
        const produit = await getproduitService(produitId);

        const deletedProduit = await Produit.findByIdAndUpdate(
            produitId, {isActive: false, deletedAt: Date.now()},
            {runValidators: true, returnDocument: "after"}
        );

        return deletedProduit;
    } catch (error) {
        throw error;
    }
};