import { Request, Response } from "express";

export class CourseController {
    static getCourses(req: Request, res: Response): void {
        res.json([
            {
                code: "SENG41293",
                name: "Mobile Web Development",
                credits: 3
            },
            {
                code: "SENG41123",
                name: "Distributed Systems",
                credits: 4
            }
        ]);
    }
}