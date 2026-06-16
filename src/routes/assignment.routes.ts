import { Router } from "express";
import { AssignmentController } from "../controllers/assignment.controller";

const assignmentRouter = Router();

assignmentRouter.get("/", AssignmentController.getAssignments);
assignmentRouter.get("/:id", AssignmentController.getAssignmentById);
assignmentRouter.post("/", AssignmentController.createAssignment);
assignmentRouter.patch("/:id/submit", AssignmentController.submitAssignment);
assignmentRouter.patch("/:id/grade", AssignmentController.gradeAssignment);
assignmentRouter.delete("/:id", AssignmentController.deleteAssignment);

export default assignmentRouter;
