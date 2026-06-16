import { Request, Response } from "express";
import { courses } from "../data/store";

export class CourseController {
    // GET /api/courses  — optional ?semester= filter
    static getCourses(req: Request, res: Response): void {
        const { semester } = req.query;
        let result = [...courses];

        if (semester) {
            result = result.filter((c) =>
                c.semester.toLowerCase() === (semester as string).toLowerCase()
            );
        }

        res.json({ success: true, count: result.length, data: result });
    }

    // GET /api/courses/:code
    static getCourseByCode(req: Request, res: Response): void {
        const course = courses.find(
            (c) => c.code.toLowerCase() === req.params.code.toString().toLowerCase()
        );
        if (!course) {
            res.status(404).json({ success: false, message: "Course not found" });
            return;
        }
        res.json({ success: true, data: course });
    }

    // POST /api/courses
    static createCourse(req: Request, res: Response): void {
        const { code, name, credits, lecturer, semester } = req.body;
        if (!code || !name || !credits) {
            res.status(400).json({
                success: false,
                message: "code, name, and credits are required"
            });
            return;
        }

        const exists = courses.some(
            (c) => c.code.toLowerCase() === code.toLowerCase()
        );
        if (exists) {
            res.status(409).json({
                success: false,
                message: `Course with code ${code} already exists`
            });
            return;
        }

        const newCourse = {
            code,
            name,
            credits: Number(credits),
            lecturer: lecturer ?? "TBA",
            semester: semester ?? "2026-S1",
            enrolled: 0
        };

        courses.push(newCourse);
        res.status(201).json({
            success: true,
            message: "Course created",
            data: newCourse
        });
    }

    // PATCH /api/courses/:code/enroll  — increment enrolment count
    static enrollCourse(req: Request, res: Response): void {
        const course = courses.find(
            (c) => c.code.toLowerCase() === req.params.code.toString().toLowerCase()
        );
        if (!course) {
            res.status(404).json({ success: false, message: "Course not found" });
            return;
        }

        course.enrolled += 1;
        res.json({
            success: true,
            message: `Enrolled in ${course.name}`,
            data: course
        });
    }

    // DELETE /api/courses/:code
    static deleteCourse(req: Request, res: Response): void {
        const index = courses.findIndex(
            (c) => c.code.toLowerCase() === req.params.code.toString().toLowerCase()
        );
        if (index === -1) {
            res.status(404).json({ success: false, message: "Course not found" });
            return;
        }
        courses.splice(index, 1);
        res.json({ success: true, message: "Course deleted" });
    }
}
