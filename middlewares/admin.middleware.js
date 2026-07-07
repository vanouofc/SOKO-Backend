export const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Non autorisé. Veuillez vous connecter."
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Vous n'êtes pas autorisé à effectuer cette opération."
        });
    }

    next();
};