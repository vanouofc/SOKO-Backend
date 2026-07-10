/**
 * Construit une réponse standardisée avec métadonnées de pagination.
 * @param {Array} data - Les documents retournés par le service.
 * @param {Number} total - Le nombre total de documents (sans pagination).
 * @param {Object} pagination - { page, limit } venant de req.pagination.
 * @returns {Object} - Objet prêt à être renvoyé dans un res.json().
 */
export const buildPaginatedResponse = (data, total, { page, limit }) => {
    const totalPages = Math.ceil(total / limit);

    return {
        data,
        pagination: {
            total,
            totalPages,
            currentPage: page,
            limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        }
    };
};