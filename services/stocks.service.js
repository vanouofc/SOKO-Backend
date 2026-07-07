import mongoose from "mongoose";
import Stock from "../models/stocks.model.js";
import { ErreurMetier } from "../errors/ErreurMetier.js";


export const creerStockService = async (stockData) => {
    try {
        const {produit, boutique, quantite, prix, minStockAlert} = stockData;
        if(!produit || !boutique || quantite == null || prix == null || minStockAlert == null) {
            throw new ErreurMetier("Tous les champs sont requis.", 400);
        };

        const existStock = await Stock.findOne({produit: produit, boutique: boutique});
        if(existStock) {
            throw new ErreurMetier("Ce stock existe déjà.", 409);
        };

        const nouveauStock = await new Stock({produit, boutique, quantite, prix, minStockAlert});
        await nouveauStock.save();

        return nouveauStock;

    } catch (error) {
        throw error;
    }
};

export const getStocksService = async () => {
    try {
        const stocks = await Stock.find().populate('produit', 'nom').populate('boutique', 'nom');

        if(!stocks || stocks.length ===0) {
            throw new ErreurMetier("Aucun stock disponible.", 404);
        };

        return stocks;

    } catch (error) {
        throw error;
    }
};

export const getStockService = async (stockId) => {
    try {
        const stock = await Stock.findById(stockId).populate('produit', 'nom').populate('boutique', 'nom');

        if(!stock) {
            throw new ErreurMetier("Stock introuvable.", 404);
        };

        return stock;

    } catch (error) {
        throw error;
    }
};

export const updateStockService = async (stockId, data) => {
    try {
        const {prix, minStockAlert} = data;

        const stock = await getStockService(stockId);

        const updatedStock = await Stock.findByIdAndUpdate(
            stockId, data, {returnDocument: "after", runValidators: true},
        );

        return updatedStock;

    } catch (error) {
        throw error;
    }
};

export const deleteStockService = async (stockId) => {
    try {
        const stock = await getStockService(stockId);

        if(!stock.isActive) {
            throw new ErreurMetier("Operation Impossible.", 400)
        };

        const deletedStock = await Stock.findByIdAndUpdate(
            stockId,
            {isActive: false, deletedAt: new Date()}, 
            {returnDocument: "after", runValidators: true}
        );

        return deletedStock;

    } catch (error) {
        throw error;
    }
};

export const restoreStockService = async (stockId) => {
    try {
        const restoredStock = await Stock.findByIdAndUpdate(
          stockId,
          { isActive: true, restoredAt: new Date() },
          { returnDocument: "after", runValidators: true },
        );

        return restoredStock;
    } catch (error) {
        throw error
    }
};

export const approvisionnerStockService = async (stockId, quantite) => {
    try {
        const stock = await getStockService(stockId);

        stock.quantite += quantite;

        await stock.save();

        return stock;
    } catch (error) {
        throw error;
    }
};

export const removeQuantiteStockService = async (stockId, quantite) => {
    try {
        const stock = await getStockService(stockId);

        if(stock.quantite < quantite) {
            throw new ErreurMetier("Stock insuffisant.", 400);
        };

        stock.quantite -= quantite;

        await stock.save();

        return stock;
    } catch (error) {
        throw error;
    }
};