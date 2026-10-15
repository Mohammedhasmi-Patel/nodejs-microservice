import { Pool } from "pg";


let pool : Pool | null = null;

export function getPool() : Pool{

    const connectionString = process.env.DATABASE_URL;
     if(!connectionString){
        throw new Error("Database url required.")
     }
     pool = new Pool({connectionString : connectionString});
     return pool;
}

export async function closePool() : Promise<void>{
    if(pool){
        await pool.end();
        pool = null;
    }
}