import { Request, Response } from "express";
import { users } from "../data/store";

export class AuthController {
    // POST /api/auth/login
    static login(req: Request, res: Response): void {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
            return;
        }

        // Dummy credential check — any registered email + any password works
        const user = users.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
        );

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
            return;
        }

        // ⚠️  Password is NEVER returned to the client
        const { passwordHash: _omit, ...safeUser } = user;

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token: `dummy-token-${user.id}`,   // fake JWT placeholder
            expiresIn: 3600,
            user: safeUser
        });
    }

    // POST /api/auth/register
    static register(req: Request, res: Response): void {
        const { name, email, password, role = "student" } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({
                success: false,
                message: "Name, email, and password are required"
            });
            return;
        }

        // Check for duplicate email
        const exists = users.some(
            (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (exists) {
            res.status(409).json({
                success: false,
                message: "An account with this email already exists"
            });
            return;
        }

        const newUser = {
            id: `STU-${Date.now()}`,
            name,
            email,
            passwordHash: `hashed-${password}`, // never returned
            role: role as "student" | "lecturer" | "admin",
            faculty: "Unassigned",
            degree: "Unassigned",
            completedCredits: 0,
            totalCredits: 120,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);

        const { passwordHash: _omit, ...safeUser } = newUser;

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            token: `dummy-token-${newUser.id}`,
            user: safeUser
        });
    }

    // POST /api/auth/logout
    static logout(_req: Request, res: Response): void {
        // In a real app: invalidate the token server-side
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    }

    // GET /api/auth/me  — returns the current user (requires auth header)
    static me(req: Request, res: Response): void {
        // The auth middleware attaches userId to the request
        const userId = (req as any).userId as string | undefined;

        const user = users.find((u) => u.id === userId);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        const { passwordHash: _omit, ...safeUser } = user;
        res.status(200).json({ success: true, user: safeUser });
    }
}
