import express from "express";
import { upload } from "../config/multer.js";
import { teacherController } from "../controllers/teacher.js";

export const teacherRouter = express.Router();

teacherRouter.get("/:filter", teacherController.get);
teacherRouter.get("/:document", teacherController.getbyDocument);
teacherRouter.post("/login", teacherController.getbyCredentials);
teacherRouter.post("/recovery", teacherController.getbyEmailandDocument);
teacherRouter.post("/", teacherController.initialPost);
teacherRouter.post(
  "/save",
  upload.fields([
    { name: "foto", maxCount: 1 },
    { name: "firma", maxCount: 1 },
  ]),
  teacherController.post
);
teacherRouter.put(
  "/:id",
  upload.fields([
    { name: "foto", maxCount: 1 },
    { name: "firma", maxCount: 1 },
  ]),
  teacherController.update
);
teacherRouter.put("/state/:id", teacherController.updateState);
