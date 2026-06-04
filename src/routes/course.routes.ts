import { Router } from "express";
import { CourseController } from "../controllers/course.controller";

const courseRouter = Router();

courseRouter.get("/", CourseController.getCourses);

export default courseRouter;
