import { Request, Response } from "express";

export class TimetableController {
    static getTodaySchedule(req: Request, res: Response): void {
        res.json([
            {
                course: "Mobile Web Development",
                time: "08:00 AM - 10:00 AM",
                hall: "Lab 01"
            },
            {
                course: "Distributed Systems",
                time: "11:00 AM - 01:00 PM",
                hall: "A101"
            }
        ]);
    }
}