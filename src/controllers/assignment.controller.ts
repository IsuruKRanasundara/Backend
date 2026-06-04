import { Request, Response } from "express";

export class AssignmentController {
    static getAssignments(req: Request, res: Response): void {
        res.json([
            {
                id: 1,
                title: "React Assignment",
                dueDate: "2026-06-15",
                status: "Pending"
            },
            {
                id: 2,
                title: "Database Project",
                dueDate: "2026-06-10",
                status: "Completed"
            }
        ]);
    }
}