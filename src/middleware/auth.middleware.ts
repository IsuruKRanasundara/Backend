import { Request, Response, NextFunction } from "express";

// ─── Simple token-based auth middleware ──────────────────────────────────────
// In production this would verify a real JWT. For this dummy backend it just
// checks that the Authorization header is present and strips the Bearer prefix
// so downstream handlers can read req.userId.

export interface AuthRequest extends Request {
    userId?: string;
}

export function requireAuth(
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            success: false,
            message: "Unauthorized: missing or invalid token"
        });
        return;
    }

    // Decode the fake token — format is just "dummy-token-<userId>"
    const token = authHeader.split(" ")[1];
    if (!token || !token.startsWith("dummy-token-")) {
        res.status(401).json({
            success: false,
            message: "Unauthorized: invalid token"
        });
        return;
    }

    req.userId = token.replace("dummy-token-", "");
    next();
}
