import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";

const notificationRouter = Router();

notificationRouter.get("/", NotificationController.getNotifications);

export default notificationRouter;
