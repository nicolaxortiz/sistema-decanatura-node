import { Schema, model } from "mongoose";

const teacherSchema = new Schema({
  documento: { type: Number, unique: true },
  apellidos: { type: String },
  nombres: { type: String },
  foto: { type: String },
  firma: { type: String },
  tarjeta: { type: String },
  facultad: { type: String },
  unidadAcademica: { type: String },
  campus: { type: String },
  vinculacion: { type: String },
  escalafon: { type: String },
  direccion: { type: String },
  celular: { type: Number, unique: true },
  correo: { type: String, unique: true },
  contrasena: { type: String },
  pregrado: { type: String, default: "" },
  especializacion: { type: String, default: "" },
  magister: {
    type: String,
    default: "",
  },
  doctorado: {
    type: String,
    default: "",
  },
});

export const Teacher = model("Teacher", teacherSchema);
