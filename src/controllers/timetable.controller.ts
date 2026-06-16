import { Request, Response } from "express";
import { timetable, nextId } from "../data/store";

const DAY_ORDER = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];

function todayName(): string {
    return new Date().toLocaleDateString("en-US", { weekday: "long" });
}

export class TimetableController {
    // GET /api/timetable/today
    static getTodaySchedule(_req: Request, res: Response): void {
        const day = todayName();
        const schedule = timetable
            .filter((t) => t.day === day)
            .sort((a, b) => a.time.localeCompare(b.time));

        res.json({
            success: true,
            day,
            count: schedule.length,
            data: schedule
        });
    }

    // GET /api/timetable/week  — full weekly timetable grouped by day
    static getWeekSchedule(_req: Request, res: Response): void {
        const grouped: Record<string, typeof timetable> = {};

        for (const day of DAY_ORDER) {
            const entries = timetable
                .filter((t) => t.day === day)
                .sort((a, b) => a.time.localeCompare(b.time));
            if (entries.length) grouped[day] = entries;
        }

        res.json({ success: true, data: grouped });
    }

    // GET /api/timetable/day/:day  — e.g. /timetable/day/Monday
    static getScheduleByDay(req: Request, res: Response): void {
        const day =
            req.params.day.toString().charAt(0).toUpperCase() +
            req.params.day.slice(1).toString().toLowerCase();

        if (!DAY_ORDER.includes(day)) {
            res.status(400).json({
                success: false,
                message: `Invalid day. Use one of: ${DAY_ORDER.join(", ")}`
            });
            return;
        }

        const schedule = timetable
            .filter((t) => t.day === day)
            .sort((a, b) => a.time.localeCompare(b.time));

        res.json({ success: true, day, count: schedule.length, data: schedule });
    }

    // GET /api/timetable/course/:courseCode
    static getScheduleByCourse(req: Request, res: Response): void {
        const code = req.params.courseCode.toString().toUpperCase();
        const schedule = timetable
            .filter((t) => t.courseCode.toUpperCase() === code)
            .sort(
                (a, b) =>
                    DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day)
            );

        if (!schedule.length) {
            res.status(404).json({
                success: false,
                message: `No timetable entries found for course ${code}`
            });
            return;
        }

        res.json({ success: true, count: schedule.length, data: schedule });
    }

    // POST /api/timetable  — add a new timetable entry
    static addEntry(req: Request, res: Response): void {
        const { course, courseCode, day, time, hall, lecturer, type = "Lecture" } =
            req.body;

        if (!course || !courseCode || !day || !time || !hall) {
            res.status(400).json({
                success: false,
                message: "course, courseCode, day, time, and hall are required"
            });
            return;
        }

        const normalDay =
            day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
        if (!DAY_ORDER.includes(normalDay)) {
            res.status(400).json({
                success: false,
                message: `Invalid day. Use one of: ${DAY_ORDER.join(", ")}`
            });
            return;
        }

        // Clash check: same hall + same day + overlapping time string
        const clash = timetable.find(
            (t) => t.hall === hall && t.day === normalDay && t.time === time
        );
        if (clash) {
            res.status(409).json({
                success: false,
                message: `Hall ${hall} is already occupied at ${time} on ${normalDay} (${clash.course})`
            });
            return;
        }

        const newEntry = {
            id: nextId("timetable"),
            course,
            courseCode,
            day: normalDay,
            time,
            hall,
            lecturer: lecturer ?? "TBA",
            type: type as "Lecture" | "Lab" | "Tutorial"
        };

        timetable.push(newEntry);
        res.status(201).json({
            success: true,
            message: "Timetable entry added",
            data: newEntry
        });
    }

    // DELETE /api/timetable/:id
    static deleteEntry(req: Request, res: Response): void {
        const index = timetable.findIndex(
            (t) => t.id === Number(req.params.id)
        );
        if (index === -1) {
            res.status(404).json({
                success: false,
                message: "Timetable entry not found"
            });
            return;
        }
        timetable.splice(index, 1);
        res.json({ success: true, message: "Timetable entry removed" });
    }
}
