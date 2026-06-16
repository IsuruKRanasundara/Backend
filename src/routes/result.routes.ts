import { Router } from "express";
import { ResultController } from "../controllers/result.controller";

const resultRouter = Router();

resultRouter.get("/", ResultController.getResults);
resultRouter.get("/summary", ResultController.getSummary);
resultRouter.get("/:id", ResultController.getResultById);
resultRouter.post("/", ResultController.createResult);

export default resultRouter;
