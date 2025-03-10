import express from "express";
import { campusController } from "../controllers/campus.js";

export const campusRouter = express.Router();

campusRouter.post("/", campusController.post);
campusRouter.put("/:id", campusController.update);
campusRouter.post("/login", campusController.getByCredential);
