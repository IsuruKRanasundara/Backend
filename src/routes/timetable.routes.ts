import { Router } from "express";
import { TimetableController } from "../controllers/timetable.controller";

const timetableRouter = Router();

timetableRouter.get("/today", TimetableController.getTodaySchedule);
timetableRouter.get("/week", TimetableController.getWeekSchedule);
timetableRouter.get("/day/:day", TimetableController.getScheduleByDay);
timetableRouter.get("/course/:courseCode", TimetableController.getScheduleByCourse);
timetableRouter.post("/", TimetableController.addEntry);
timetableRouter.delete("/:id", TimetableController.deleteEntry);

export default timetableRouter;
