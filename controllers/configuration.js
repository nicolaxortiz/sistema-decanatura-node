import { pool } from "../db.js";

export const configurationController = {
  post: async (req, res) => {
    const {
      semester,
      start_date,
      end_date,
      campus_id,
      campus_name,
      docencia,
      investigacion,
      extension,
      oaca,
      oda,
      comites,
      otras,
      title,
      tc_hours,
      mt_hours,
    } = req.body;

    const information =
      campus_name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") + ".json";

    try {
      const result = await pool.query(
        `
    INSERT INTO configuration (semester, start_date, end_date, information, campus_id, 
    docencia, investigacion, extension, oaca, oda, comites, otras, title, tc_hours,
      mt_hours)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    ON CONFLICT (campus_id) 
    DO UPDATE SET 
        semester = EXCLUDED.semester,
        start_date = EXCLUDED.start_date,
        end_date = EXCLUDED.end_date,
        docencia = EXCLUDED.docencia,
        investigacion = EXCLUDED.investigacion,
        extension = EXCLUDED.extension,
        oaca = EXCLUDED.oaca,
        oda = EXCLUDED.oda,
        comites = EXCLUDED.comites,
        otras = EXCLUDED.otras,
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
          docencia,
          investigacion,
          extension,
          oaca,
          oda,
          comites,
          otras,
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

  update: async (req, res) => {
    let { id } = req.params;
    let configurationObject = req.body;

    try {
      const fields = Object.keys(configurationObject);
      const values = Object.values(configurationObject);

      const result = await pool.query(
        `
        UPDATE configuration SET ${fields.map(
          (field, index) => `${field} = $${index + 1}`
        )} WHERE id = $${fields.length + 1};
        `,
        [...values, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se pudo actualizar la configuración",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Configuración actualizada correctamente",
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al actualizar la configuración: " + error.message,
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
