import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import type { NextFunction, Request, Response } from "express";
import announcementRouter from "./routes/announcement.routes";
import assignmentRouter from "./routes/assignment.routes";
import assistantRouter from "./routes/assistant.routes";
import authRouter from "./routes/auth.routes";
import courseRouter from "./routes/course.routes";
import eventRouter from "./routes/event.routes";
import facilityRouter from "./routes/facility.routes";
import notificationRouter from "./routes/notification.routes";
import resultRouter from "./routes/result.routes";
import timetableRouter from "./routes/timetable.routes";
import userRouter from "./routes/user.routes";

const app = express();
type HttpError = Error & {
    status?: number;
    statusCode?: number;
};

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Smart Campus API is running"
    });
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/courses", courseRouter);
app.use("/api/announcements", announcementRouter);
app.use("/api/assignments", assignmentRouter);
app.use("/api/assistant", assistantRouter);
app.use("/api/events", eventRouter);
app.use("/api/facilities", facilityRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/results", resultRouter);
app.use("/api/timetable", timetableRouter);

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`
    });
});

app.use(
    (
        err: HttpError,
        _req: Request,
        res: Response,
        _next: NextFunction
    ) => {
        const statusCode =
            err.status && err.status >= 400 && err.status < 600
                ? err.status
                : err.statusCode && err.statusCode >= 400 && err.statusCode < 600
                  ? err.statusCode
                  : 500;

        res.status(statusCode).json({
            success: false,
            message:
                statusCode === 500
                    ? "Internal server error"
                    : err.message
        });
    }
);

export default app;
