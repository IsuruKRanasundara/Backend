import { Router } from "express";
import { AssistantController } from "../controllers/assistant.controller";

const assistantRouter = Router();

assistantRouter.post("/ask", AssistantController.ask);
assistantRouter.get("/topics", AssistantController.getTopics);

export default assistantRouter;
