import { pool } from "../db.js";

export const formatController = {
  getByTeacherIdAndSemester: async (req, res) => {
    let { id, semester } = req.params;

    try {
      const { rows } = await pool.query(
        "SELECT * FROM format WHERE teacher_id = $1 AND semester = $2",
        [id, semester]
      );

      if (rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún formato",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Formato encontrado",
        format: rows[0],
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "No se ha podido listar el formato: " + error.message,
      });
    }
  },

  getByProgramIdAndSemester: async (req, res) => {
    let { id, semester, actualPage } = req.params;

    const limit = 8;
    const offset = (actualPage - 1) * limit;

    try {
      const count = await pool.query(
        `SELECT COUNT(*) as total_count 
        FROM format INNER JOIN teacher ON format.teacher_id = teacher.id 
        WHERE teacher.program_id = $1 AND format.semester = $2;`,
        [id, semester]
      );

      if (count.rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún formato",
        });
      }

      const { rows } = await pool.query(
        `
        SELECT format.*, teacher.document, teacher.first_name, teacher.last_name, teacher.employment_type, teacher.campus
        FROM format
        INNER JOIN teacher ON format.teacher_id = teacher.id
        WHERE teacher.program_id = $1 AND format.semester = $2 ORDER BY id LIMIT $3 OFFSET $4;
        `,
        [id, semester, limit, offset]
      );

      if (rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún formato",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Formato encontrado",
        count: count.rows[0].total_count,
        format: rows,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "No se ha podido listar el formato: " + error.message,
      });
    }
  },

  post: async (req, res) => {
    let formatObject = req.body;

    try {
      const keys = Object.keys(formatObject);
      const values = Object.values(formatObject);

      const placeholders = keys.map((_, index) => `$${index + 1}`).join(", ");

      const query = await pool.query(
        `
      INSERT INTO format (${keys.join(", ")}) 
      VALUES (${placeholders}) 
    `,
        values
      );

      if (query.rowCount === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se pudo guardar el formato",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Formato guardado correctamente",
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
    let updateObject = req.body;

    try {
      const fields = Object.keys(updateObject);
      const values = Object.values(updateObject);

      const result = await pool.query(
        `
        UPDATE format 
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
          message: "No se encontró ningún formato",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Formato actualizado correctamente",
        updatedFormat: result.rows[0],
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al actualizar el formato: " + error.message,
      });
    }
  },
};
