// Empêche l'injection NoSQL : supprime récursivement toute clé commençant par
// "$" ou contenant "." dans req.body, req.query et req.params, pour qu'un
// utilisateur ne puisse pas glisser un opérateur Mongo (ex: {"$ne": null})
// dans un champ censé être une simple chaîne (nom, email, etc.).
function sanitizeValue(value) {
    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }

    if (value !== null && typeof value === "object") {
        const cleaned = {};
        for (const [key, val] of Object.entries(value)) {
            if (key.startsWith("$") || key.includes(".")) {
                continue;
            }
            cleaned[key] = sanitizeValue(val);
        }
        return cleaned;
    }

    return value;
}

export const sanitizeMiddleware = (req, res, next) => {
    if (req.body) req.body = sanitizeValue(req.body);
    if (req.params) req.params = sanitizeValue(req.params);
    // req.query est une propriété en lecture seule sur Express 5 : on nettoie
    // ses clés en place plutôt que de la réassigner.
    if (req.query) {
        const cleanedQuery = sanitizeValue(req.query);
        for (const key of Object.keys(req.query)) delete req.query[key];
        Object.assign(req.query, cleanedQuery);
    }
    next();
};
