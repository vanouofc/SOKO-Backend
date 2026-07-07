import { approvisionnerStockService, creerStockService, deleteStockService, getStockService, getStocksService, removeQuantiteStockService, restoreStockService, updateStockService } from "../services/stocks.service.js";


export const creerStock = async (req, res, next) => {
    try {
        const {prix, quantite, minStockAlert, produit, boutique} = req.body;
        // const boutique = req.boutique.id;

        if(!produit || !boutique || prix == null || quantite == null || minStockAlert == null) {
            return res.status(400).json({
                success: false,
                message: "Vous n'avez pas renseigner l'ensemble des informations du stock."
            });
        };

        const nouveauStock = await creerStockService({prix, quantite, minStockAlert, produit, boutique});

        return res.status(201).json({
            success: true,
            message: `Stock créé.`,
            data: nouveauStock
        });
    } catch (error) {
        next(error)
    }
};

export const getStocks = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                succes: false,
                message: "Non authentifié."
            });
        };

        const stocks = await getStocksService();

        return res.status(200).json({
            success: true,
            message: `Stock(s) retourné(s).`,
            data: stocks
        });
    } catch (error) {
        next(error)
    }
};

export const getStock = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                succes: false,
                message: "Non authentifié."
            });
        };

        const {id} = req.params;

        if(!id) {
            return res.status(400).json({
                success: false,
                message: "La reference du stock est requise."
            });
        };

        const stock = await getStockService(id);

        return res.status(200).json({
            success: true,
            message: `Stock de ${stock.produit.nom} trouvé.`,
            data: stock
        });
    } catch (error) {
        next(error);
    }
};

export const deleteStock = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                succes: false,
                message: "Non authentifié."
            });
        };

        const {id} = req.params;

        if(!id) {
            return res.status(400).json({
                success: false,
                message: "La reference du stock est requise."
            });
        };

        const stock = await deleteStockService(id);

        return res.status(200).json({
            success: true,
            message: "Stock supprimé.",
            data: stock
        });
    } catch (error) {
        next(error);
    }
};

export const restoreStock = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                succes: false,
                message: "Non authentifié."
            });
        };

        const {id} = req.params;

        if(!id) {
            return res.status(400).json({
                success: false,
                message: "La reference du stock est requise."
            });
        };

        const stock = await restoreStockService(id);

        return res.status(200).json({
            success: true,
            message: "Stock restoré.",
            data: stock
        });
    } catch (error) {
        next(error);
    }
};

export const updateStock = async (req, res, next) => {
    try {
        const role = ["admin", "responsable"];
        if(!role.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Vous ne pouvez pas modifier ce stock."
            });
        };

        const {id} = req.params;
        if(!id) {
            return res.status(400).json({
                success: false,
                message: "Stock introuvable."
            });
        };

        // Revoir cette validation.
        const {prix, minStockAlert} = req.body;
        if(prix == null || minStockAlert == null) {
            return res.status(400).json({
                success: false,
                message: "Vous ne pouvez pas vider ces champs."
            });
        };

        const stock = await updateStockService(id, {prix, minStockAlert});

        return res.status(200).json({
            success: true,
            message: "Stock mis à jour.",
            data: stock
        });
    } catch (error) {
        next(error);
    }
};

export const approvisionnerStock = async (req, res, next) => {
    try {
        const role = ["admin", "responsable"];
        if(!role.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Vous ne pouvez pas modifier ce stock."
            });
        };

        const {id} = req.params;
        if(!id) {
            return res.status(400).json({
                success: false,
                message: "Stock introuvable."
            });
        };

        const {quantite} = req.body;
        if (quantite == null) {
            return res.status(400).json({
                success: false,
                message: "Veuiller renseigner une quantité valide."
            });
        };

        const stock = await approvisionnerStockService(id, quantite);

        return res.status(200).json({
            success: true,
            message: "Stock approvisionné.",
            data: stock
        });
    } catch (error) {
        next(error);
    }
};

export const removeQuantiteStock = async (req, res, next) => {
    try {
        const role = ["admin", "responsable"];
        if(!role.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Vous ne pouvez pas modifier ce stock."
            });
        };

        const {id} = req.params;
        if(!id) {
            return res.status(400).json({
                success: false,
                message: "Stock introuvable."
            });
        };

        const {quantite} = req.body;
        if (quantite == null) {
            return res.status(400).json({
                success: false,
                message: "Veuiller renseigner une quantité valide."
            });
        };

        const stock = await removeQuantiteStockService(id, quantite);

        return res.status(200).json({
            success: true,
            message: `Stock diminué de ${quantite}.`,
            data: stock
        });
    } catch (error) {
        next(error);
    }
};