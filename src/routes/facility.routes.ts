import { Router } from "express";
import { FacilityController } from "../controllers/facility.controller";

const facilityRouter = Router();

facilityRouter.get("/", FacilityController.getFacilities);

export default facilityRouter;
