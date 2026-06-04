import { Router } from "express";
import { ResultController } from "../controllers/result.controller";

const resultRouter = Router();

resultRouter.get("/", ResultController.getResults);

export default resultRouter;
