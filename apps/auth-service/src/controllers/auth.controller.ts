import type {Request,Response,NextFunction} from "express"
import * as authService from "../services/auth.service"
import { AppError, successResponse } from "shared";

export async function register(
    req : Request,
    res : Response,
    next : NextFunction
){
    try {
        const user = await authService.register(req.body);
        successResponse(res,{user},201);
    } catch (error) {
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
        return successResponse(res,user,200);
    } catch (error) {
        next(error)
    }
}

export async function me(
    req : Request,
    res : Response,
    next : NextFunction
){
    try {
        const userId = req.header('x-user-id');
        console.log(`userid id ${userId}`)
        if(!userId){
            throw new AppError(401,"Missing user id.");
        }
        const user = await authService.getMe(userId);
        return successResponse(res,{user},200)
    } catch (error) {
        next(error)
    }
}