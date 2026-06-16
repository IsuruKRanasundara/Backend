import { Request, Response } from "express";

// ─── Shared timetable data ────────────────────────────────────────────────────
// Each entry shape: { course, time, hall }
// "time" must be "HH:MM AM/PM - HH:MM AM/PM" — the frontend splits on " - ".

const WEEKLY_TIMETABLE: Record<string, Array<{ course: string; time: string; hall: string }>> = {
    Monday: [
        { course: "Mobile Web Development",  time: "08:00 AM - 10:00 AM", hall: "Lab 01" },
        { course: "Distributed Systems",      time: "11:00 AM - 01:00 PM", hall: "A101"   },
        { course: "Software Engineering",     time: "02:00 PM - 03:30 PM", hall: "Room 204" },
    ],
    Tuesday: [
        { course: "Database Systems",         time: "09:00 AM - 11:00 AM", hall: "Lecture Hall 3" },
        { course: "Software Engineering",     time: "01:00 PM - 03:00 PM", hall: "Room 204"        },
        { course: "Network Security",         time: "03:30 PM - 05:00 PM", hall: "Lab 05"          },
    ],
    Wednesday: [
        { course: "Mobile Web Development",   time: "08:00 AM - 10:00 AM", hall: "Lab 02"          },
        { course: "Human Computer Interaction", time: "11:00 AM - 12:30 PM", hall: "Design Studio 1"},
        { course: "Distributed Systems",      time: "02:00 PM - 04:00 PM", hall: "A101"            },
    ],
    Thursday: [
        { course: "Database Systems",         time: "10:00 AM - 12:00 PM", hall: "Lecture Hall 3" },
        { course: "Network Security",         time: "02:00 PM - 04:00 PM", hall: "Lab 05"         },
        { course: "Human Computer Interaction", time: "04:15 PM - 05:30 PM", hall: "Design Studio 1"},
    ],
    Friday: [
        { course: "Database Systems",         time: "09:00 AM - 11:00 AM", hall: "Lecture Hall 3" },
        { course: "Career Skills Workshop",   time: "01:00 PM - 02:30 PM", hall: "Seminar Room B" },
        { course: "Mobile Web Development",   time: "03:00 PM - 04:30 PM", hall: "Lab 01"         },
    ],
};

/** Return the current weekday name, defaulting to Monday outside Mon–Fri. */
function getTodayKey(): string {
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const name = days[new Date().getDay()];
    return WEEKLY_TIMETABLE[name] ? name : "Monday";
}

export class TimetableController {
    /**
     * GET /api/timetable/today
     * Returns today's lecture schedule (array of { course, time, hall }).
     * The frontend Dashboard and Timetable pages consume this directly.
     */
    static getTodaySchedule(_req: Request, res: Response): void {
        const key = getTodayKey();
        res.json(WEEKLY_TIMETABLE[key] ?? []);
    }

    /**
     * GET /api/timetable/week
     * Returns the full week keyed by day name.
     */
    static getWeeklySchedule(_req: Request, res: Response): void {
        res.json(WEEKLY_TIMETABLE);
    }

    /**
     * GET /api/timetable/:day
     * Returns the schedule for a specific day (case-insensitive).
     * e.g. GET /api/timetable/tuesday
     */
    static getDaySchedule(req: Request, res: Response): void {
        const day = req.params.day as string;
        const key = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();

        if (!WEEKLY_TIMETABLE[key]) {
            res.status(404).json({
                success: false,
                message: `No timetable found for "${day}". Valid days: Monday–Friday.`,
            });
            return;
        }

        res.json(WEEKLY_TIMETABLE[key]);
    }
}