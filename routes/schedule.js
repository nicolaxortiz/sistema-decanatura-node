import express from "express";
import { scheduleController } from "../controllers/schedule.js";

export const scheduleRouter = express.Router();

scheduleRouter.get("/:id", scheduleController.geybyIdActividades);
scheduleRouter.post("/save", scheduleController.post);
scheduleRouter.put("/:id", scheduleController.update);
scheduleRouter.delete("/:id", scheduleController.delete);
