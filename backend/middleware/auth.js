/**
 * @file: middleware/auth.js
 * @description: Middlwawre to protect routes by verifying 
 * JWTs provided in the Authorization header.
 */

import jwt from "jsonwebtoken";
import User from "../models/User.js"

/**
 * Verifies the JWT on an incoming request and attaches the corresponding 
 * user document to req.user before allowing the request to proceed.
 */
export const protect = async (req, res, next) => {
    try {
        // 1. Check if token is present in Authorization.
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            // Expect format and split the space
            token = req.headers.authorization.split(" ")[1];
        }
        // 2. If not token provided, send 401 response
        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }
        // 3. Verify token and if verification succeeds, check for existing user. if found, continue request
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ message: "User no longer exists" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Not authorized, token invalid" });
    }
};