import mongoose, { Schema, model } from "mongoose";

const activitySchema = new Schema({
  idDocente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  semestre: { type: String, required: true },
  actividad: [
    {
      nombre: { type: String, required: true },
      misional: { type: String, required: true },
      convencion: { type: String, required: true },
      descripcion: { type: String, required: true },
      grupo: { type: String },
      horas: { type: Number, required: true },
      responsable: { type: String, default: "Ing Yezid Yair García" },
      producto: {
        descripcion: { type: String, default: "" },
        fechaEstimada: { type: String, default: null },
        fechaReal: { type: String, default: null },
        comentario: { type: String, default: "" },
      },
    },
  ],
});

export const Activity = model("Activity", activitySchema);
