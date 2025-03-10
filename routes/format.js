import express from "express";
import { formatController } from "../controllers/format.js";

export const formatRouter = express.Router();

formatRouter.get("/:id/:semester", formatController.getByTeacherIdAndSemester);
formatRouter.get(
  "/getAll/:id/:semester/:actualPage",
  formatController.getByProgramIdAndSemester
);
formatRouter.post("/", formatController.post);
formatRouter.put("/:id", formatController.update);
