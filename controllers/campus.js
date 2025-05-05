import { pool } from "../db.js";
import jwt from "jsonwebtoken";
import {
  encryptPassword,
  compare,
  generatePassword,
} from "../utils/encrypt.js";
import { transporter } from "../config/nodemailer.js";

export const campusController = {
  post: async (req, res) => {
    let { name, email, password } = req.body;

    const initialPassword = await encryptPassword(password);

    try {
      const query = await pool.query(
        `INSERT INTO campus (name, email, password) VALUES ($1, $2, $3)`,
        [name, email, initialPassword]
      );

      if (query.rowCount === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se pudo guardar el campus",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Campus registrado correctamente",
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al guardar el campus: " + error.message,
      });
    }
  },

  getByCredential: async (req, res) => {
    let { email, password } = req.body;

    try {
      const { rows } = await pool.query(
        "SELECT * FROM campus WHERE email = $1",
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
            campus: rest,
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
        "SELECT * FROM campus WHERE email = $1",
        [email]
      );

      if (rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún campus con ese correo electrónico",
        });
      }

      const NewPassword = await generatePassword();
      const encryptNewPassword = await encryptPassword(NewPassword);

      const updateResult = await pool.query(
        `UPDATE campus SET password = $1 WHERE email = $2`,
        [encryptNewPassword, email]
      );

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Cambio de contraseña",
        text: `Estimado usuario,
      
      Se le notifica que su nueva contraseña es: ${NewPassword}
      
      En caso de persistir problemas con la contraseña, se solicita acudir a la coordinación correspondiente para gestionar la revisión de la cuenta. Además, se aconseja no mantener activa la contraseña temporal y proceder a cambiarla a la mayor brevedad posible.
      
      Atentamente,
      Sistema de informe docente F-DC-54`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Cambio de contraseña</h2>
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

  update: async (req, res) => {
    let { id } = req.params;
    let campusObject = req.body;

    try {
      if (campusObject.password) {
        campusObject.password = await encryptPassword(campusObject.password);
      }

      const fields = Object.keys(campusObject);
      const values = Object.values(campusObject);

      const result = await pool.query(
        `
      UPDATE campus 
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
          message: "No se encontró ningún campus",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Campus actualizado correctamente",
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al actualizar el campus" + error.message,
      });
    }
  },
};
