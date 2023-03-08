import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { ObjectId } from "mongoose";
import {signJWT, verifyJWT} from "../utils/jwt";


export const requiresAuth: RequestHandler = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        next(createHttpError(401, "User not authenticated"));
    }
};

export const authenticateToken: RequestHandler = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

    // Validate Access Token
    const decoded = verifyJWT<{userId: ObjectId}>(token);

    if (!decoded) {
        return next(createHttpError(401, "Invalid token or user doesn't exist"));
    }
    
    // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    //   console.log(err)
    //   if (err) return res.sendStatus(403)
    //   req.user = user
    //   next()
    // })
    // req.body.userId = decoded.userId
    req.body.t_user_id = decoded.userId
    next();
  }