import express from "express";
import { programController } from "../controllers/program.js";

export const programRouter = express.Router();

programRouter.get(
  "/getByCampusId/:campus_id/:actualPage",
  programController.getByCampusId
);
programRouter.get(
  "/getAllByCampusId/:campus_id",
  programController.getAllByCampusId
);
programRouter.post("/", programController.post);
programRouter.put("/:id", programController.update);
