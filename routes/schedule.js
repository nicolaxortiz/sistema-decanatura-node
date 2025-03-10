import express from "express";
import { scheduleController } from "../controllers/schedule.js";

export const scheduleRouter = express.Router();

scheduleRouter.get(
  "/:id/:semester",
  scheduleController.geybyTeacherIdAndSemester
);
scheduleRouter.post("/save", scheduleController.post);
scheduleRouter.put("/:id", scheduleController.update);
scheduleRouter.delete(
  "/:teacher_id/:semester/:day/:moment",
  scheduleController.delete
);
