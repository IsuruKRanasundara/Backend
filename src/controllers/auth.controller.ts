import { Request, Response } from "express";

// Dummy token — a real backend would sign a JWT here
const DUMMY_TOKEN = "dummy-smart-campus-token-2026";

// Shared user fixture so login and register return consistent data
const DUMMY_USER = {
    id: "CS-2022-095",
    name: "Asel Wijesinghe",
    role: "student",
    email: "asel.w@campus.edu",
    faculty: "Faculty of Computing",
    degree: "3rd Year — BSc Software Engineering",
    studentId: "CS-2022-095",
    completedCredits: 90,
    totalCredits: 120,
};

export class AuthController {
    /**
     * POST /api/auth/login
     * Accepts any email + password — returns the dummy user + token.
     * The frontend stores token in localStorage under "token" and
     * "smart-campus-token", and sets "smart-campus-authenticated" = "true".
     */
    static login(req: Request, res: Response): void {
        const { email, password } = req.body as {
            email?: string;
            password?: string;
        };

        // Basic validation — still dummy, just mirrors what a real API does
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token: DUMMY_TOKEN,
            user: DUMMY_USER,
        });
    }

    /**
     * POST /api/auth/register
     * Accepts name, studentId, email, password — echoes back the new user + token.
     */
    static register(req: Request, res: Response): void {
        const { name, studentId, email, password } = req.body as {
            name?: string;
            studentId?: string;
            email?: string;
            password?: string;
        };

        if (!name || !email || !password) {
            res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
            return;
        }

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            token: DUMMY_TOKEN,
            user: {
                ...DUMMY_USER,
                name: name,
                email: email,
                studentId: studentId ?? DUMMY_USER.studentId,
                completedCredits: 0, // fresh account starts at 0
            },
        });
    }
}