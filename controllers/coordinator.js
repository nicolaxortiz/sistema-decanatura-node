import { pool } from "../db.js";
import {
  encryptPassword,
  compare,
  generatePassword,
} from "../utils/encrypt.js";
import { uploadFile } from "../utils/uploadFiles.js";

export const coordinatorController = {
  post: async (req, res) => {
    const { document, first_name, last_name, email, program_id } = req.body;
    const initialPassword = await encryptPassword(document.toString());

    try {
      const query = await pool.query(
        "INSERT INTO coordinator (document, first_name, last_name, email, password, program_id) VALUES ($1, $2, $3, $4, $5, $6)",
        [document, first_name, last_name, email, initialPassword, program_id]
      );

      if (query.rowCount === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se pudo crear el coordinador",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Coordinador creado correctamente",
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al crear al coordinador: " + error.message,
      });
    }
  },

  getByCredential: async (req, res) => {
    let { email, password } = req.body;

    try {
      const { rows } = await pool.query(
        "SELECT * FROM coordinator WHERE email = $1",
        [email]
      );

      if (rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún usuario con ese email y contraseña",
        });
      }

      try {
        let verification = await compare(password, rows[0].password);
        if (verification) {
          // La contraseña es válida
          return res.status(200).send({
            status: "success",
            coordinator: rows[0],
          });
        } else {
          // La contraseña es inválida
          return res.status(404).send({
            status: "error",
            message:
              "No se encontró ningún usuario con ese documento y contraseña",
          });
        }
      } catch (error) {
        return res.status(500).send({
          status: "error",
          message: error.message,
        });
      }
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  },

  getByCampusId: async (req, res) => {
    let { campus_id } = req.params;

    try {
      const { rows } = await pool.query(
        `SELECT 
        c.id AS coordinator_id,
        c.document,
        c.first_name,
        c.last_name,
        c.email,
        c.signature,
        p.id AS program_id,
        p.name AS program_name
        FROM Coordinator c
        JOIN Program p ON c.program_id = p.id
        WHERE p.campus_id = $1;`,
        [campus_id]
      );

      if (rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún coordinador",
        });
      }

      return res.status(200).send({
        status: "success",
        coordinators: rows,
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
    const signaturePic = req.files?.signature;

    try {
      if (signaturePic && signaturePic.length > 0) {
        const downloadURL1 = await uploadFile(signaturePic[0], id, "signature");
        updateObject.signature = downloadURL1;
      }

      if (updateObject.password) {
        updateObject.password = await encryptPassword(updateObject.password);
      }

      const fields = Object.keys(updateObject);
      const values = Object.values(updateObject);

      const result = await pool.query(
        `
          UPDATE coordinator 
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
          message: "No se encontró ningún coordinador",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Coordinador actualizado correctamente",
        updatedTeacher: result.rows[0],
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al actualizar el coordinador: " + error.message,
      });
    }
  },
};
