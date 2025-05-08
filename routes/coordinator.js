import express from "express";
import { upload } from "../config/multer.js";
import { coordinatorController } from "../controllers/coordinator.js";
import {
  verifyToken,
  verifyCoordinator,
  verifyTeacher,
  verifyAdmin,
} from "../middlewares/jwt.middleware.js";

export const coordinatorRouter = express.Router();

coordinatorRouter.get(
  "/:campus_id",
  verifyToken,
  verifyAdmin,
  coordinatorController.getByCampusId
);
coordinatorRouter.post("/recovery", coordinatorController.getbyEmail);
coordinatorRouter.post("/login", coordinatorController.getByCredential);
coordinatorRouter.post(
  "/",
  verifyToken,
  verifyAdmin,
  coordinatorController.post
);
coordinatorRouter.put(
  "/:id",
  upload.fields([{ name: "signature", maxCount: 1 }]),
  verifyToken,
  coordinatorController.update
);
