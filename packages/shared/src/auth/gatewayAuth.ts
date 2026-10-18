import type {Request,Response,NextFunction} from "express"
import { AppError } from "../errors/AppError";

export function requireGatewaySecret(
    _req : Request,
    res : Response,
    next : NextFunction
){
    const expected = process.env.GATEWAY_SECRET;
    if(!expected){
        return  next(new AppError(500,"Gateway sercet is not found."))
    }

    const incoming = _req.header("x-gateway-secret");
    if(!incoming || incoming!== expected){
        return next(new AppError(403,"Forbidden."))
    }

    next();
}