import jwt, { SignOptions } from "jsonwebtoken";
import env from "../utils/validateEnv";

export const signJWT = (payload: object, options: SignOptions = {}) => {
    const privateKey = env.ACCESS_TOKEN_SECRET;
    return jwt.sign(payload, privateKey, {
        ...(options && options)
    });
};

export const verifyJWT = <T>(token: string): T | null => {
    try {
        const publicKey = env.ACCESS_TOKEN_SECRET;
        return jwt.verify(token, publicKey) as T;
    } catch (error) {
        return null;
    }
};
