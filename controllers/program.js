import { pool } from "../db.js";

export const programController = {
  getById: async (req, res) => {
    let { id } = req.params;

    try {
      const { rows } = await pool.query(
        `SELECT 
        program.id AS program_id,
        program.name AS program_name,
        program.faculty AS program_faculty,
        coordinator.first_name AS coordinator_first_name,
        coordinator.last_name AS coordinator_last_name
        FROM program 
        LEFT JOIN coordinator ON program.id = coordinator.program_id
        WHERE program.id = $1;`,
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún programa",
        });
      }

      return res.status(200).send({
        status: "success",
        program: rows[0],
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  },

  getByCampusId: async (req, res) => {
    let { campus_id, actualPage } = req.params;

    const limit = 8;
    const offset = (actualPage - 1) * limit;

    try {
      const count = await pool.query(
        `SELECT COUNT(DISTINCT program.id) AS total_count 
        FROM program 
        LEFT JOIN coordinator ON program.id = coordinator.program_id
        WHERE program.campus_id = $1;`,
        [campus_id]
      );

      if (count.rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún formato",
        });
      }

      const { rows } = await pool.query(
        `SELECT 
        program.id AS program_id,
        program.name AS program_name,
        program.faculty AS program_faculty,
        coordinator.first_name AS coordinator_first_name,
        coordinator.last_name AS coordinator_last_name
        FROM program 
        LEFT JOIN coordinator ON program.id = coordinator.program_id
        WHERE program.campus_id = $1 ORDER BY program.id LIMIT $2 OFFSET $3;`,
        [campus_id, limit, offset]
      );

      if (rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún programa",
        });
      }

      return res.status(200).send({
        status: "success",
        count: count.rows[0].total_count,
        programs: rows,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  },

  getAllByCampusId: async (req, res) => {
    let { campus_id } = req.params;

    try {
      const { rows } = await pool.query(
        `SELECT 
        program.id AS program_id,
        program.name AS program_name
        FROM program
        LEFT JOIN coordinator ON program.id = coordinator.program_id
        WHERE program.campus_id = $1;`,
        [campus_id]
      );

      if (rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún programa",
        });
      }

      return res.status(200).send({
        status: "success",
        programs: rows,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  },

  getByFacultyAndCampusId: async (req, res) => {
    let { campus_id, faculty } = req.params;

    try {
      const { rows } = await pool.query(
        `SELECT 
        id,
        name 
        FROM program
        WHERE campus_id = $1 AND faculty = $2;`,
        [campus_id, faculty]
      );

      if (rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún programa",
        });
      }

      return res.status(200).send({
        status: "success",
        programs: rows,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  },

  post: async (req, res) => {
    let { name, faculty, campus_id } = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO program (name, faculty, campus_id) VALUES ($1, $2, $3)`,
        [name, faculty, campus_id]
      );

      if (result.rowCount === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se pudo registrar el programa",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Programa registrado correctamente",
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al guardar el programa: " + error.message,
      });
    }
  },

  update: async (req, res) => {
    let { id } = req.params;
    let programObject = req.body;

    try {
      const fields = Object.keys(programObject);
      const values = Object.values(programObject);

      const result = await pool.query(
        `
          UPDATE program 
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
          message: "No se encontró ningún programa",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Programa actualizado correctamente",
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al actualizar el programa" + error.message,
      });
    }
  },
};
