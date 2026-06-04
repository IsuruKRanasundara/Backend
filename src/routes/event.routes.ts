import { Router } from "express";
import { EventController } from "../controllers/event.controller";

const eventRouter = Router();

eventRouter.get("/", EventController.getEvents);

export default eventRouter;
