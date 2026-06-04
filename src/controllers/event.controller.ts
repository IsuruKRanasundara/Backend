import { Request, Response } from "express";

export class EventController {
    static getEvents(req: Request, res: Response): void {
        res.json([
            {
                id: 1,
                name: "Hackathon 2026",
                date: "2026-07-15"
            },
            {
                id: 2,
                name: "Career Fair",
                date: "2026-08-01"
            }
        ]);
    }
}