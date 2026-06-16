import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";
import { requireAuth } from "../middleware/auth.middleware";

const notificationRouter = Router();

notificationRouter.get("/", requireAuth, NotificationController.getNotifications);
notificationRouter.post("/", NotificationController.createNotification);
notificationRouter.patch("/read-all", requireAuth, NotificationController.markAllAsRead);
notificationRouter.patch("/:id/read", requireAuth, NotificationController.markAsRead);
notificationRouter.delete("/:id", requireAuth, NotificationController.deleteNotification);

export default notificationRouter;
