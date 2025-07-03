import express from "express";
import { activityController } from "../controllers/activity.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";

export const activityRouter = express.Router();

activityRouter.get("/getAll/:campus/:semester", activityController.getAll);
// activityRouter.get("/getById/:id", activityController.getbyIdDocente);
activityRouter.get(
  "/getByIdAndSemester/:id/:semester",
  verifyToken,
  activityController.getbyIdDocenteAndSemester
);
activityRouter.post("/save", verifyToken, activityController.post);
activityRouter.put("/:id", verifyToken, activityController.update);
activityRouter.delete("/:id", verifyToken, activityController.delete);
