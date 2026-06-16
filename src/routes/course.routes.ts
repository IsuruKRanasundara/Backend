import { Router } from "express";
import { CourseController } from "../controllers/course.controller";

const courseRouter = Router();

courseRouter.get("/", CourseController.getCourses);
courseRouter.get("/:code", CourseController.getCourseByCode);
courseRouter.post("/", CourseController.createCourse);
courseRouter.patch("/:code/enroll", CourseController.enrollCourse);
courseRouter.delete("/:code", CourseController.deleteCourse);

export default courseRouter;
