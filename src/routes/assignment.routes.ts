import { Router } from "express";
import { AssignmentController } from "../controllers/assignment.controller";

const assignmentRouter = Router();

assignmentRouter.get("/", AssignmentController.getAssignments);

export default assignmentRouter;
