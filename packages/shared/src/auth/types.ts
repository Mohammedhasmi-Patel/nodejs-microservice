
export type UserRole = "USER" | "ADMIN";

export type JwtPayload = {
    id : string;
    email : string;
    role : UserRole
}

export type User = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
};