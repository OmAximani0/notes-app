import { NextFunction, Request, Response } from "express";
import { decodeJWT } from "../utils/jwt";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

type CustomResponse = {
    error?: string;
    message?: string;
    token?: string;
};

export function auth(req: Request, res: Response, next: NextFunction) {
    let response: CustomResponse = {};
    let token = req.get("Authorization");
    if (token === undefined) {
        response["error"] = "Authorization token not provided!";
        return res.status(400).json(response);
    }
    const tokenSplit = token?.split(" ");
    if (tokenSplit && tokenSplit[0] !== "Bearer") {
        response["error"] = "Invalid auth scheme";
        return res.status(400).json(response);
    }

    try {
        const decodedToken = decodeJWT(tokenSplit[1]);
        req.user = decodedToken;
        next();
    } catch (error: any) {
        if (
            error instanceof TokenExpiredError ||
            error instanceof JsonWebTokenError
        ) {
            response["error"] = error.message;
            return res.status(400).json(response);
        }
        response["error"] = error.message;
        return res.status(500).json(response);
    }
}
