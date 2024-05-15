import express from "express";
import bodyParser from "body-parser";
import { connectDB } from "./config/db.js";
import { teacherRouter } from "./routes/teacher.js";
import { activityRouter } from "./routes/activity.js";
import { scheduleRouter } from "./routes/schedule.js";
import { documentRouter } from "./routes/document.js";

const db = connectDB();
const app = express();
const port = process.env.PORT;

//Body-parser para analizar el body de la peticion a traves de la url
app.use(bodyParser.urlencoded({ extended: false }));

//convertimos la peticion en un JSON
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use("/api/docentes", teacherRouter);
app.use("/api/actividad", activityRouter);
app.use("/api/horario", scheduleRouter);
app.use("/api/documento", documentRouter);

app.listen(port, () => {
  console.log("servidor funcionando en el puerto " + port);
});
