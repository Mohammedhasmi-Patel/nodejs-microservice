import { AppError } from "shared";
import { createUser, findByEmail, findById,  } from "../repositories/auth.repo";
import { LoginInput, RegisterInput } from "../schemas/auth.schema";
import bcrypt from 'bcryptjs';
import {  toUserResponse } from "../mapper/user.mapper";
import { generateToken } from "../utils/jwt";
import { User } from "../types/auth.type";
 
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
    const existingUser : User | null = await findByEmail(input.email);
    
    if(!existingUser){
        throw new AppError(401,"Invalid credentials.");
    }

    const isPasswordMatch = await bcrypt.compare(input.password,existingUser.password_hash);
    if(!isPasswordMatch){
        throw new AppError(401,"Invalid credentials.");
    }

    const token = await generateToken(existingUser);
    return {
        token,
        user : toUserResponse(existingUser)
    }
}


export async function getMe(userId : string){
    const existingUser : User | null = await findById(userId);
    if(!existingUser){
        throw new AppError(404,"user not found");
    }
    return toUserResponse(existingUser!);
}

