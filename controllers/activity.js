import { Activity } from "../models/activity.js";
import { pool } from "../db.js";

export const activityController = {
  // getAll: async (req, res) => {
  //   let { program_id, semester } = req.params;

  //   try {
  //     const { rows } = await pool.query(
  //       "SELECT * FROM activity JOIN teacher ON activity.teacher_id = teacher.id JOIN program ON teacher.program_id = program.id WHERE program.id = $1 AND activity.semester = $2",
  //       [program_id, semester]
  //     );

  //     if (rows.length === 0) {
  //       return res.status(404).send({
  //         status: "error",
  //         message: "No se encontró ninguna actividad",
  //       });
  //     }

  //     return res.status(200).send({
  //       status: "success",
  //       activity: rows,
  //     });
  //   } catch (error) {
  //     return res.status(500).send({
  //       status: "error",
  //       message: "Error al listar las actividades: " + error.message,
  //     });
  //   }
  // },

  // getbyIdDocente: async (req, res) => {
  //   let { id } = req.params;

  //   try {
  //     const { rows } = await pool.query(
  //       "SELECT * FROM activity WHERE teacher_id = $1",
  //       [id]
  //     );

  //     if (rows.length === 0) {
  //       return res.status(404).send({
  //         status: "error",
  //         message: "No se encontró ninguna actividad",
  //       });
  //     }

  //     return res.status(200).send({
  //       status: "success",
  //       activities: rows,
  //     });
  //   } catch (error) {
  //     return res.status(500).send({
  //       status: "error",
  //       message: "Error al buscar las actividades: " + error,
  //     });
  //   }
  // },

  getbyIdDocenteAndSemester: async (req, res) => {
    let { id, semester } = req.params;

    try {
      const { rows } = await pool.query(
        "SELECT * FROM activity WHERE teacher_id = $1 AND semester = $2 ORDER BY id ASC",
        [id, semester]
      );

      if (rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ninguna actividad",
        });
      }

      return res.status(200).send({
        status: "success",
        activities: rows,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  },

  post: async (req, res) => {
    let activityObject = req.body;

    try {
      const keys = Object.keys(activityObject);
      const values = Object.values(activityObject);

      const placeholders = keys.map((_, index) => `$${index + 1}`).join(", ");

      const query = await pool.query(
        `
      INSERT INTO activity (${keys.join(", ")}) 
      VALUES (${placeholders}) 
    `,
        values
      );

      if (query.rowCount === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se pudo guardar la actividad",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Actividad guardada correctamente",
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al guardar la actividad: " + error.message,
      });
    }
  },

  update: async (req, res) => {
    let { id } = req.params;
    let activityObject = req.body;

    try {
      const fields = Object.keys(activityObject);
      const values = Object.values(activityObject);

      const result = await pool.query(
        `
      UPDATE activity 
      SET ${fields
        .map((field, index) => `"${field}" = $${index + 1}`)
        .join(", ")}
      WHERE id = $${fields.length + 1}
    `,
        [...values, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ninguna actividad",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Actividad actualizada correctamente",
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al actualizar la actividad" + error.message,
      });
    }
  },

  delete: async (req, res) => {
    let { id } = req.params;

    try {
      const result = await pool.query("DELETE FROM activity WHERE id = $1", [
        id,
      ]);

      if (result.rowCount === 0) {
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
        message: "Error al eliminar la actividad: " + error,
      });
    }
  },
};
