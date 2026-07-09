import { annulerPerteService, creerPerteService, deletePerteService, getPerteService, getPertesService } from "../services/pertes.service.js";


export const creerPerte = async (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(401).json({
              success: false,
              message: "Non authentifié.",
            });
        };

        const utilisateur = req.user.id;
        const {boutique, produit, quantite, raison, details} = req.body;

        if (!boutique || !produit || !raison || !details || quantite == null) {
            return res.status(400).json({
                success: false,
                message: "Toutes les informations sont requises."
            });
        };

        const perte = await creerPerteService({boutique, produit, raison, details, quantite, utilisateur});

        return res.status(201).json({
            success: true,
            message: "Perte ajoutée.",
            data: perte
        });
    } catch (error) {
        next(error);
    }
};

export const getPertes = async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Non authentifié.",
        });
      };

      const pertes = await getPertesService();

      return res.status(200).json({
        success: true,
        message: "Perte(s) trouvée(s).",
        total: pertes.length,
        data: pertes
      });

    } catch (error) {
      next(error);
    }
};

export const getPerte = async (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(401).json({
                success: false,
                message: "Non authentifié."
            });
        };

        const {id} = req.params;
        if(!id) {
            return res.status(404).json({
                success: false,
                message: "Perte introuvable."
            });
        };

        const perte = await getPerteService(id);

        return res.status(200).json({
          success: true,
          message: "Perte annulée.",
          data: perte,
        });
    } catch (error) {
        next(error);
    }
};

export const annulerPerte = async (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(401).json({
                success: false,
                message: "Non authentifié."
            });
        };

        const {id} = req.params;
        if(!id) {
            return res.status(404).json({
                success: false,
                message: "Perte introuvable."
            });
        };

        const perte = await annulerPerteService(id);

        return res.status(200).json({
            success: true,
            message: "Perte annulée",
            data: perte
        });

    } catch (error) {
        next(error);
    }
};

export const deletePerte = async (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(401).json({
                success: false,
                message: "Non authentifié."
            });
        };

        const {id} = req.params;
        if(!id) {
            return res.status(404).json({
                success: false,
                message: "Perte introuvable."
            });
        };

        const deletePerte = await deletePerteService(id);

        return res.status(200).json({
          success: true,
          message: "Perte supprimée.",
          data: deletePerte,
        });
    } catch (error) {
        next(error);
    }
};