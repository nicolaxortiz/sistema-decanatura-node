import { pool } from "../db.js";
import jwt from "jsonwebtoken";
import {
  encryptPassword,
  compare,
  generatePassword,
} from "../utils/encrypt.js";
import { transporter } from "../config/nodemailer.js";
import getPath from "../utils/downloadImage.cjs";
const downloadImage = getPath;

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
      if (error.code === "23505") {
        return res.status(409).send({
          status: "error",
          message:
            "Ya existe un coordinador con ese documento, email o programa",
        });
      }
      return res.status(500).send({
        status: "error",
        message: "Error al crear el coordinador: " + error.message,
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
          const token = jwt.sign(
            { email, role: rows[0].role },
            process.env.JWT_SECRET,
            {
              expiresIn: "1h",
            }
          );

          const { password, ...rest } = rows[0];
          return res.status(200).send({
            status: "success",
            coordinator: rest,
            token,
          });
        } else {
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

  getbyEmail: async (req, res) => {
    let { email } = req.body;

    try {
      const { rows } = await pool.query(
        "SELECT * FROM coordinator WHERE email = $1",
        [email]
      );

      if (rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message:
            "No se encontró ningún coordinador con ese correo electrónico",
        });
      }

      const NewPassword = await generatePassword();
      const encryptNewPassword = await encryptPassword(NewPassword);

      const updateResult = await pool.query(
        `UPDATE coordinator SET password = $1 WHERE email = $2`,
        [encryptNewPassword, email]
      );

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Recuperación de contraseña",
        text: `Estimado usuario,
      
      Se le notifica que su nueva contraseña es: ${NewPassword}
      
      En caso de persistir problemas con la contraseña, se solicita acudir a la coordinación correspondiente para gestionar la revisión de la cuenta. Además, se aconseja no mantener activa la contraseña temporal y proceder a cambiarla a la mayor brevedad posible.
      
      Atentamente,
      Sistema de informe docente F-DC-54`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Recuperación de contraseña</h2>
            <p>Estimado usuario,</p>
            <p>Se le notifica que su nueva contraseña es: <strong>${NewPassword}</strong></p>
            <p>En caso de persistir problemas con la contraseña, se solicita acudir a la coordinación correspondiente para gestionar la revisión de la cuenta.</p>
            <p>Además, se aconseja no mantener activa la contraseña temporal y proceder a cambiarla a la mayor brevedad posible.</p>
            <p>Atentamente,<br><strong>Sistema de informe docente F-DC-54</strong></p>
            <hr>
            <p style="font-size: 12px; color: #777;">
              Este es un mensaje automático, por favor no responda directamente a este correo.
            </p>
          </div>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(404).send({
            status: "error",
            message: "Error en el envío: " + error,
          });
        } else {
          return res.status(200).send({
            status: "success",
            message: "Correo enviado correctamente",
          });
        }
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
        `SELECT COUNT(*) as total_count 
        FROM coordinator
        JOIN program ON coordinator.program_id = program.id
        WHERE program.campus_id = $1;`,
        [campus_id]
      );

      if (count.rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún coordinador",
        });
      }

      const { rows } = await pool.query(
        `SELECT 
        coordinator.id AS coordinator_id,
        coordinator.document,
        coordinator.first_name,
        coordinator.last_name,
        coordinator.email,
        program.id AS program_id,
        program.name AS program_name
        FROM coordinator
        JOIN program ON coordinator.program_id = program.id
        WHERE program.campus_id = $1 
        ORDER BY coordinator.id LIMIT $2 OFFSET $3;`,
        [campus_id, limit, offset]
      );

      if (rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún coordinador",
        });
      }

      return res.status(200).send({
        status: "success",
        count: count.rows[0].total_count,
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
      const response = await pool.query(
        "SELECT document, email FROM coordinator where id = $1",
        [id]
      );
      if (response.rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún coordinador",
        });
      }
      const document = response.rows[0].document;
      const email = response.rows[0].email;

      if (signaturePic && signaturePic.length > 0) {
        await downloadImage(document, signaturePic[0], "firma");
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

      if (updateObject.password) {
        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Cambio de contraseña",
          text: `Estimado usuario,
      
      Se le notifica que su contraseña ha sido cambiada exitosamente.
      
      En caso de que no haya solicitado este cambio, se recomienda acudir a la coordinación correspondiente para gestionar la revisión de la cuenta. 
      
      Atentamente,
      Sistema de informe docente F-DC-54`,
          html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Cambio de contraseña</h2>
            <p>Estimado usuario,</p>
            <p>Se le notifica que su contraseña ha sido cambiada exitosamente.</p>
            <p>En caso de que no haya solicitado este cambio, se recomienda acudir a la coordinación correspondiente para gestionar la revisión de la cuenta.</p>
            <p>Atentamente,<br><strong>Sistema de informe docente F-DC-54</strong></p>
            <hr>
            <p style="font-size: 12px; color: #777;">
              Este es un mensaje automático, por favor no responda directamente a este correo.
            </p>
          </div>
        `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res.status(404).send({
              status: "error",
              message: "Error en el envío: " + error,
            });
          } else {
            return res.status(200).send({
              status: "success",
              message: "Correo enviado correctamente",
            });
          }
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Coordinador actualizado correctamente",
        updatedCoordinator: result.rows[0],
      });
    } catch (error) {
      if (error.code === "23505") {
        return res.status(409).send({
          status: "error",
          message:
            "Ya existe un coordinador con ese documento, email o programa",
        });
      }

      return res.status(500).send({
        status: "error",
        message: "Error al actualizar el coordinador: " + error.message,
      });
    }
  },
};
