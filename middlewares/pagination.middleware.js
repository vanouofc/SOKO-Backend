

export const paginationMiddleware = (defaultLimit = 20, maxLimit = 100) => {
    return (req, res, next) => {
        let page = parseInt(req.query.page, 10);
        let limit = parseInt(req.query.limit, 10);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = defaultLimit;
        if (limit > maxLimit) limit = maxLimit;

        const skip = (page - 1) * limit;

        req.pagination = { page, limit, skip };
        next();
    };
};