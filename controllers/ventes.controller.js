import { annulerVenteService, creerVenteService, deleteVenteService, getVenteService, getVentesService } from "../services/ventes.service.js";


export const creerVente = async (req, res, next) => {
    try {
        const { boutique, items } = req.body;
        const utilisateur = req.user.id;

        if (!utilisateur) {
            return res.status(400).json({
                success: false,
                message: "Utilisateur non authentifié."
            });
        };

        if (!boutique || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Données incomplètes. La boutique et au moins un produit sont requis."
            });
        };

        // Generation du numero de facture unique base sur la date et l'heure actuelle.
        const dateLocale = new Date().toLocaleString('fr-FR', {
            timeZone: 'Africa/Douala',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        const numeroFacture = `VNT-${dateLocale.replace(/[^0-9]/g, '')}-${Date.now()}`;

        const nouvelleVente = await creerVenteService({
            numeroFacture,
            boutique,
            items,
            utilisateur
        });

        return res.status(201).json({
            success: true,
            message: "Vente enregistrée avec succès et stock mis à jour.",
            data: nouvelleVente
        });

    } catch (error) {
        next(error)
    }
};

export const getVentes = async (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(401).json({
                success: false,
                message: "Non authentifié."
            });
        };

        const ventes = await getVentesService();

        return res.status(200).json({
            success: true,
            message: "Ventes retournées.",
            data: ventes
        });
    } catch (error) {
        next(error);
    }
};

export const getVente = async (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(401).json({
                success: false,
                message: "Non authentifié."
            });
        };

        const {id} = req.params;
        if(!id) {
            return res.status(400).json({
                success: false,
                message: "Vente introuvable."
            });
        };

        const vente = await getVenteService(id);

        return res.status(200).json({
            success: true,
            message: "Vente trouvée.",
            data: vente
        });
    } catch (error) {
        next(error);
    }
};

export const annulerVente = async (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(401).json({
                success: false,
                message: "Non authentifié."
            });
        };

        const {id} = req.params;
        if(!id) {
            return res.status(400).json({
                success: false,
                message: "Vente introuvable."
            });
        };

        const venteAnnuler = await annulerVenteService(id);

        return res.status(200).json({
            success: true,
            message: "Vente annulée.",
            data: venteAnnuler
        });

    } catch (error) {
        next(error);
    }
};

export const deleteVente = async (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(401).json({
                success: false,
                message: "Non authentifié."
            });
        };

        const {id} = req.params;
        if(!id) {
            return res.status(400).json({
                success: false,
                message: "Vente introuvable."
            });
        };

        const deletedVente = await deleteVenteService(id);

        return res.status(200).json({
            success: true,
            message: "Vente supprimée.",
            data: deletedVente
        });

    } catch (error) {
        next(error);
    }
};