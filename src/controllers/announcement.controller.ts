import { Request, Response } from "express";
import { announcements, nextId } from "../data/store";

export class AnnouncementController {
    // GET /api/announcements  — list with optional ?category= filter
    static getAnnouncements(req: Request, res: Response): void {
        const { category, priority } = req.query;

        let result = [...announcements];
        if (category) {
            result = result.filter(
                (a) => a.category.toLowerCase() === (category as string).toLowerCase()
            );
        }
        if (priority) {
            result = result.filter(
                (a) => a.priority === priority
            );
        }

        // Most recent first
        result.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        res.json({ success: true, count: result.length, data: result });
    }

    // GET /api/announcements/:id
    static getAnnouncementById(req: Request, res: Response): void {
        const announcement = announcements.find(
            (a) => a.id === Number(req.params.id)
        );
        if (!announcement) {
            res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
            return;
        }
        res.json({ success: true, data: announcement });
    }

    // POST /api/announcements
    static createAnnouncement(req: Request, res: Response): void {
        const { title, description, category = "General", priority = "medium", author = "Admin" } =
            req.body;

        if (!title || !description) {
            res.status(400).json({
                success: false,
                message: "Title and description are required"
            });
            return;
        }

        const now = new Date().toISOString();
        const newAnnouncement = {
            id: nextId("announcement"),
            title,
            description,
            category,
            priority,
            author,
            createdAt: now,
            updatedAt: now
        };

        announcements.push(newAnnouncement);
        res.status(201).json({
            success: true,
            message: "Announcement created",
            data: newAnnouncement
        });
    }

    // PATCH /api/announcements/:id
    static updateAnnouncement(req: Request, res: Response): void {
        const announcement = announcements.find(
            (a) => a.id === Number(req.params.id)
        );
        if (!announcement) {
            res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
            return;
        }

        const allowedFields = ["title", "description", "category", "priority"] as const;
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                (announcement as any)[field] = req.body[field];
            }
        }
        announcement.updatedAt = new Date().toISOString();

        res.json({ success: true, message: "Announcement updated", data: announcement });
    }

    // DELETE /api/announcements/:id
    static deleteAnnouncement(req: Request, res: Response): void {
        const index = announcements.findIndex(
            (a) => a.id === Number(req.params.id)
        );
        if (index === -1) {
            res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
            return;
        }

        announcements.splice(index, 1);
        res.json({ success: true, message: "Announcement deleted" });
    }
}
