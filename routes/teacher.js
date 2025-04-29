import express from "express";
import { upload } from "../config/multer.js";
import { teacherController } from "../controllers/teacher.js";
import {
  verifyToken,
  verifyCoordinator,
  verifyTeacher,
} from "../middlewares/jwt.middleware.js";

export const teacherRouter = express.Router();

teacherRouter.post(
  "/sort",
  verifyToken,
  verifyCoordinator,
  teacherController.getAll
);
teacherRouter.get(
  "/:program_id/:document",
  verifyToken,
  verifyCoordinator,
  teacherController.getbyDocument
);
teacherRouter.post("/login", teacherController.getbyCredentials);
teacherRouter.post("/recovery", teacherController.getbyEmail);
teacherRouter.post("/", verifyToken, verifyCoordinator, teacherController.post);
teacherRouter.put(
  "/:id",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  teacherController.update
);
teacherRouter.put("/state/:id", verifyToken, teacherController.updateState);
