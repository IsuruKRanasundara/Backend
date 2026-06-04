import { Router } from "express";
import { AnnouncementController } from "../controllers/announcement.controller";

const announcementRouter = Router();

announcementRouter.get("/", AnnouncementController.getAnnouncements);

export default announcementRouter;
