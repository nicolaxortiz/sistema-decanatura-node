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
    let { id, semester, searchName, actualPage, filter } = req.body;

    const limit = 8;
    const offset = (actualPage - 1) * limit;

    try {
      const count = await pool.query(
        `SELECT COUNT(*) as total_count 
        FROM format INNER JOIN teacher ON format.teacher_id = teacher.id 
        WHERE teacher.program_id = $1 AND format.semester = $2 AND format.is_finish = $3;`,
        [id, semester, filter]
      );

      if (count.rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún formato",
        });
      }

      let rows = [];
      if (searchName === "") {
        rows = await pool.query(
          `
          SELECT format.*, teacher.document, teacher.first_name, teacher.last_name, teacher.employment_type, teacher.campus
          FROM format
          INNER JOIN teacher ON format.teacher_id = teacher.id
          WHERE teacher.program_id = $1 AND format.semester = $2 AND format.is_finish = $3 ORDER BY id LIMIT $4 OFFSET $5;
          `,
          [id, semester, filter, limit, offset]
        );
      } else if (searchName === null && actualPage === null) {
        rows = await pool.query(
          `
          SELECT format.*, teacher.document, teacher.first_name, teacher.last_name, teacher.employment_type, teacher.campus
          FROM format
          INNER JOIN teacher ON format.teacher_id = teacher.id
          WHERE teacher.program_id = $1 AND format.semester = $2 AND format.is_coord_signed = $3 ORDER BY id;
          `,
          [id, semester, filter]
        );
      } else {
        rows = await pool.query(
          `SELECT format.*, teacher.document, teacher.first_name, teacher.last_name, teacher.employment_type, teacher.campus
        FROM format
        INNER JOIN teacher ON format.teacher_id = teacher.id
        WHERE teacher.program_id = $1 
        AND format.semester = $2 
        AND format.is_finish = $3
        AND CONCAT(teacher.first_name, ' ', teacher.last_name) ILIKE '%${searchName}%'`,
          [id, semester, filter]
        );
      }

      if (rows.rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún formato",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Formato encontrado",
        count: count.rows[0].total_count,
        format: rows.rows,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "No se ha podido listar el formato: " + error.message,
      });
    }
  },

  getSignedByProgramIdAndSemester: async (req, res) => {
    let {
      id,
      semester,
      searchName,
      actualPage,
      is_coord_signed,
      is_dean_signed,
    } = req.body;

    const limit = 8;
    const offset = (actualPage - 1) * limit;

    try {
      const count = await pool.query(
        `SELECT COUNT(*) as total_count 
        FROM format INNER JOIN teacher ON format.teacher_id = teacher.id 
        WHERE teacher.program_id = $1 AND format.semester = $2 AND format.is_coord_signed = $3;`,
        [id, semester, is_coord_signed]
      );

      if (count.rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún formato",
        });
      }

      let rows = [];
      if (searchName === "") {
        rows = await pool.query(
          `
          SELECT format.*, teacher.document, teacher.first_name, teacher.last_name, teacher.employment_type, teacher.campus
          FROM format
          INNER JOIN teacher ON format.teacher_id = teacher.id
          WHERE teacher.program_id = $1 AND format.semester = $2 AND format.is_coord_signed = $3 ORDER BY id LIMIT $4 OFFSET $5;
          `,
          [id, semester, is_coord_signed, limit, offset]
        );
      } else if (searchName === null && actualPage === null) {
        rows = await pool.query(
          `
          SELECT format.*, teacher.document, teacher.first_name, teacher.last_name, teacher.employment_type, teacher.campus
          FROM format
          INNER JOIN teacher ON format.teacher_id = teacher.id
          WHERE teacher.program_id = $1 AND format.semester = $2 AND format.is_coord_signed = $3 ORDER BY id;
          `,
          [id, semester, is_coord_signed]
        );
      } else {
        rows = await pool.query(
          `SELECT format.*, teacher.document, teacher.first_name, teacher.last_name, teacher.employment_type, teacher.campus
        FROM format
        INNER JOIN teacher ON format.teacher_id = teacher.id
        WHERE teacher.program_id = $1 
        AND format.semester = $2 
        AND format.is_coord_signed = $3
        AND CONCAT(teacher.first_name, ' ', teacher.last_name) ILIKE '%${searchName}%'`,
          [id, semester, is_coord_signed]
        );
      }

      if (rows.rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún formato",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Formato encontrado",
        count: count.rows[0].total_count,
        format: rows.rows,
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
