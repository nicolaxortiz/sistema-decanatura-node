import { Activity } from "../models/activity.js";
import { Teacher } from "../models/teacher.js";

export const activityController = {
  getAll: async (req, res) => {
    try {
      const activity = await Activity.find({
        semestre: process.env.CURRENTSEMESTER,
      })
        .populate("idDocente")
        .exec();
      if (activity.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ninguna actividad",
        });
      }

      return res.status(200).send({
        status: "success",
        activity,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: error,
      });
    }
  },

  getbyIdDocente: async (req, res) => {
    let { id } = req.params;

    try {
      const activity = await Activity.find({
        idDocente: id,
      })
        .populate("idDocente")
        .exec();

      if (activity.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ninguna actividad",
        });
      }

      return res.status(200).send({
        status: "success",
        activity,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: error,
      });
    }
  },

  getbyIdDocenteAndSemester: async (req, res) => {
    let { id } = req.params;

    try {
      const activity = await Activity.find({
        idDocente: id,
        semestre: process.env.CURRENTSEMESTER,
      })
        .populate("idDocente")
        .exec();

      if (activity.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ninguna actividad",
        });
      }

      return res.status(200).send({
        status: "success",
        activity,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: error,
      });
    }
  },

  post: async (req, res) => {
    let activityObject = req.body;

    try {
      const activity = await Activity.create(activityObject);

      if (!activity) {
        return res.status(404).send({
          status: "error",
          message: "No se pudo guardar la actividad",
        });
      }

      return res.status(200).send({
        status: "success",
        activity,
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
    let activityObject = req.body;

    try {
      const updateActivity = await Activity.findByIdAndUpdate(
        id,
        activityObject,
        { new: true, overwrite: true }
      );

      if (!updateActivity) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ninguna actividad",
        });
      }

      return res.status(200).send({
        status: "success",
        activity: updateActivity,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: error,
      });
    }
  },

  delete: async (req, res) => {
    let { id } = req.params;

    try {
      const deleteActivity = await Activity.findByIdAndDelete(id);

      if (!deleteActivity) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ninguna actividad",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Actividad eliminada",
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: error,
      });
    }
  },
};
