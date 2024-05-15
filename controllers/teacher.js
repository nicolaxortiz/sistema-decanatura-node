import { Teacher } from "../models/teacher.js";
import { uploadFile } from "../utils/uploadFiles.js";
import {
  encryptPassword,
  compare,
  generatePassword,
} from "../utils/encrypt.js";
import { transporter } from "../config/nodemailer.js";

export const teacherController = {
  get: async (req, res) => {
    try {
      const teachers = await Teacher.find({});
      if (teachers.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún docente",
        });
      }
      return res.status(200).send({
        status: "success",
        teachers,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "No se ha podido listar los docentes",
      });
    }
  },

  getbyDocument: async (req, res) => {
    let { document } = req.params;

    try {
      const teachers = await Teacher.find({ documento: document });
      if (teachers.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún docente",
        });
      }
      return res.status(200).send({
        status: "success",
        teachers,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "No se ha podido listar al docente",
      });
    }
  },

  getbyCredentials: async (req, res) => {
    let { documento, contrasena } = req.body;

    try {
      const teacher = await Teacher.findOne({ documento }).exec();

      if (!teacher) {
        return res.status(404).send({
          status: "error",
          message:
            "No se encontró ningún docente con ese documento y contraseña",
        });
      }

      try {
        let verification = await compare(contrasena, teacher.contrasena);
        if (verification) {
          // La contraseña es válida
          return res.status(200).send({
            status: "success",
            teacher,
          });
        } else {
          // La contraseña es inválida
          return res.status(404).send({
            status: "error",
            message:
              "No se encontró ningún docente con ese documento y contraseña",
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

  getbyEmailandDocument: async (req, res) => {
    let { correo, documento } = req.body;

    try {
      const NewPassword = await generatePassword();

      const changeTeacher = await Teacher.findOneAndUpdate(
        { correo: correo, documento: documento },
        { contrasena: await encryptPassword(NewPassword) }
      ).exec();

      if (!changeTeacher) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún docente con ese documento y correo",
        });
      }

      const mailOptions = {
        from: "carturotoloza@uts.edu.co",
        to: correo,
        subject: "Cambio de contraseña",
        text: "Se le notifica que su nueva contraseña es: " + NewPassword,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(404).send({
            status: "error",
            message: "Error en el envio: " + error,
          });
        } else {
          return res.status(200).send({
            status: "success",
            message: "Correo enviado",
            Teacher: changeTeacher,
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
    const body = req.body;
    const personalPic = req.files.foto;
    const signaturePic = req.files.firma;
    try {
      if (
        personalPic &&
        signaturePic &&
        personalPic.length > 0 &&
        signaturePic.length > 0
      ) {
        const downloadURL1 = await uploadFile(personalPic[0]);
        const downloadURL2 = await uploadFile(signaturePic[0]);

        const newTeacher = await new Teacher({
          documento: body.documento,
          apellidos: body.apellidos,
          nombres: body.nombres,
          foto: downloadURL1,
          firma: downloadURL2,
          tarjeta: body.tarjeta,
          facultad: body.facultad,
          unidadAcademica: body.unidadAcademica,
          campus: body.campus,
          vinculacion: body.vinculacion,
          escalafon: body.escalafon,
          direccion: body.direccion,
          celular: body.celular,
          correo: body.correo,
          contrasena: await encryptPassword(body.documento.toString()),
          pregrado: body.pregrado,
          especializacion: body.especializacion,
          magister: body.magister,
          doctorado: body.doctorado,
        }).save();

        return res.status(200).json({ newTeacher });
      }
    } catch (error) {
      return res.status(500).json({ status: "Error", message: error.message });
    }
  },

  initialPost: async (req, res) => {
    const body = req.body;

    try {
      const newTeacher = await new Teacher({
        documento: body.documento,
        celular: body.celular,
        correo: body.correo,
        contrasena: await encryptPassword(body.documento.toString()),
      }).save();

      return res.status(200).json({ newTeacher });
    } catch (error) {
      return res.status(500).json({ status: "Error", message: error.message });
    }
  },

  update: async (req, res) => {
    let { id } = req.params;
    let updateObject = req.body;
    const personalPic = req.files?.foto;
    const signaturePic = req.files?.firma;
    console.log(updateObject);

    try {
      if (
        personalPic &&
        signaturePic &&
        personalPic.length > 0 &&
        signaturePic.length > 0
      ) {
        const downloadURL1 = await uploadFile(personalPic[0], id, "foto");
        const downloadURL2 = await uploadFile(signaturePic[0], id, "firma");
        updateObject.foto = downloadURL1;
        updateObject.firma = downloadURL2;
      } else if (personalPic && personalPic.length > 0) {
        const downloadURL1 = await uploadFile(personalPic[0], id, "foto");
        updateObject.foto = downloadURL1;
      } else if (signaturePic && signaturePic.length > 0) {
        const downloadURL2 = await uploadFile(signaturePic[0], id, "firma");
        updateObject.firma = downloadURL2;
      }

      if (updateObject.contrasena) {
        updateObject.contrasena = await encryptPassword(
          updateObject.contrasena
        );
      }

      const updateTeacher = await Teacher.findOneAndUpdate(
        { _id: id },
        updateObject,
        { new: true }
      );

      if (!updateTeacher) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún docente",
        });
      }

      return res.status(200).send({
        status: "success",
        updateTeacher,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  },

  delete: async (req, res) => {
    let { id } = req.params;

    try {
      const deleteTeacher = await Teacher.findByIdAndDelete(id);

      if (!deleteTeacher) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún docente",
        });
      }

      return res.status(200).send({
        status: "success",
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  },
};
