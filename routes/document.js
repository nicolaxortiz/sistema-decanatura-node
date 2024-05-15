import express from "express";
import { documentController } from "../controllers/document.js";

export const documentRouter = express.Router();

documentRouter.get("/pdf/:id", documentController.getDocument);
documentRouter.get("/pdfFinal", documentController.getReporte);
