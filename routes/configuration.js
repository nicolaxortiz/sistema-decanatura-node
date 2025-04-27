import { configurationController } from "../controllers/configuration.js";
import express from "express";

export const configurationRouter = express.Router();

configurationRouter.get(
  "/getByProgramId/:program_id",
  configurationController.getByProgramId
);

configurationRouter.get(
  "/getByCampusId/:campus_id",
  configurationController.getByCampusId
);

configurationRouter.post("/", configurationController.post);

// configurationRouter.put("/update/:id", configurationController.update);
