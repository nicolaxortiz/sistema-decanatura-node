import express from "express";
import {
  verifyToken,
  verifyCoordinator,
  verifyAdmin,
  verifyTeacher,
} from "../middlewares/jwt.middleware.js";
import { programController } from "../controllers/program.js";

export const programRouter = express.Router();

programRouter.get(
  "/getByCampusId/:campus_id/:actualPage",
  verifyToken,
  verifyAdmin,
  programController.getByCampusId
);
programRouter.get(
  "/getAllByCampusId/:campus_id",
  verifyToken,
  verifyAdmin,
  programController.getAllByCampusId
);
programRouter.post("/", verifyToken, verifyAdmin, programController.post);
programRouter.put("/:id", verifyToken, verifyAdmin, programController.update);
