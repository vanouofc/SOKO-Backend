import { auth } from "../auth.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session) {
            return res.status(401).json({ message: "Non autorisé. Veuillez vous connecter." });
        }

        // On stocke l'utilisateur dans l'objet req pour l'utiliser dans les contrôleurs
        req.user = session.user;
        req.session = session.session;

        next();
    } catch (error) {
        next(error);
    }
};