import { configurationController } from "../controllers/configuration.js";
import { verifyToken, verifyAdmin } from "../middlewares/jwt.middleware.js";
import express from "express";

export const configurationRouter = express.Router();

configurationRouter.get(
  "/getByProgramId/:program_id",
  verifyToken,
  configurationController.getByProgramId
);

configurationRouter.get(
  "/getByCampusId/:campus_id",
  verifyToken,
  configurationController.getByCampusId
);

configurationRouter.post(
  "/",
  verifyToken,
  verifyAdmin,
  configurationController.post
);

// configurationRouter.put("/update/:id", configurationController.update);
