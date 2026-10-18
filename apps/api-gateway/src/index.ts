import {config} from "dotenv"
import { resolve } from "node:path";
import express from "express"
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { AppError, errorHandler, httpLogger, logger, successResponse } from "shared";
import { createProxyMiddleware } from "http-proxy-middleware";


config({path:resolve(process.cwd(),".env")});
config({path : resolve(process.cwd(),'../../.env')});

const ROOT_PORT = process.env.ROOT_PORT || 3000;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

const app = express();

// secure default http headers 
app.use(helmet());
app.use(cors());
app.use(rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	standardHeaders: true, 
	legacyHeaders: false,
	ipv6Subnet: 56, 
}))
app.use(httpLogger);
app.use("/health",(req,res)=>{
    successResponse(res,{service:"API_GATEWAY"});
});


// create proxy starts 

// auth-service proxy 
app.use("/auth",  (req, res, next) => {
    console.log("🔥 API Gateway received request");
    console.log("Method:", req.method);
    console.log("URL:", req.originalUrl);
    next();
  },createProxyMiddleware({
    target : AUTH_SERVICE_URL,
    changeOrigin : true,
    pathRewrite : (path) => `/auth${path}`
}));

app.use((req,res,next)=>{
    next(new AppError(404,"Route not found."))
});

app.use(errorHandler);

app.listen(ROOT_PORT,()=>{
    logger.info(`API GATEWAY RUNNING ON ${ROOT_PORT}`);
    console.log(`port is running ${ROOT_PORT}`)
});