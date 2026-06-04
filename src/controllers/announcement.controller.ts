import { Request, Response } from "express";

export class AnnouncementController {
    static getAnnouncements(
        req: Request,
        res: Response
    ): void {
        res.json([
            {
                id: 1,
                title: "Semester Registration",
                description:
                    "Registration opens next Monday"
            },
            {
                id: 2,
                title: "Exam Timetable Released",
                description:
                    "Check university portal"
            }
        ]);
    }
}