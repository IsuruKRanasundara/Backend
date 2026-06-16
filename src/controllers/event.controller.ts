import { Request, Response } from "express";
import { events, nextId } from "../data/store";

export class EventController {
    // GET /api/events  — optional ?category= and ?upcoming=true
    static getEvents(req: Request, res: Response): void {
        const { category, upcoming } = req.query;
        let result = [...events];

        if (category) {
            result = result.filter(
                (e) => e.category.toLowerCase() === (category as string).toLowerCase()
            );
        }
        if (upcoming === "true") {
            const now = new Date();
            result = result.filter((e) => new Date(e.date) >= now);
        }

        result.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        res.json({ success: true, count: result.length, data: result });
    }

    // GET /api/events/:id
    static getEventById(req: Request, res: Response): void {
        const event = events.find((e) => e.id === Number(req.params.id));
        if (!event) {
            res.status(404).json({ success: false, message: "Event not found" });
            return;
        }
        res.json({ success: true, data: event });
    }

    // POST /api/events
    static createEvent(req: Request, res: Response): void {
        const { name, description, date, time, venue, category, organizer } =
            req.body;

        if (!name || !date || !venue) {
            res.status(400).json({
                success: false,
                message: "name, date, and venue are required"
            });
            return;
        }

        const newEvent = {
            id: nextId("event"),
            name,
            description: description ?? "",
            date,
            time: time ?? "TBA",
            venue,
            category: category ?? "General",
            organizer: organizer ?? "University",
            registeredCount: 0
        };

        events.push(newEvent);
        res.status(201).json({
            success: true,
            message: "Event created",
            data: newEvent
        });
    }

    // PATCH /api/events/:id/register  — student registers for event
    static registerForEvent(req: Request, res: Response): void {
        const event = events.find((e) => e.id === Number(req.params.id));
        if (!event) {
            res.status(404).json({ success: false, message: "Event not found" });
            return;
        }
        if (new Date(event.date) < new Date()) {
            res.status(400).json({
                success: false,
                message: "Cannot register for a past event"
            });
            return;
        }

        event.registeredCount += 1;
        res.json({
            success: true,
            message: `Registered for "${event.name}"`,
            data: event
        });
    }

    // DELETE /api/events/:id
    static deleteEvent(req: Request, res: Response): void {
        const index = events.findIndex((e) => e.id === Number(req.params.id));
        if (index === -1) {
            res.status(404).json({ success: false, message: "Event not found" });
            return;
        }
        events.splice(index, 1);
        res.json({ success: true, message: "Event deleted" });
    }
}
