import { getPool } from "shared";
import { User, UserRole } from "../types/auth.type";

export async function findByEmail(email: string): Promise<User | null> {
    const pool =  getPool();
    const result = await pool.query<User>(
      `SELECT id, name, email,password_hash, role,created_at
      FROM users WHERE email=$1`,[email]
    );
    return result.rows[0] ?? null;
}

export async function createUser(input: {
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
}): Promise<User> {
  const pool = getPool();
  const result = await pool.query<User>(
        `INSERT INTO users (name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email,password_hash, role,created_at`,
        [input.name, input.email, input.password_hash, input.role],
  );
  return result.rows[0];
}
