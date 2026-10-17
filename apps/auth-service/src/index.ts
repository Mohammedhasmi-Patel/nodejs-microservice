
import {config} from "dotenv"
import { resolve } from "node:path"
import express from "express"
import {AppError, errorHandler, httpLogger, successResponse} from "shared"
import authRoutes from "./routes/auth.route"

config({path : resolve(process.cwd(),'.env')});
config({path : resolve(process.cwd(),'../../.env')});

const PORT = process.env.AUTH_PORT || 8080;

const app = express();
app.use(httpLogger);
app.use(express.json());


app.get("/",(req,res)=>{
    res.status(201).json({success : true})
})
app.get("/health",(_req,res)=>{
    successResponse(res,{service:"authservcie"})
});

app.use("/auth",authRoutes);
app.use((_req,res,next)=>{
    next(new AppError(404,"route not found."))
});

app.use(errorHandler);
app.listen(PORT,()=>{
    console.log(`auth-service running on ${PORT}`)
});