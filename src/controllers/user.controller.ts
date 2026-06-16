import { Request, Response } from "express";
import { users } from "../data/store";
import { AuthRequest } from "../middleware/auth.middleware";

export class UserController {
    // GET /api/users/profile  — current user's profile
    static getProfile(req: AuthRequest, res: Response): void {
        const user = users.find((u) => u.id === req.userId);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        const { passwordHash: _omit, ...safeUser } = user;
        res.json({ success: true, data: safeUser });
    }

    // PATCH /api/users/profile  — update current user's profile fields
    static updateProfile(req: AuthRequest, res: Response): void {
        const user = users.find((u) => u.id === req.userId);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        // Only allow safe fields to be updated
        const allowedFields: Array<keyof typeof user> = [
            "name",
            "faculty",
            "degree",
            "avatar"
        ];

        let updated = false;
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                (user as any)[field] = req.body[field];
                updated = true;
            }
        }

        if (!updated) {
            res.status(400).json({
                success: false,
                message: "No valid fields provided for update"
            });
            return;
        }

        const { passwordHash: _omit, ...safeUser } = user;
        res.json({
            success: true,
            message: "Profile updated successfully",
            data: safeUser
        });
    }

    // GET /api/users/:id  — get any user by ID (e.g. view classmate profile)
    static getUserById(req: Request, res: Response): void {
        const user = users.find((u) => u.id === req.params.id);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        const { passwordHash: _omit, ...safeUser } = user;
        res.json({ success: true, data: safeUser });
    }

    // GET /api/users  — list all users (admin use-case)
    static getUsers(_req: Request, res: Response): void {
        const safeUsers = users.map(({ passwordHash: _omit, ...u }) => u);
        res.json({ success: true, count: safeUsers.length, data: safeUsers });
    }
}
