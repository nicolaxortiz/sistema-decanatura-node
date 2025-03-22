import express from "express";
import { upload } from "../config/multer.js";
import { coordinatorController } from "../controllers/coordinator.js";

export const coordinatorRouter = express.Router();

coordinatorRouter.get("/:campus_id", coordinatorController.getByCampusId);
coordinatorRouter.post("/login", coordinatorController.getByCredential);
coordinatorRouter.post(
  "/",
  upload.fields([{ name: "signature", maxCount: 1 }]),
  coordinatorController.post
);
coordinatorRouter.put(
  "/:id",
  upload.fields([{ name: "signature", maxCount: 1 }]),
  coordinatorController.update
);
