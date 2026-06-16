import { Request, Response } from "express";
import { assignments, nextId } from "../data/store";

export class AssignmentController {
    // GET /api/assignments  — optional ?status=Pending&courseCode=
    static getAssignments(req: Request, res: Response): void {
        const { status, courseCode } = req.query;
        let result = [...assignments];

        if (status) {
            result = result.filter((a) => a.status === status);
        }
        if (courseCode) {
            result = result.filter(
                (a) => a.courseCode.toLowerCase() === (courseCode as string).toLowerCase()
            );
        }

        // Sort: pending first, then by due date ascending
        result.sort((a, b) => {
            if (a.status === "Pending" && b.status !== "Pending") return -1;
            if (a.status !== "Pending" && b.status === "Pending") return 1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });

        res.json({ success: true, count: result.length, data: result });
    }

    // GET /api/assignments/:id
    static getAssignmentById(req: Request, res: Response): void {
        const assignment = assignments.find((a) => a.id === Number(req.params.id));
        if (!assignment) {
            res.status(404).json({ success: false, message: "Assignment not found" });
            return;
        }
        res.json({ success: true, data: assignment });
    }

    // POST /api/assignments
    static createAssignment(req: Request, res: Response): void {
        const { title, courseCode, description, dueDate, maxMarks = 100 } = req.body;

        if (!title || !courseCode || !dueDate) {
            res.status(400).json({
                success: false,
                message: "Title, courseCode, and dueDate are required"
            });
            return;
        }

        const newAssignment = {
            id: nextId("assignment"),
            title,
            courseCode,
            description: description ?? "",
            dueDate,
            status: "Pending" as const,
            maxMarks
        };

        assignments.push(newAssignment);
        res.status(201).json({
            success: true,
            message: "Assignment created",
            data: newAssignment
        });
    }

    // PATCH /api/assignments/:id/submit  — student submits an assignment
    static submitAssignment(req: Request, res: Response): void {
        const assignment = assignments.find((a) => a.id === Number(req.params.id));
        if (!assignment) {
            res.status(404).json({ success: false, message: "Assignment not found" });
            return;
        }
        if (assignment.status === "Submitted" || assignment.status === "Graded") {
            res.status(400).json({
                success: false,
                message: `Assignment is already ${assignment.status.toLowerCase()}`
            });
            return;
        }

        const dueDatePassed = new Date(assignment.dueDate) < new Date();
        assignment.status = dueDatePassed ? "Overdue" : "Submitted";
        assignment.submittedAt = new Date().toISOString();

        res.json({
            success: true,
            message: dueDatePassed
                ? "Assignment submitted but marked overdue (past due date)"
                : "Assignment submitted successfully",
            data: assignment
        });
    }

    // PATCH /api/assignments/:id/grade  — lecturer grades an assignment
    static gradeAssignment(req: Request, res: Response): void {
        const assignment = assignments.find((a) => a.id === Number(req.params.id));
        if (!assignment) {
            res.status(404).json({ success: false, message: "Assignment not found" });
            return;
        }

        const { marks } = req.body;
        if (marks === undefined || isNaN(Number(marks))) {
            res.status(400).json({ success: false, message: "marks (number) is required" });
            return;
        }
        if (Number(marks) > assignment.maxMarks) {
            res.status(400).json({
                success: false,
                message: `Marks cannot exceed maxMarks (${assignment.maxMarks})`
            });
            return;
        }

        assignment.marks = Number(marks);
        assignment.status = "Graded";

        res.json({
            success: true,
            message: "Assignment graded",
            data: assignment
        });
    }

    // DELETE /api/assignments/:id
    static deleteAssignment(req: Request, res: Response): void {
        const index = assignments.findIndex((a) => a.id === Number(req.params.id));
        if (index === -1) {
            res.status(404).json({ success: false, message: "Assignment not found" });
            return;
        }
        assignments.splice(index, 1);
        res.json({ success: true, message: "Assignment deleted" });
    }
}
