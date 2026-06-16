import { Request, Response } from "express";
import {
    timetable,
    assignments,
    announcements,
    results,
    facilities,
    events
} from "../data/store";

// ─── Keyword-based intent router ─────────────────────────────────────────────
// Maps common natural-language questions to real data from the store.
// Each rule is checked in order; the first match wins.

interface Rule {
    keywords: string[];
    handler: (question: string) => string;
}

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

function detectDay(question: string): string | null {
    const q = question.toLowerCase();
    for (const d of DAYS) {
        if (q.includes(d)) return d.charAt(0).toUpperCase() + d.slice(1);
    }
    return null;
}

const rules: Rule[] = [
    // ── Timetable / schedule ──────────────────────────────────────────────
    {
        keywords: ["timetable", "schedule", "class", "lecture", "lab", "today"],
        handler: (question) => {
            const day = detectDay(question);
            if (day) {
                const entries = timetable.filter((t) => t.day === day);
                if (!entries.length) return `No classes scheduled for ${day}.`;
                const list = entries
                    .map((e) => `• ${e.course} — ${e.time} @ ${e.hall} (${e.type})`)
                    .join("\n");
                return `Your ${day} schedule:\n${list}`;
            }
            // Generic timetable query
            const next = timetable[0];
            return `Your next class is ${next.course} on ${next.day} at ${next.time} in ${next.hall}.`;
        }
    },

    // ── Assignments / deadlines ───────────────────────────────────────────
    {
        keywords: ["assignment", "deadline", "due", "submit", "homework"],
        handler: () => {
            const pending = assignments.filter((a) => a.status === "Pending");
            if (!pending.length) return "You have no pending assignments. Great work!";
            const list = pending
                .map((a) => `• ${a.title} (${a.courseCode}) — due ${a.dueDate}`)
                .join("\n");
            return `You have ${pending.length} pending assignment(s):\n${list}`;
        }
    },

    // ── Results / grades ─────────────────────────────────────────────────
    {
        keywords: ["result", "grade", "marks", "gpa", "score"],
        handler: () => {
            if (!results.length) return "No results are available yet.";
            const avgGpa =
                results.reduce((s, r) => s + r.gpa, 0) / results.length;
            const list = results
                .map((r) => `• ${r.course}: ${r.grade} (${r.marks}/${r.maxMarks})`)
                .join("\n");
            return `Your recent results (avg GPA: ${avgGpa.toFixed(2)}):\n${list}`;
        }
    },

    // ── Announcements ─────────────────────────────────────────────────────
    {
        keywords: ["announcement", "notice", "news", "update"],
        handler: () => {
            const recent = [...announcements]
                .sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                )
                .slice(0, 3);
            const list = recent.map((a) => `• [${a.priority.toUpperCase()}] ${a.title}`).join("\n");
            return `Latest announcements:\n${list}`;
        }
    },

    // ── Facilities ────────────────────────────────────────────────────────
    {
        keywords: ["facility", "library", "lab", "room", "open", "available"],
        handler: () => {
            const open = facilities.filter((f) => f.open);
            const closed = facilities.filter((f) => !f.open);
            const openList = open.map((f) => `• ${f.name} (${f.openHours})`).join("\n");
            const closedList = closed.map((f) => `• ${f.name}`).join("\n");
            return (
                `Open facilities:\n${openList || "None"}` +
                (closedList ? `\n\nCurrently closed:\n${closedList}` : "")
            );
        }
    },

    // ── Events ────────────────────────────────────────────────────────────
    {
        keywords: ["event", "hackathon", "career fair", "workshop", "activity"],
        handler: () => {
            const upcoming = [...events]
                .filter((e) => new Date(e.date) >= new Date())
                .sort(
                    (a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                );
            if (!upcoming.length) return "There are no upcoming events at the moment.";
            const list = upcoming
                .map((e) => `• ${e.name} — ${e.date} @ ${e.venue}`)
                .join("\n");
            return `Upcoming events:\n${list}`;
        }
    }
];

// ─── Controller ──────────────────────────────────────────────────────────────

export class AssistantController {
    // POST /api/assistant/ask
    static ask(req: Request, res: Response): void {
        const { question } = req.body;

        if (!question || typeof question !== "string" || !question.trim()) {
            res.status(400).json({
                success: false,
                message: "A non-empty 'question' string is required"
            });
            return;
        }

        const q = question.toLowerCase();
        const matched = rules.find((rule) =>
            rule.keywords.some((kw) => q.includes(kw))
        );

        const answer = matched
            ? matched.handler(q)
            : "I'm not sure how to answer that. Try asking about your timetable, assignments, results, announcements, facilities, or upcoming events.";

        res.json({
            success: true,
            question,
            answer,
            timestamp: new Date().toISOString()
        });
    }

    // GET /api/assistant/topics  — lists topics the assistant can help with
    static getTopics(_req: Request, res: Response): void {
        res.json({
            success: true,
            topics: [
                { topic: "Timetable", examples: ["What classes do I have today?", "Show Monday schedule"] },
                { topic: "Assignments", examples: ["What assignments are due?", "Show pending deadlines"] },
                { topic: "Results", examples: ["What are my grades?", "Show my GPA"] },
                { topic: "Announcements", examples: ["Any new announcements?", "Latest university news"] },
                { topic: "Facilities", examples: ["Is the library open?", "Available labs"] },
                { topic: "Events", examples: ["Upcoming events", "Any workshops?"] }
            ]
        });
    }
}
