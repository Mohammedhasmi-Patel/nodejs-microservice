import { User } from "../types/auth.type";
import jwt from "jsonwebtoken"

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