import { Request, Response } from "express";

export class AuthController {
    static login(req: Request, res: Response): void {
        res.status(200).json({
            success: true,
            message: "Logged In",
            user: {
                id: 1,
                name: "John Doe",
                role: "CS-2022-095",
                email:"johndoe@gmail.com",
                password: "123456",
            }
        });
    }

    static register(req: Request, res: Response): void {
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: 1,
                name: "John Doe",
                role: "CS-2022-095",
                email:"johndoe@gmail.com",
                password: "123456",
            }
        });
    }
}