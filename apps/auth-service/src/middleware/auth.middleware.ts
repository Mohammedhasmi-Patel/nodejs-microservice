// import { NextFunction,Request,Response } from "express";
// import { AppError } from "shared";
// import jwt from "jsonwebtoken"


// export function authMiddleware(req : Request,res:Response,next:NextFunction){
//     const authHeader = req.headers[''];
//     const token = authHeader && authHeader.split(' ')[1];

//     if(!token){
//         next(new AppError(401,"Unauthorized."))
//     }

//     try {
//         const secretKey = process.env.JWT_SECRET;
//         const decode = jwt.verify(token as string,secretKey as string);

//         if(!decode){
//             next(new AppError(401,"Unauthorized."))
//         }

//         req.user = decode;
//         next();

//     } catch (error) {
//         next(new AppError(401,"Unauthorized."))
//     }
// }