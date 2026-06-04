import { Request, Response } from "express";

export class UserController {
    static getProfile(req: Request, res: Response): void {
        res.json({
            id: 1,
            name: "John Doe",
            faculty: "Science",
            degree: "Software Engineering",
            completedCredits: 90,
            totalCredits: 120
        });
    }
}