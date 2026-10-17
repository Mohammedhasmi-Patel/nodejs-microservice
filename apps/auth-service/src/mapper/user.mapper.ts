import { User } from "../types/auth.type";


export function toUserResponse(user : User){
    return {
        id : user?.id,
        name : user?.name,
        email : user?.email,
        role : user?.role,
        createdAt : user?.created_at
    }
}
