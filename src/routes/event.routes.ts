import { Router } from "express";
import { EventController } from "../controllers/event.controller";

const eventRouter = Router();

eventRouter.get("/", EventController.getEvents);
eventRouter.get("/:id", EventController.getEventById);
eventRouter.post("/", EventController.createEvent);
eventRouter.patch("/:id/register", EventController.registerForEvent);
eventRouter.delete("/:id", EventController.deleteEvent);

export default eventRouter;
