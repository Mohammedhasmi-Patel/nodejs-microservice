import type { Request, Response, NextFunction } from "express";
import { AppError, verifyToken } from "shared";
import { getAllowedRoles, isPublicRoute } from "../rbac";

const IDENITYHEADERS = [
  "x-user-id",
  "x-user-role",
  "x-gateway-secret",
] as const;

// not trust any header from the client.
function striptIdentityHeaders(req: Request) {
  for (const header of IDENITYHEADERS) {
    delete req.headers[header];
  }
}

// attach gateway secret
function attachGatewaySecret(req: Request) {
  const secret = process.env.GATEWAY_SECRET;
  if (!secret) {
    throw new AppError(500, "GATEWAY secret is not define.");
  }

  req.headers["x-gateway-secret"] = secret;
}

function requestPath(req: Request) {
  const combined = `${req.baseUrl}${req.path}`;

  if (combined.length > 1 && combined.endsWith("/")) {
    return combined.slice(0, 1);
  }

  return combined || "/";
}

// attach the user to the headers

function attachHeaders(req: Request, userId: string, userRole: string) {
  req.headers["x-user-id"] = userId;
  req.headers["x-user-role"] = userRole;
}

// main middleware
// run on every auth request before the proxy forward to auth service
export function gatewayAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // stripe or remove identity headers
    striptIdentityHeaders(req);
    attachGatewaySecret(req);
    const path = requestPath(req);

    // if this path is public or private
    if (isPublicRoute(req.method, path)) {
      return next();
    }

    const authHeader = req.header("authorization");
    if (!authHeader?.startsWith("Bearer")) {
      throw new AppError(401, "Missing bearer token.");
    }

    const token = authHeader?.split(" ")[1];
    const payload = verifyToken(token);

    // RBAC -> check whether the current user has permission to access such route or not
    console.log(`at 69 line number the path is ${path}`)
    const allowedRoles = getAllowedRoles(req.method, path);
    console.log(`allowedRoles is ${allowedRoles}`)

    if (!allowedRoles) {
      throw new AppError(404, "Route not found.");
    }

    if (!allowedRoles?.includes(payload.role)) {
      throw new AppError(401, "Unauthorized.");
    }

    attachHeaders(req, payload.id, payload.role);
    next();
  } catch (error) {
    if(error instanceof AppError){
        return next(error);
    }

    return next(new AppError(401,"Invalid or expired token."))
  }
}
