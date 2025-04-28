import express from "express";
import {
  verifyToken,
  verifyCoordinator,
} from "../middlewares/jwt.middleware.js";
import { documentController } from "../controllers/document.js";

export const documentRouter = express.Router();

documentRouter.get(
  "/pdf/:semester/:id",
  verifyToken,
  documentController.getDocument
);

documentRouter.get(
  "/pdfFinal/:program_id/:semester/:title",
  verifyToken,
  verifyCoordinator,
  documentController.getReporte
);

documentRouter.get(
  "/pdfMission/:program_id/:semester/:mission/:title",
  verifyToken,
  verifyCoordinator,
  documentController.getReporteByMission
);
