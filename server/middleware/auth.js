const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

/**
 * Middleware to verify JWT token from Authorization header
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader;

    try {
        const decoded = jwt.verify(token, jwtConfig.secret);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired.',
                expired: true
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};

module.exports = { verifyToken };
