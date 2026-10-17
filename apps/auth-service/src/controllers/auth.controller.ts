import type {Request,Response,NextFunction} from "express"
import * as authService from "../services/auth.service"
import { successResponse } from "shared";

export async function register(
    req : Request,
    res : Response,
    next : NextFunction
){
    try {
        const user = await authService.register(req.body);
        successResponse(res,{user},201);
    } catch (error) {
        console.log(`error ${error}`)
        next(error)
    }
}

export async function login(
    req : Request,
    res : Response,
    next : NextFunction
){
    try {
        const user = await authService.login(req.body);
        return successResponse(res,{user},200);
    } catch (error) {
        console.log(`err ${error}`)
        next(error)
    }
}