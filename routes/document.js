import express from "express";
import { documentController } from "../controllers/document.js";

export const documentRouter = express.Router();

documentRouter.get("/pdf/:semester/:id", documentController.getDocument);
documentRouter.get(
  "/pdfFinal/:program_id/:semester/:title",
  documentController.getReporte
);

documentRouter.get(
  "/pdfMission/:program_id/:semester/:mission/:title",
  documentController.getReporteByMission
);
