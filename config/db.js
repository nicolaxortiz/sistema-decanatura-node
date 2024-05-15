import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const urlConnection = process.env.URL_DB;

export async function connectDB() {
  mongoose.Promise = global.Promise;

  try {
    await mongoose.connect(urlConnection);
    console.log("Conexión exitosa a la base de datos");
  } catch (error) {
    console.log(error);
  }
}
