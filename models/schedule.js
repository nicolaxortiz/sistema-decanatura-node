import mongoose, { Schema, model } from "mongoose";

let scheduleSchema = new Schema({
  idActividades: { type: mongoose.Schema.Types.ObjectId, required: true },
  observacion: { type: String, default: "" },
  horas: [
    {
      actividad: { type: String, required: true },
      clasificacion: { type: String, required: true },
      registro: [
        {
          dia: { type: String, required: true },
          momento: { type: Number, required: true },
        },
      ],
    },
  ],
});

export const Schedule = model("Schedule", scheduleSchema);
