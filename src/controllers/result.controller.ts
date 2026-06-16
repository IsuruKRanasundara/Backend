import { Request, Response } from "express";
import { results, nextId } from "../data/store";

const GRADE_TO_GPA: Record<string, number> = {
    "A+": 4.0, A: 4.0, "A-": 3.7,
    "B+": 3.3, B: 3.0, "B-": 2.7,
    "C+": 2.3, C: 2.0, "C-": 1.7,
    "D+": 1.3, D: 1.0, F: 0.0
};

export class ResultController {
    // GET /api/results  — optional ?semester= & ?year= filters
    static getResults(req: Request, res: Response): void {
        const { semester, year } = req.query;
        let result = [...results];

        if (semester) {
            result = result.filter(
                (r) => r.semester.toLowerCase() === (semester as string).toLowerCase()
            );
        }
        if (year) {
            result = result.filter((r) => r.year === Number(year));
        }

        res.json({ success: true, count: result.length, data: result });
    }

    // GET /api/results/summary  — cumulative GPA and credit summary
    static getSummary(_req: Request, res: Response): void {
        if (!results.length) {
            res.json({
                success: true,
                data: { cumulativeGpa: 0, totalCourses: 0, grades: {} }
            });
            return;
        }

        const cumulativeGpa =
            results.reduce((sum, r) => sum + r.gpa, 0) / results.length;

        const gradeCounts: Record<string, number> = {};
        results.forEach((r) => {
            gradeCounts[r.grade] = (gradeCounts[r.grade] ?? 0) + 1;
        });

        const bestCourse = [...results].sort((a, b) => b.gpa - a.gpa)[0];
        const worstCourse = [...results].sort((a, b) => a.gpa - b.gpa)[0];

        res.json({
            success: true,
            data: {
                cumulativeGpa: Number(cumulativeGpa.toFixed(2)),
                totalCourses: results.length,
                gradeCounts,
                bestCourse: { course: bestCourse.course, grade: bestCourse.grade },
                worstCourse: { course: worstCourse.course, grade: worstCourse.grade }
            }
        });
    }

    // GET /api/results/:id
    static getResultById(req: Request, res: Response): void {
        const result = results.find((r) => r.id === Number(req.params.id));
        if (!result) {
            res.status(404).json({ success: false, message: "Result not found" });
            return;
        }
        res.json({ success: true, data: result });
    }

    // POST /api/results  — add a result (lecturer/admin)
    static createResult(req: Request, res: Response): void {
        const { courseCode, course, semester, grade, marks, maxMarks = 100, year } =
            req.body;

        if (!courseCode || !course || !grade || marks === undefined) {
            res.status(400).json({
                success: false,
                message: "courseCode, course, grade, and marks are required"
            });
            return;
        }

        if (!(grade in GRADE_TO_GPA)) {
            res.status(400).json({
                success: false,
                message: `Invalid grade. Valid grades: ${Object.keys(GRADE_TO_GPA).join(", ")}`
            });
            return;
        }

        const newResult = {
            id: nextId("result"),
            courseCode,
            course,
            semester: semester ?? "2026-S1",
            grade,
            gpa: GRADE_TO_GPA[grade],
            marks: Number(marks),
            maxMarks: Number(maxMarks),
            year: Number(year) || new Date().getFullYear()
        };

        results.push(newResult);
        res.status(201).json({
            success: true,
            message: "Result added",
            data: newResult
        });
    }
}
