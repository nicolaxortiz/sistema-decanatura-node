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
  "/pdf/:semester/:id/:mission",
  verifyToken,
  documentController.getDocumentByMission
);

documentRouter.get(
  "/pdfFinal/:program_id/:semester/:title",
  verifyToken,
  documentController.getReporte
);

documentRouter.get(
  "/pdfMission/:program_id/:semester/:mission/:title",
  verifyToken,
  documentController.getReporteByMission
);
