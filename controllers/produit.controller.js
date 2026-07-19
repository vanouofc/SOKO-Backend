import { creerProduitService, deleteProduitService, getproduitService, getProduitsService, updateProduitService } from "../services/produits.service.js";
import { buildPaginatedResponse } from "../utils/pagination.util.js";


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

        if(!nom || !boutique || !description || !type) {
            return res.status(400).json({
                success: false,
                message: "Informations du produit incomplète."
            });
        };

        const nouveauProduit = await creerProduitService({sku, nom, photo: photo || null, boutique, description, model, prixachat, type});

        return res.status(201).json({
            success: true,
            message: "Produit créée avec succès.",
            data: nouveauProduit,
        });
    } catch (error) {
        next(error);
    }
};

// Reçoit un fichier image (multipart/form-data, champ "photo"), le stocke
// sur le serveur et renvoie l'URL publique à utiliser pour créer/mettre à
// jour un produit. Séparé de createProduit/updateProduit pour que le front
// puisse uploader le fichier indépendamment (utile en offline-first : le
// fichier est choisi hors-ligne, uploadé seulement une fois la synchro
// possible).
export const uploadProduitPhoto = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Aucun fichier image reçu."
            });
        };

        const url = `/uploads/produits/${req.file.filename}`;

        return res.status(201).json({
            success: true,
            message: "Photo téléversée avec succès.",
            data: { url },
        });
    } catch (error) {
        next(error);
    }
};

export const getProduits = async (req, res, next) => {
    try {

        const isActive = req.query.statut !== "inactive";
        const {produits, total} = await getProduitsService({ isActive });
        const response = buildPaginatedResponse(produits, total, req.pagination);
        
        return res.status(200).json({
            success: true,
            message: "Produit(s) retourné(s).",
            ...response
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