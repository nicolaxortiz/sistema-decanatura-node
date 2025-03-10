import express from "express";
import { upload } from "../config/multer.js";
import { teacherController } from "../controllers/teacher.js";

export const teacherRouter = express.Router();

teacherRouter.post("/sort", teacherController.getAll);
teacherRouter.get("/:program_id/:document", teacherController.getbyDocument);
teacherRouter.post("/login", teacherController.getbyCredentials);
teacherRouter.post("/recovery", teacherController.getbyEmailandDocument);
teacherRouter.post("/", teacherController.post);
teacherRouter.put(
  "/:id",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  teacherController.update
);
teacherRouter.put("/state/:id", teacherController.updateState);
