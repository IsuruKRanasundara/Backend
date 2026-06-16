import { Request, Response } from "express";
import { facilities, nextId } from "../data/store";
import type { Booking } from "../data/store";

export class FacilityController {
    // GET /api/facilities  — optional ?type= and ?open=true
    static getFacilities(req: Request, res: Response): void {
        const { type, open } = req.query;
        let result = [...facilities];

        if (type) {
            result = result.filter(
                (f) => f.type.toLowerCase() === (type as string).toLowerCase()
            );
        }
        if (open !== undefined) {
            result = result.filter((f) => f.open === (open === "true"));
        }

        // Return facilities without their full booking list for brevity
        const summary = result.map(({ bookings: _b, ...f }) => f);
        res.json({ success: true, count: summary.length, data: summary });
    }

    // GET /api/facilities/:id
    static getFacilityById(req: Request, res: Response): void {
        const facility = facilities.find((f) => f.id === Number(req.params.id));
        if (!facility) {
            res.status(404).json({ success: false, message: "Facility not found" });
            return;
        }
        res.json({ success: true, data: facility });
    }

    // POST /api/facilities
    static createFacility(req: Request, res: Response): void {
        const { name, type, capacity, open = true, openHours, location } = req.body;
        if (!name || !type) {
            res.status(400).json({
                success: false,
                message: "name and type are required"
            });
            return;
        }

        // Simple ID: max existing id + 1
        const newId =
            facilities.length > 0
                ? Math.max(...facilities.map((f) => f.id)) + 1
                : 1;

        const newFacility = {
            id: newId,
            name,
            type,
            capacity: Number(capacity) || 0,
            open,
            openHours: openHours ?? "08:00 AM – 06:00 PM",
            location: location ?? "Campus",
            bookings: []
        };

        facilities.push(newFacility);
        const { bookings: _b, ...summary } = newFacility;
        res.status(201).json({
            success: true,
            message: "Facility created",
            data: summary
        });
    }

    // POST /api/facilities/:id/book  — create a time-slot booking
    static bookFacility(req: Request, res: Response): void {
        const facility = facilities.find((f) => f.id === Number(req.params.id));
        if (!facility) {
            res.status(404).json({ success: false, message: "Facility not found" });
            return;
        }
        if (!facility.open) {
            res.status(400).json({
                success: false,
                message: `${facility.name} is currently closed and cannot be booked`
            });
            return;
        }

        const { userId = "CS-2022-095", date, startTime, endTime, purpose } =
            req.body;

        if (!date || !startTime || !endTime) {
            res.status(400).json({
                success: false,
                message: "date, startTime, and endTime are required"
            });
            return;
        }

        // Conflict check
        const conflict = facility.bookings.find(
            (b) =>
                b.date === date &&
                b.status !== "cancelled" &&
                !(endTime <= b.startTime || startTime >= b.endTime)
        );
        if (conflict) {
            res.status(409).json({
                success: false,
                message: `${facility.name} is already booked from ${conflict.startTime} to ${conflict.endTime} on ${date}`
            });
            return;
        }

        const newBooking: Booking = {
            id: nextId("booking"),
            facilityId: facility.id,
            userId,
            date,
            startTime,
            endTime,
            purpose: purpose ?? "General Use",
            status: "confirmed"
        };

        facility.bookings.push(newBooking);
        res.status(201).json({
            success: true,
            message: "Booking confirmed",
            data: newBooking
        });
    }

    // GET /api/facilities/:id/bookings  — list bookings for a facility
    static getFacilityBookings(req: Request, res: Response): void {
        const facility = facilities.find((f) => f.id === Number(req.params.id));
        if (!facility) {
            res.status(404).json({ success: false, message: "Facility not found" });
            return;
        }
        const { date } = req.query;
        const bookings = date
            ? facility.bookings.filter((b) => b.date === date)
            : facility.bookings;

        res.json({ success: true, count: bookings.length, data: bookings });
    }

    // PATCH /api/facilities/:id/bookings/:bookingId/cancel
    static cancelBooking(req: Request, res: Response): void {
        const facility = facilities.find((f) => f.id === Number(req.params.id));
        if (!facility) {
            res.status(404).json({ success: false, message: "Facility not found" });
            return;
        }

        const booking = facility.bookings.find(
            (b) => b.id === Number(req.params.bookingId)
        );
        if (!booking) {
            res.status(404).json({ success: false, message: "Booking not found" });
            return;
        }
        if (booking.status === "cancelled") {
            res.status(400).json({ success: false, message: "Booking is already cancelled" });
            return;
        }

        booking.status = "cancelled";
        res.json({ success: true, message: "Booking cancelled", data: booking });
    }
}
