import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { ObjectId } from "mongoose";
import { verifyJWT } from "../utils/jwt";

export const authenticateToken: RequestHandler = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null || !token) {
        return next(createHttpError(401, "Unauthorized access"));
    }

    // Validate Access Token
    const decoded = verifyJWT<{ userId: ObjectId }>(token);

    if (!decoded) {
        return next(createHttpError(401, "Invalid token or user doesn't exist"));
    }

    req.body.auth_user_id = decoded.userId;
    next();
};
