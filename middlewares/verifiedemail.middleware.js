export const requireVerifiedEmail = (req, res, next) => {
    
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Non autorisé. Veuillez vous connecter."
        });
    }

    // 2. Vérification du statut de l'email
    if (!req.user.emailVerified) {
        return res.status(403).json({
            success: false,
            message: "Votre adresse email doit être vérifiée pour effectuer cette action."
        });
    }

    next();
};