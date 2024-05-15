import { Activity } from "../models/activity.js";
import { Schedule } from "../models/schedule.js";

export const scheduleController = {
  geybyIdActividades: async (req, res) => {
    let { id } = req.params;

    try {
      const schedule = await Schedule.find({ idActividades: id }).exec();

      if (schedule.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningun horario",
        });
      }

      return res.status(200).send({
        status: "success",
        schedule,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        error,
      });
    }
  },

  post: async (req, res) => {
    let scheduleObject = req.body;

    try {
      const schedule = await Schedule.create(scheduleObject);
      if (!schedule) {
        return res.status(404).send({
          status: "error",
          message: "No se pudo guardar el horario",
        });
      }

      return res.status(200).send({
        status: "success",
        message: schedule,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  },

  update: async (req, res) => {
    let { id } = req.params;
    let scheduleObject = req.body;

    try {
      const updateSchedule = await Schedule.findByIdAndUpdate(
        id,
        scheduleObject,
        { overwrite: true }
      );

      if (!updateSchedule) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningun horario",
        });
      }

      return res.status(200).send({
        status: "success",
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  },

  delete: async (req, res) => {
    let { id } = req.params;

    try {
      const deleteSchedule = await Schedule.findByIdAndDelete(id);

      if (!deleteSchedule) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningun horario",
        });
      }

      return res.status(200).send({
        status: "success",
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  },
};
