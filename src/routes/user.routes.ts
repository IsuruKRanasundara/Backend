import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/profile", UserController.getProfile);

export default userRouter;
