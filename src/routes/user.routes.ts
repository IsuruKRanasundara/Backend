import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.get("/", UserController.getUsers);
userRouter.get("/profile", requireAuth, UserController.getProfile);
userRouter.patch("/profile", requireAuth, UserController.updateProfile);
userRouter.get("/:id", UserController.getUserById);

export default userRouter;
