import { Router } from "express";
import { TimetableController } from "../controllers/timetable.controller";

const timetableRouter = Router();

timetableRouter.get("/today", TimetableController.getTodaySchedule);

export default timetableRouter;
