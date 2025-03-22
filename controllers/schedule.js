import { Activity } from "../models/activity.js";
import { Schedule } from "../models/schedule.js";
import { pool } from "../db.js";

export const scheduleController = {
  post: async (req, res) => {
    let scheduleObject = req.body;

    try {
      const keys = Object.keys(scheduleObject);
      const values = Object.values(scheduleObject);

      const placeholders = keys.map((_, index) => `$${index + 1}`).join(", ");

      const query = await pool.query(
        `
      INSERT INTO schedule (${keys.join(", ")}) 
      VALUES (${placeholders}) 
    `,
        values
      );

      if (query.rowCount === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se pudo guardar el horario",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Horario guardado correctamente",
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  },

  geybyTeacherIdAndSemester: async (req, res) => {
    let { id, semester } = req.params;

    try {
      const { rows } = await pool.query(
        "SELECT * FROM schedule WHERE teacher_id = $1 AND semester = $2 ORDER BY id ASC",
        [id, semester]
      );

      if (rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún horario",
        });
      }

      return res.status(200).send({
        status: "success",
        schedule: rows,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al listar los horarios: " + error.message,
      });
    }
  },

  update: async (req, res) => {
    let { id } = req.params;
    let updateObject = req.body;

    try {
      const fields = Object.keys(updateObject);
      const values = Object.values(updateObject);

      const result = await pool.query(
        `
             UPDATE schedule 
             SET ${fields
               .map((field, index) => `"${field}" = $${index + 1}`)
               .join(", ")}
             WHERE id = $${fields.length + 1}
             RETURNING *
           `,
        [...values, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún horario",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Horario actualizado correctamente",
        updatedSchedule: result.rows[0],
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al actualizar el horario: " + error.message,
      });
    }
  },

  delete: async (req, res) => {
    let { teacher_id, semester, day, moment } = req.params;

    try {
      const result = await pool.query(
        "DELETE FROM schedule WHERE teacher_id = $1 AND semester = $2 AND day = $3 AND moment = $4",
        [teacher_id, semester, day, moment]
      );

      if (result.rowCount === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún horario",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Horario eliminado correctamente",
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al eliminar el horario: " + error.message,
      });
    }
  },

  deleteAll: async (req, res) => {
    let { teacher_id, semester } = req.params;

    try {
      const result = await pool.query(
        "DELETE FROM schedule WHERE teacher_id = $1 AND semester = $2",
        [teacher_id, semester]
      );

      if (result.rowCount === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún horario",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Horario eliminado correctamente",
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al eliminar el horario: " + error.message,
      });
    }
  },
};
