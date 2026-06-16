import { Request, Response } from "express";

export class UserController {
    /**
     * GET /api/users/profile
     * Returns the student profile consumed by Dashboard and Profile pages.
     * Shape must match ApiProfile in the frontend (id, name, faculty, degree,
     * completedCredits, totalCredits).
     */
    static getProfile(_req: Request, res: Response): void {
        res.json({
            id: 1,                              // numeric id used as fallback studentId
            name: "Asel Wijesinghe",
            faculty: "Faculty of Computing",
            degree: "3rd Year — BSc Software Engineering",
            completedCredits: 90,
            totalCredits: 120,
            gpa: 3.72,
            email: "asel.w@campus.edu",
            studentId: "CS-2022-095",
            phone: "+94 77 123 4567",
            address: "Colombo, Sri Lanka",
            enrolledYear: 2022,
            expectedGraduation: 2026,
        });
    }

    /**
     * PUT /api/users/profile
     * Accepts partial profile updates — echoes them back (dummy: no DB).
     */
    static updateProfile(req: Request, res: Response): void {
        const updates = req.body as Record<string, unknown>;

        res.json({
            success: true,
            message: "Profile updated successfully",
            profile: {
                id: 1,
                name: (updates.name as string) ?? "Asel Wijesinghe",
                faculty: "Faculty of Computing",
                degree: "3rd Year — BSc Software Engineering",
                completedCredits: 90,
                totalCredits: 120,
                ...updates,
            },
        });
    }
}