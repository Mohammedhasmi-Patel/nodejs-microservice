
import {Request,Response} from "express"
import { success } from "zod";


export function successResponse(
    res : Response,
    data : unknown,
    statusCode : 200
){
    return res.status(statusCode).json({
        success : true,
        data
    });
}

export function failResponse(
    res : Response,
    message : string,
    statusCode : 200
){
    return res.status(statusCode).json({
        success : false,
        message : message
    });
}