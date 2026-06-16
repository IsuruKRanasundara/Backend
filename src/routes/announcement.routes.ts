import { Router } from "express";
import { AnnouncementController } from "../controllers/announcement.controller";

const announcementRouter = Router();

announcementRouter.get("/", AnnouncementController.getAnnouncements);
announcementRouter.get("/:id", AnnouncementController.getAnnouncementById);
announcementRouter.post("/", AnnouncementController.createAnnouncement);
announcementRouter.patch("/:id", AnnouncementController.updateAnnouncement);
announcementRouter.delete("/:id", AnnouncementController.deleteAnnouncement);

export default announcementRouter;
