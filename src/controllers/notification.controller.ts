import { Request, Response } from "express";
import { notifications, nextId } from "../data/store";
import { AuthRequest } from "../middleware/auth.middleware";

export class NotificationController {
    // GET /api/notifications  — user's notifications; ?read=false for unread only
    static getNotifications(req: AuthRequest, res: Response): void {
        const userId = req.userId ?? "CS-2022-095";
        const { read, type } = req.query;

        let result = notifications.filter((n) => n.userId === userId);

        if (read !== undefined) {
            result = result.filter((n) => n.read === (read === "true"));
        }
        if (type) {
            result = result.filter((n) => n.type === type);
        }

        // Most recent first
        result.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const unreadCount = notifications.filter(
            (n) => n.userId === userId && !n.read
        ).length;

        res.json({
            success: true,
            unreadCount,
            count: result.length,
            data: result
        });
    }

    // PATCH /api/notifications/:id/read  — mark a single notification as read
    static markAsRead(req: AuthRequest, res: Response): void {
        const userId = req.userId ?? "CS-2022-095";
        const notification = notifications.find(
            (n) => n.id === Number(req.params.id) && n.userId === userId
        );
        if (!notification) {
            res.status(404).json({ success: false, message: "Notification not found" });
            return;
        }

        notification.read = true;
        res.json({ success: true, message: "Notification marked as read", data: notification });
    }

    // PATCH /api/notifications/read-all  — mark all user's notifications as read
    static markAllAsRead(req: AuthRequest, res: Response): void {
        const userId = req.userId ?? "CS-2022-095";
        let count = 0;
        notifications.forEach((n) => {
            if (n.userId === userId && !n.read) {
                n.read = true;
                count++;
            }
        });
        res.json({
            success: true,
            message: `${count} notification(s) marked as read`
        });
    }

    // POST /api/notifications  — create/send a notification (admin / system use)
    static createNotification(req: Request, res: Response): void {
        const { userId, message, type = "general" } = req.body;
        if (!userId || !message) {
            res.status(400).json({
                success: false,
                message: "userId and message are required"
            });
            return;
        }

        const newNotification = {
            id: nextId("notification"),
            userId,
            message,
            type,
            read: false,
            createdAt: new Date().toISOString()
        };

        notifications.push(newNotification);
        res.status(201).json({
            success: true,
            message: "Notification sent",
            data: newNotification
        });
    }

    // DELETE /api/notifications/:id
    static deleteNotification(req: AuthRequest, res: Response): void {
        const userId = req.userId ?? "CS-2022-095";
        const index = notifications.findIndex(
            (n) => n.id === Number(req.params.id) && n.userId === userId
        );
        if (index === -1) {
            res.status(404).json({ success: false, message: "Notification not found" });
            return;
        }
        notifications.splice(index, 1);
        res.json({ success: true, message: "Notification deleted" });
    }
}
