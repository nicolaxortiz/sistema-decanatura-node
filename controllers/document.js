import pkg from "../utils/documentPDF.cjs";
const generatePDF = pkg;
import pkg1 from "../utils/reportePDF.cjs";
const reportePDF = pkg1;
import pkg2 from "../utils/reporteDocenciaPDF.cjs";
const reporteDocenciaPDF = pkg2;
import pkg3 from "../utils/reporteInvestigacionPDF.cjs";
const reporteInvestigacionPDF = pkg3;
import pkg4 from "../utils/reporteExtensionPDF.cjs";
const reporteExtensionPDF = pkg4;
import pkg5 from "../utils/reporteOACAPDF.cjs";
const reporteProcesosOACAPDF = pkg5;
import pkg6 from "../utils/reporteODAPDF.cjs";
const reporteProcesosODAPDF = pkg6;
import pkg7 from "../utils/reporteComitesPDF.cjs";
const reporteComitesPDF = pkg7;
import pkg8 from "../utils/reporteOtrasPDF.cjs";
const reporteOtrasPDF = pkg8;

import { pool } from "../db.js";

export const documentController = {
  getDocument: async (req, res) => {
    let { semester, id } = req.params;
    try {
      const teacher = await pool.query("SELECT * FROM teacher WHERE id = $1", [
        id,
      ]);

      if (teacher.rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún usuario",
        });
      }

      const coordinator = await pool.query(
        "SELECT * FROM coordinator WHERE program_id = $1",
        [teacher.rows[0].program_id]
      );

      if (coordinator.rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún coordinador ",
        });
      }

      const activity = await pool.query(
        "SELECT * FROM activity WHERE teacher_id = $1 AND semester = $2 ORDER BY id ASC",
        [id, semester]
      );

      if (activity.rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ninguna actividad del semestre " + semester,
        });
      }

      const schedule = await pool.query(
        "SELECT * FROM schedule WHERE teacher_id = $1 AND semester = $2 ORDER BY id ASC",
        [id, semester]
      );

      if (schedule.rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún horario del semestre actual",
        });
      }

      const format = await pool.query(
        "SELECT * FROM format WHERE teacher_id = $1 AND semester = $2",
        [id, semester]
      );

      if (format.rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún formato del docente",
        });
      }

      generatePDF({
        res,
        userData: teacher.rows[0],
        coordinatorData: coordinator.rows[0],
        activityData: activity.rows,
        scheduleData: schedule.rows,
        formatData: format.rows[0],
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        error: error,
      });
    }
  },

  getDocumentByMission: async (req, res) => {
    let { semester, id, mission } = req.params;
    try {
      const teacher = await pool.query("SELECT * FROM teacher WHERE id = $1", [
        id,
      ]);

      if (teacher.rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún usuario",
        });
      }

      const coordinator = await pool.query(
        "SELECT * FROM coordinator WHERE program_id = $1",
        [teacher.rows[0].program_id]
      );

      if (coordinator.rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún coordinador ",
        });
      }

      const activity = await pool.query(
        `SELECT * FROM activity 
         WHERE teacher_id = $1 
         AND semester = $2 
         AND EXISTS (
           SELECT 1 
           FROM activity a2 
           WHERE a2.teacher_id = $1 
           AND a2.mission = $3
         )
         ORDER BY id ASC`,
        [id, semester, mission]
      );

      if (activity.rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: `No se encontraron actividades para el semestre ${semester} con al menos una actividad de la misión ${mission}`,
        });
      }

      const schedule = await pool.query(
        "SELECT * FROM schedule WHERE teacher_id = $1 AND semester = $2 ORDER BY id ASC",
        [id, semester]
      );

      if (schedule.rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún horario del semestre actual",
        });
      }

      const format = await pool.query(
        "SELECT * FROM format WHERE teacher_id = $1 AND semester = $2",
        [id, semester]
      );

      if (format.rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún formato del docente",
        });
      }

      generatePDF({
        res,
        userData: teacher.rows[0],
        coordinatorData: coordinator.rows[0],
        activityData: activity.rows,
        scheduleData: schedule.rows,
        formatData: format.rows[0],
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        error: error,
      });
    }
  },

  getReporte: async (req, res) => {
    let { program_id, semester, title } = req.params;
    try {
      const teacher = await pool.query(
        "SELECT * FROM teacher WHERE program_id = $1 AND is_active = true ORDER BY id ASC",
        [program_id]
      );

      if (teacher.rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún docente",
        });
      }

      const activities = await pool.query(
        `SELECT activity.* FROM activity 
        JOIN teacher ON activity.teacher_id = teacher.id 
        JOIN program ON teacher.program_id = program.id 
        WHERE program.id = $1 AND activity.semester = $2`,
        [program_id, semester]
      );

      if (activities.rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ninguna actividad",
        });
      }

      reportePDF({
        res,
        teachersData: teacher.rows,
        activitiesData: activities.rows,
        semester: semester,
        program_name: teacher.rows[0].program_name,
        title: title,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        error: error.message,
      });
    }
  },

  getReporteByMission: async (req, res) => {
    let { program_id, semester, mission, title } = req.params;

    try {
      const teacher = await pool.query(
        "SELECT * FROM teacher WHERE program_id = $1 AND is_active = true ORDER BY id ASC",
        [program_id]
      );

      if (teacher.rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ningún docente",
        });
      }

      const activities = await pool.query(
        ` SELECT activity.* 
        FROM activity 
        JOIN teacher ON activity.teacher_id = teacher.id 
        JOIN program ON teacher.program_id = program.id 
        WHERE program.id = $1 
        AND activity.semester = $2 
        AND activity.consolidated ILIKE $3`,
        [program_id, semester, `${mission}%`]
      );

      if (activities.rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ninguna actividad",
        });
      }

      const otherActivities = await pool.query(
        `SELECT activity.* 
        FROM activity 
        JOIN teacher ON activity.teacher_id = teacher.id 
        JOIN program ON teacher.program_id = program.id 
        WHERE program.id = $1 
        AND activity.semester = $2 
        AND activity.consolidated NOT ILIKE $3`,
        [program_id, semester, `${mission}%`]
      );

      if (otherActivities.rows.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró ninguna actividad",
        });
      }

      if (mission === "Docencia") {
        reporteDocenciaPDF({
          res,
          teachersData: teacher.rows,
          activitiesData: activities.rows,
          otherActivitiesData: otherActivities.rows,
          semester: semester,
          program_name: teacher.rows[0].program_name,
          title: title,
        });
      } else if (mission === "Investigación") {
        reporteInvestigacionPDF({
          res,
          teachersData: teacher.rows,
          activitiesData: activities.rows,
          otherActivitiesData: otherActivities.rows,
          semester: semester,
          program_name: teacher.rows[0].program_name,
          title: title,
        });
      } else if (mission === "Extensión") {
        reporteExtensionPDF({
          res,
          teachersData: teacher.rows,
          activitiesData: activities.rows,
          otherActivitiesData: otherActivities.rows,
          semester: semester,
          program_name: teacher.rows[0].program_name,
          title: title,
        });
      } else if (mission === "OACA") {
        reporteProcesosOACAPDF({
          res,
          teachersData: teacher.rows,
          activitiesData: activities.rows,
          otherActivitiesData: otherActivities.rows,
          semester: semester,
          program_name: teacher.rows[0].program_name,
          title: title,
        });
      } else if (mission === "ODA") {
        reporteProcesosODAPDF({
          res,
          teachersData: teacher.rows,
          activitiesData: activities.rows,
          otherActivitiesData: otherActivities.rows,
          semester: semester,
          program_name: teacher.rows[0].program_name,
          title: title,
        });
      } else if (mission === "Comités") {
        reporteComitesPDF({
          res,
          teachersData: teacher.rows,
          activitiesData: activities.rows,
          otherActivitiesData: otherActivities.rows,
          semester: semester,
          program_name: teacher.rows[0].program_name,
          title: title,
        });
      } else if (mission === "Otras") {
        reporteOtrasPDF({
          res,
          teachersData: teacher.rows,
          activitiesData: activities.rows,
          otherActivitiesData: otherActivities.rows,
          semester: semester,
          program_name: teacher.rows[0].program_name,
          title: title,
        });
      }
    } catch (error) {
      return res.status(500).send({
        status: "error",
        error: error.message,
      });
    }
  },
};
