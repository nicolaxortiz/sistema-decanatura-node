import pkg from "../utils/documentPDF.cjs";
const generatePDF = pkg;
import pkg1 from "../utils/reportePDF.cjs";
const reportePDF = pkg1;
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
        error: error.message,
      });
    }
  },

  getReporte: async (req, res) => {
    let { program_id, semester } = req.params;
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
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        error: error,
      });
    }
  },
};
