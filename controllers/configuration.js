import { pool } from "../db.js";

export const configurationController = {
  getByProgramId: async (req, res) => {
    let { program_id } = req.params;
    try {
      const { rows } = await pool.query(
        "SELECT configuration.*, campus.name as campus_name, program.name as program_name FROM configuration JOIN campus ON configuration.campus_id = campus.id JOIN program ON program.campus_id = campus.id WHERE program.id = $1;",
        [program_id]
      );
      if (rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ninguna configuración",
        });
      }
      return res.status(200).send({
        status: "success",
        configurations: rows[0],
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "No se ha podido listar las configuraciones: " + error.message,
      });
    }
  },

  getByCampusId: async (req, res) => {
    let { campus_id } = req.params;
    try {
      const { rows } = await pool.query(
        "SELECT * FROM configuration WHERE campus_id = $1;",
        [campus_id]
      );
      if (rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ninguna configuración",
        });
      }
      return res.status(200).send({
        status: "success",
        configurations: rows[0],
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "No se ha podido listar las configuraciones: " + error.message,
      });
    }
  },
};
