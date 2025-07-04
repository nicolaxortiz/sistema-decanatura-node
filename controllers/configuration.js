import { pool } from "../db.js";

export const configurationController = {
  post: async (req, res) => {
    const {
      semester,
      start_date,
      end_date,
      campus_id,
      campus_name,
      investigacion,
      extension,
      oaca,
      oda,
      title,
      tc_hours,
      mt_hours,
    } = req.body;

    const information = campus_name.toLowerCase().replace(/\s+/g, "_") + ".js";

    try {
      const result = await pool.query(
        `
    INSERT INTO configuration (semester, start_date, end_date, information, campus_id, 
     investigacion, extension, oaca, oda, title, tc_hours,
      mt_hours)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    ON CONFLICT (campus_id) 
    DO UPDATE SET 
        semester = EXCLUDED.semester,
        start_date = EXCLUDED.start_date,
        end_date = EXCLUDED.end_date,
        investigacion = EXCLUDED.investigacion,
        extension = EXCLUDED.extension,
        oaca = EXCLUDED.oaca,
        oda = EXCLUDED.oda,
        title = EXCLUDED.title,
        tc_hours = EXCLUDED.tc_hours,
        mt_hours = EXCLUDED.mt_hours
        RETURNING *;
  `,
        [
          semester,
          start_date,
          end_date,
          information,
          campus_id,
          investigacion,
          extension,
          oaca,
          oda,
          title,
          tc_hours,
          mt_hours,
        ]
      );

      if (result.rowCount === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se pudo crear la configuración",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Configuración creada correctamente",
        configurations: result.rows[0],
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al crear la configuración: " + error.message,
      });
    }
  },

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
