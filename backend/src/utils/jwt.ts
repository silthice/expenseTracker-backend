import jwt, {SignOptions} from 'jsonwebtoken'
import env from "../utils/validateEnv";

// export const signJWT = (payload: Object, options: SignOptions = {}) => {
// export const signJWT = (payload: Object, options: SignOptions = {}) => {
export const signJWT = (payload: object, options: SignOptions = {}) => {
    // const privateKey = Buffer.from(env.ACCESS_TOKEN_PRIVATE_KEY, 'base64').toString("ascii")
    // const privateKey = Buffer.from(env.ACCESS_TOKEN_SECRET, 'base64').toString("ascii")
    const privateKey = env.ACCESS_TOKEN_SECRET
    return jwt.sign(payload, privateKey, {
        ...(options && options)
    })
}

export const verifyJWT = <T>(token: string): T | null => {

    try {
        // const publicKey = Buffer.from(env.ACCESS_TOKEN_PUBLIC_KEY, 'base64').toString("ascii")
        // const publicKey = Buffer.from(env.ACCESS_TOKEN_SECRET, 'base64').toString("ascii")
        const publicKey = env.ACCESS_TOKEN_SECRET
        return jwt.verify(token, publicKey) as T
    } catch (error) {
        return null
    }
}