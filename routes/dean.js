import express from "express";
import { upload } from "../config/multer.js";
import { deanController } from "../controllers/dean.js";
import {
  verifyToken,
  verifyCoordinator,
  verifyTeacher,
  verifyAdmin,
} from "../middlewares/jwt.middleware.js";

export const deanRouter = express.Router();

deanRouter.get(
  "/:campus_id/:actualPage",
  verifyToken,
  verifyAdmin,
  deanController.getByCampusId
);
deanRouter.post("/recovery", deanController.getbyEmail);
deanRouter.post("/login", deanController.getByCredential);
deanRouter.post("/", verifyToken, verifyAdmin, deanController.post);
deanRouter.put(
  "/:id",
  upload.fields([{ name: "signature", maxCount: 1 }]),
  deanController.update
);
