import { AppError } from "shared";
import { createUser, findByEmail,  } from "../repositories/auth.repo";
import { LoginInput, RegisterInput } from "../schemas/auth.schema";
import bcrypt from 'bcryptjs';
import { toLoginUserResponse, toUserResponse } from "../mapper/user.mapper";
import jwt from "jsonwebtoken"
import { generateToken } from "../utils/jwt";

export async function register(input : RegisterInput){
    const existingUser = await findByEmail(input.email);
    if(existingUser){
        throw new AppError(409,"Email already exists.")
    }

    const passwordHash = await bcrypt.hash(input.password,10);
    const user = await createUser({
        name : input.name,
        email:input.email,
        password_hash:passwordHash,
        role:"USER"
    });

    return toUserResponse(user);
}

export async function login(input : LoginInput){
    const existingUser = await findByEmail(input.email);
    
    if(!existingUser){
        throw new AppError(404,"Invalid credentials.")
    }

    const token = await generateToken(existingUser);
    return toLoginUserResponse(existingUser,token);
}