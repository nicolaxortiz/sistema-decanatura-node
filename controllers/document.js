import pkg from "../utils/documentPDF.cjs";
const generatePDF = pkg;
import pkg1 from "../utils/reportePDF.cjs";
const reportePDF = pkg1;
import { Teacher } from "../models/teacher.js";
import { Activity } from "../models/activity.js";
import { Schedule } from "../models/schedule.js";

export const documentController = {
  getDocument: async (req, res) => {
    let { id } = req.params;
    try {
      const teacher = await Teacher.findById(id).exec();

      if (!teacher) {
        return res.status(404).send({
          status: "error",
          message: "No se encontro ningun usuario",
        });
      }

      const activity = await Activity.findOne({
        idDocente: teacher._id,
        semestre: process.env.CURRENTSEMESTER,
      }).exec();

      if (!activity) {
        return res.status(404).send({
          status: "error",
          message: "No se encontro ninguna actividad del semestre actual",
        });
      }

      const schedule = await Schedule.findOne({
        idActividades: activity._id,
      }).exec();

      if (!schedule) {
        return res.status(404).send({
          status: "error",
          message: "No se encontro ningun horario del semestre actual",
        });
      }

      generatePDF({
        res,
        userData: teacher,
        activityData: activity,
        scheduleData: schedule,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        error: error.message,
      });
    }
  },

  getReporte: async (req, res) => {
    try {
      const activity = await Activity.find({
        semestre: process.env.CURRENTSEMESTER,
      })
        .populate("idDocente")
        .exec();

      if (!activity) {
        return res.status(404).send({
          status: "error",
          message: "No se encontro ninguna actividad del semestre actual",
        });
      }

      reportePDF({
        res,
        activityData: activity,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        error: error,
      });
    }
  },
};
