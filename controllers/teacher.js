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

export const teacherController = {
  getAll: async (req, res) => {
    let { program_id, filter, name, page } = req.body;

    const limit = 8;
    const offset = (page - 1) * limit;

    try {
      const count = await pool.query(
        "SELECT COUNT(*) as total_count FROM teacher WHERE is_active = $1 and program_id = $2;",
        [filter, program_id]
      );

      if (count.rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún docente",
        });
      }

      let rows = [];
      if (name === "") {
        rows = await pool.query(
          "SELECT teacher.id, teacher.first_name, teacher.last_name, teacher.faculty, teacher.campus, teacher.program_name, teacher.employment_type, teacher.is_active FROM teacher WHERE is_active = $1 and program_id = $2 ORDER BY id LIMIT $3 OFFSET $4;",
          [filter, program_id, limit, offset]
        );
      } else {
        rows = await pool.query(
          `SELECT teacher.id, teacher.first_name, teacher.last_name, teacher.faculty, teacher.campus, teacher.program_name, teacher.employment_type, teacher.is_active FROM teacher WHERE is_active = $1 and program_id = $2 AND CONCAT(first_name, ' ', last_name) ILIKE '%${name}%'`,
          [filter, program_id]
        );
      }

      if (rows.rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún docente",
        });
      }
      return res.status(200).send({
        status: "success",
        count: count.rows[0].total_count,
        teachers: rows.rows,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "No se ha podido listar los docentes: " + error.message,
      });
    }
  },

  getbyDocument: async (req, res) => {
    let { program_id, document } = req.params;

    try {
      const { rows } = await pool.query(
        "SELECT * FROM teacher WHERE document = $1 and program_id = $2",
        [document, program_id]
      );
      if (rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún docente",
        });
      }
      return res.status(200).send({
        status: "success",
        teacher: rows[0],
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "No se ha podido listar al docente: " + error.message,
      });
    }
  },

  getbyCredentials: async (req, res) => {
    let { email, password } = req.body;

    try {
      const { rows } = await pool.query(
        "SELECT * FROM teacher WHERE email = $1",
        [email]
      );

      if (rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún usuario con ese email y contraseña",
        });
      }

      if (rows[0].is_active === false) {
        return res.status(401).send({
          status: "error",
          message: "El docente se encuentra en estado inactivo",
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
            teacher: rest,
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
        "SELECT * FROM teacher WHERE email = $1",
        [email]
      );

      if (rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún docente con ese correo electrónico",
        });
      }

      const NewPassword = await generatePassword();
      const encryptNewPassword = await encryptPassword(NewPassword);

      const updateResult = await pool.query(
        `UPDATE teacher SET password = $1 WHERE email = $2`,
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

  post: async (req, res) => {
    const {
      document,
      first_name,
      last_name,
      email,
      campus,
      program_name,
      program_id,
    } = req.body;
    const initialPassword = await encryptPassword(document.toString());

    try {
      const query = await pool.query(
        "INSERT INTO teacher (document, first_name, last_name, email, campus, program_name, program_id, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        [
          document,
          first_name,
          last_name,
          email,
          campus,
          program_name,
          program_id,
          initialPassword,
        ]
      );

      if (query.rowCount === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se pudo crear el docente",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Docente creado correctamente",
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al crear al docente: " + error.message,
      });
    }
  },

  update: async (req, res) => {
    let { id } = req.params;
    let updateObject = req.body;
    const personalPic = req.files?.photo;
    const signaturePic = req.files?.signature;

    try {
      const response = await pool.query(
        "SELECT document FROM teacher where id = $1",
        [id]
      );
      if (response.rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún docente",
        });
      }
      const document = response.rows[0].document;

      if (
        personalPic &&
        signaturePic &&
        personalPic.length > 0 &&
        signaturePic.length > 0
      ) {
        await downloadImage(document, personalPic[0], "foto");
        await downloadImage(document, signaturePic[0], "firma");
      } else if (personalPic && personalPic.length > 0) {
        await downloadImage(document, personalPic[0], "foto");
      } else if (signaturePic && signaturePic.length > 0) {
        await downloadImage(document, signaturePic[0], "firma");
      }

      if (updateObject.password) {
        updateObject.password = await encryptPassword(updateObject.password);
      }

      const fields = Object.keys(updateObject);
      const values = Object.values(updateObject);

      const result = await pool.query(
        `
      UPDATE teacher 
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
          message: "No se encontró ningún docente",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Docente actualizado correctamente",
        updatedTeacher: result.rows[0],
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al actualizar el docente: " + error.message,
      });
    }
  },

  updateState: async (req, res) => {
    let { id } = req.params;
    let { is_active } = req.body;

    try {
      const result = await pool.query(
        "UPDATE teacher SET is_active = $1 WHERE id = $2",
        [is_active, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún docente",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Estado del docente actualizado correctamente",
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al actualizar el estado: " + error.message,
      });
    }
  },
};
