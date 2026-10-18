
import jwt from "jsonwebtoken"
import { JwtPayload, User } from "./types";
import { AppError } from "../errors/AppError";

export async function generateToken(user : User) {
    const userPayload = {
        id : user.id,
        email : user.email,
        role : user.role
    }

    const authToken = await jwt.sign(
        userPayload,
        process.env.JWT_SECRET!,
        {expiresIn : '7d'}
    );

    return authToken
} 


export function verifyToken(token : string) : JwtPayload {
    const decode = jwt.verify(token,process.env.JWT_SECRET as string);
    if(typeof decode !== "object" || typeof decode.id !== "string" || typeof decode == null || (decode.role !== "USER" && decode.role !== "ADMIN")){
        throw new AppError(401,"Unauthorized token.")
    }

    return {
        id : decode.id,
        email : decode.email,
        role : decode.role
    }
}