import { creerProduitService, deleteProduitService, getproduitService, getProduitsService, updateProduitService } from "../services/produits.service.js";


export const createProduit = async (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(401).json({
                success: false,
                message: "Utilisateur non authentifié."
            });
        };

        const { nom, photo, boutique, description, type, prixachat, model } = req.body;
        const sku = "Prod - " + Date.now();

        if(!nom || !photo || !boutique || !description || !type) {
            return res.status(400).json({
                success: false,
                message: "Informations du produit incomplète."
            });
        };

        const nouveauProduit = await creerProduitService({sku, nom, photo, boutique, description, model, prixachat, type});

        return res.status(201).json({
            success: true,
            message: "Produit créée avec succès.",
            data: nouveauProduit,
        });
    } catch (error) {
        next(error);
    }
};

export const getProduits = async (req, res, next) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                succes: false,
                message: "Non authorisé."
            });
        };

        const produits = await getProduitsService();
        
        return res.status(200).json({
            success: true,
            message: "Produit(s) retourné(s).",
            data: produits,
        });

    } catch (error) {
        next(error);
    }
};

export const getProduit = async (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(401).json({
                success: false,
                message: "Non authentifié."
            });
        };

        const {id} = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Nous n'avons pas pu identifier le produit."
            });
        };

        const produit = await getproduitService(id);

        return res.status(200).json({
            success: true,
            message: "Produit trouvé:",
            data: produit,
        });

    } catch (error) {
        next(error);
    }
};

export const updateProduit = async (req, res, next) => {
    try {
        const role = ["admin", "responsable"];
        if(!role.includes(req.user.role)) {
            return res.status(401).json({
                success: false,
                message: "Non authorisé."
            });
        };

        const {id} = req.params;
        if(!id) {
            return res.status(400).json({
                success: false,
                message: "Produit introuvable."
            });
        };

        const {nom, photo, description, type, model, prixAchat} = req.body;
        // if (!nom || nom.trim() === "" || !prixAchat) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Vous ne puvez pas vider ces champs."
        //     });
        // };

        const updateProduit = await updateProduitService(id, {nom, photo, description, model, type, prixAchat});

        return res.status(200).json({
            success: true,
            message: "Produit mis à jour avec succès.",
            data: updateProduit
        });

    } catch (error) {
        next(error);
    }
};

export const deleteProduit = async (req,res, next) => {
    try {
        if(req.user.role !== "responsable" && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Non authorisé."
            });
        };

        const {id} = req.params;
        if(!id) {
            return res.status(400).json({
                success: false,
                message: "Produit introuvable.",
            });
        };

        const deletedProduit = await deleteProduitService(id);

        return res.status(200).json({
            success: true,
            message: "Produitt Supprimé.",
            data: deletedProduit
        });

    } catch (error) {
        next(error);
    }
};