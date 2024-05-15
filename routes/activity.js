import express from "express";
import { activityController } from "../controllers/activity.js";

export const activityRouter = express.Router();

activityRouter.get("/", activityController.getAll);
activityRouter.get("/:id", activityController.getbyIdDocenteAndSemester);
activityRouter.get("/get/:id", activityController.getbyIdDocente);
activityRouter.post("/save", activityController.post);
activityRouter.put("/:id", activityController.update);
activityRouter.delete("/:id", activityController.delete);
