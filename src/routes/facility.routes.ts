import { Router } from "express";
import { FacilityController } from "../controllers/facility.controller";

const facilityRouter = Router();

facilityRouter.get("/", FacilityController.getFacilities);
facilityRouter.get("/:id", FacilityController.getFacilityById);
facilityRouter.post("/", FacilityController.createFacility);
facilityRouter.post("/:id/book", FacilityController.bookFacility);
facilityRouter.get("/:id/bookings", FacilityController.getFacilityBookings);
facilityRouter.patch(
    "/:id/bookings/:bookingId/cancel",
    FacilityController.cancelBooking
);

export default facilityRouter;
