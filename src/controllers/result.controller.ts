import { Request, Response } from "express";

export class ResultController {
    static getResults(req: Request, res: Response): void {
        res.json([
            {
                course: "Mobile Web Development",
                grade: "A"
            },
            {
                course: "Database Systems",
                grade: "B+"
            }
        ]);
    }
}