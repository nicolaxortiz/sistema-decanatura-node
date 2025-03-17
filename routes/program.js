import express from "express";
import { programController } from "../controllers/program.js";

export const programRouter = express.Router();

programRouter.get(
  "/getByCampusId/:campus_id/:actualPage",
  programController.getByCampusId
);
programRouter.post("/", programController.post);
programRouter.put("/:id", programController.update);
