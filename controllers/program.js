import { pool } from "../db.js";

export const programController = {
  getByCampusId: async (req, res) => {
    let { campus_id } = req.params;

    try {
      const { rows } = await pool.query(
        `SELECT *
        FROM program
        WHERE campus_id = $1`,
        [campus_id]
      );

      if (rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún programa",
        });
      }

      const coordinators = await pool.query(`SELECT * FROM coordinator 
        JOIN program ON coordinator.program_id = program.id  
        WHERE program.campus_id = $1`, [campus_id])



      return res.status(200).send({
        status: "success",
        programs: rows,
        coordinators: coordinators.rows
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  },

  post: async (req, res) => {
    let { name, campus_id } = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO program (name, campus_id) VALUES ($1, $2)`,
        [name, campus_id]
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
