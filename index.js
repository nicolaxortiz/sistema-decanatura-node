import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { teacherRouter } from "./routes/teacher.js";
import { activityRouter } from "./routes/activity.js";
import { scheduleRouter } from "./routes/schedule.js";
import { documentRouter } from "./routes/document.js";
import { configurationRouter } from "./routes/configuration.js";
import { coordinatorRouter } from "./routes/coordinator.js";
import { formatRouter } from "./routes/format.js";
import { campusRouter } from "./routes/campus.js";
import { programRouter } from "./routes/program.js";

const app = express();
const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.use("/api/images", express.static(path.join(__dirname, "utils/images")));

app.use("/api/campus", campusRouter);
app.use("/api/programa", programRouter);
app.use("/api/configuracion", configurationRouter);
app.use("/api/docentes", teacherRouter);
app.use("/api/coordinador", coordinatorRouter);
app.use("/api/actividad", activityRouter);
app.use("/api/horario", scheduleRouter);
app.use("/api/documento", documentRouter);
app.use("/api/formato", formatRouter);

app.listen(port, () => {
  console.log("servidor funcionando en el puerto " + port);
});
