import express from "express";
import { activityController } from "../controllers/activity.js";

export const activityRouter = express.Router();

activityRouter.get("/getAll/:program_id/:semester", activityController.getAll);
activityRouter.get(
  "/getByIdAndSemester/:id/:semester",
  activityController.getbyIdDocenteAndSemester
);
activityRouter.get("/getById/:id", activityController.getbyIdDocente);
activityRouter.post("/save", activityController.post);
activityRouter.put("/:id", activityController.update);
activityRouter.delete("/:id", activityController.delete);
