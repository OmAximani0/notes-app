import {
    JwtPayload,
    Secret,
    sign,
    verify,
    TokenExpiredError,
    JsonWebTokenError,
} from "jsonwebtoken";
import logger from "../utils/logger";

export function signJWT(payload: object) {
    if (!process.env.JWT_SECRET) {
        logger.error("JWT secret not found+!");
        process.exit(-1);
    }
    const token = sign(payload, process.env.JWT_SECRET as Secret, {
        expiresIn: "2d",
    });
    return token;
}

export function decodeJWT(token: string) {
    if (!process.env.JWT_SECRET) {
        logger.error("JWT secret not found!");
        process.exit(-1);
    }
    let payload: string | JwtPayload;
    try {
        payload = verify(token, process.env.JWT_SECRET as Secret);
    } catch (error: any) {
        if (error instanceof TokenExpiredError) {
            throw new TokenExpiredError(
                "Authentication token has expired!",
                error.expiredAt
            );
        }
        if (error instanceof JsonWebTokenError) {
            throw new JsonWebTokenError(
                "Invalid authentication token!",
                error.inner
            );
        } else {
            throw new Error("Unknown authentication error!");
        }
    }
    return payload;
}
