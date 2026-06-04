import { Request, Response } from "express";

export class FacilityController {
    static getFacilities(
        req: Request,
        res: Response
    ): void {
        res.json([
            {
                name: "Main Library",
                open: true
            },
            {
                name: "Computer Lab",
                open: false
            }
        ]);
    }
}