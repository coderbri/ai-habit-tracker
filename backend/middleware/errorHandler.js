/**
 * Handles requests to routes that don't exist, returning the attempted
 * route so it's easy to see what the user was trying to access.
 */
export const notFound = (req, res, next) => {
    res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

/**
 * Catch-all error handler; keeps the existing status code if one was already
 * set (e.g. by a controller), otherwise defaults to 500.
 */
export const errorHandler = (err, req, res, next) => {
    console.error(err);
    const status = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(status).json({
        message: err.message || "Server error",
    });
};