import { Request, Response } from "express";

export class NotificationController {
    static getNotifications(
        req: Request,
        res: Response
    ): void {
        res.json([
            {
                id: 1,
                message:
                    "React Assignment deadline tomorrow"
            },
            {
                id: 2,
                message:
                    "Distributed Systems quiz starts at 2 PM"
            }
        ]);
    }
}