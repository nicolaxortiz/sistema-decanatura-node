import express from "express";
import {
  verifyToken,
  verifyCoordinator,
  verifyTeacher,
} from "../middlewares/jwt.middleware.js";
import { scheduleController } from "../controllers/schedule.js";

export const scheduleRouter = express.Router();

scheduleRouter.get(
  "/:id/:semester",
  verifyToken,
  scheduleController.getByTeacherIdAndSemester
);
scheduleRouter.post("/save", verifyToken, scheduleController.post);
scheduleRouter.put("/:id", verifyToken, scheduleController.update);
scheduleRouter.delete(
  "/:teacher_id/:semester/:day/:moment",
  verifyToken,
  scheduleController.delete
);

scheduleRouter.delete(
  "/:teacher_id/:semester",
  verifyToken,
  scheduleController.deleteAll
);
