import express from "express";
import {
  verifyToken,
  verifyCoordinator,
  verifyTeacher,
} from "../middlewares/jwt.middleware.js";
import { formatController } from "../controllers/format.js";

export const formatRouter = express.Router();

formatRouter.get(
  "/:id/:semester",
  verifyToken,
  formatController.getByTeacherIdAndSemester
);
formatRouter.post(
  "/getAll",
  verifyToken,
  formatController.getByProgramIdAndSemester
);
formatRouter.post(
  "/getAllSigned",
  verifyToken,
  formatController.getSignedByProgramIdAndSemester
);
formatRouter.post("/", verifyToken, formatController.post);
formatRouter.put("/:id", verifyToken, formatController.update);
