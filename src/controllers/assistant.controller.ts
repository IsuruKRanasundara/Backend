import { Request, Response } from "express";

export class AssistantController {
    static ask(req: Request, res: Response): void {
        const { question } = req.body;

        res.json({
            question,
            answer:
                "The Mobile Web Development lecture starts at 8.00 AM."
        });
    }
}