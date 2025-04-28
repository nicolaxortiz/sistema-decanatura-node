import express from "express";
import { campusController } from "../controllers/campus.js";
import {
  verifyToken,
  verifyCoordinator,
  verifyTeacher,
  verifyAdmin,
} from "../middlewares/jwt.middleware.js";

export const campusRouter = express.Router();

campusRouter.post("/recovery", campusController.getbyEmail);
campusRouter.post("/", campusController.post);
campusRouter.put("/:id", verifyAdmin, campusController.update);
campusRouter.post("/login", campusController.getByCredential);
