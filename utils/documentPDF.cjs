const axios = require("axios");
const fs = require("fs");
const path = require("path");
const PdfPrinter = require("pdfmake/src/printer");
const Logo = __dirname + "/logoUTS.png";

const fonts = {
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

const HORAS = [
  "6:00 a 6:45 a.m.",
  "6:45 a 7:30 a.m.",
  "7:30 a 8:15 a.m.",
  "8:15 a 9:00 a.m.",
  "9:00 a 9:45 a.m.",
  "9:45 a 10:30 a.m.",
  "10:30 a 11:15 a.m.",
  "11:15 a 12:00 a.m.",
  "12:00 a 12:45 p.m.",
  "12:45 a 1:30 p.m.",
  "1:30 a 2:15 p.m.",
  "2:15 a 3:00 p.m.",
  "3:00 a 3:45 p.m.",
  "3:45 a 4:30 p.m.",
  "4:30 a 5:15 p.m.",
  "5:15 a 6:00 p.m.",
  "6:30 a 7:15 p.m.",
  "7:15 a 8:00 p.m.",
  "8:15 a 9:00 p.m.",
  "9:00 a 9:45 p.m.",
];

const printer = new PdfPrinter(fonts);

function convertirHora(hora) {
  const horasDe60Minutos = hora * 0.75;

  return Math.ceil(horasDe60Minutos);
}

function convertirFecha(fecha) {
  if (fecha !== null) {
    const fechaObj = new Date(fecha);

    const dia = fechaObj.getDate().toString().padStart(2, "0");
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, "0");
    const anio = fechaObj.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${anio}`;

    return fechaFormateada;
  } else {
    return "";
  }
}

const generatePDF = ({ res, userData, activityData, scheduleData }) => {
  const imageUrlFoto = userData.foto;
  const imageUrlFirma = userData.firma;
  const imagePathFoto = path.join(
    __dirname,
    "images",
    `${userData.documento}foto.jpg`
  );
  const imagePathFirma = path.join(
    __dirname,
    "images",
    `${userData.documento}firma.jpg`
  );

  async function downloadImage(foto, path) {
    try {
      const response = await axios.get(foto, { responseType: "stream" });
      const writer = fs.createWriteStream(path);

      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
    } catch (error) {
      console.error("Error al descargar la imagen:", error);
    }
  }

  downloadImage(imageUrlFoto, imagePathFoto);
  downloadImage(imageUrlFirma, imagePathFirma);

  let imgPersonal = __dirname + "/images/" + userData.documento + "foto.jpg";
  let imgFirma = __dirname + "/images/" + userData.documento + "firma.jpg";
  console.log(imgPersonal);

  let tableActividades = [
    [
      {
        text: `#`,
        style: "header",
      },
      {
        text: `Nombre de la actividad`,
        style: "header",
      },
      {
        text: `Misional`,
        style: "header",
      },
      {
        text: `Descripción`,
        style: "header",
      },
      {
        text: `Grupo`,
        style: "header",
      },
      {
        text: `Horas`,
        style: "header",
      },
      {
        text: `Responsable`,
        style: "header",
      },
    ],
  ];
  let tableSeguimiento = [
    [
      { text: `#`, style: "header" },
      { text: `1`, style: "header" },
      { text: `2`, style: "header" },
      { text: `3`, style: "header" },
      { text: `4`, style: "header" },
      { text: `5`, style: "header" },
      { text: `6`, style: "header" },
      { text: `7`, style: "header" },
      { text: `8`, style: "header" },
      { text: `9`, style: "header" },
      { text: `10`, style: "header" },
      { text: `11`, style: "header" },
      { text: `12`, style: "header" },
      { text: `13`, style: "header" },
      { text: `14`, style: "header" },
      { text: `15`, style: "header" },
      { text: `16`, style: "header" },
      { text: `17`, style: "header" },
      { text: `Total`, style: "header" },
    ],
  ];

  let tableProductos = [
    [
      {
        text: `#`,
        style: "header",
      },
      {
        text: `Descripción del producto`,
        style: "header",
      },
      {
        text: `Fecha de compromiso en entrega`,
        style: "header",
      },
      {
        text: `Fecha de entrega`,
        style: "header",
      },
      {
        text: `Comentarios del responsable del seguimiento`,
        style: "header",
      },
    ],
  ];
  let countHoras = 0;

  activityData.actividad.forEach((item, index) => {
    countHoras += item.horas;
    tableActividades.push([
      { text: index + 1, style: "header" },
      { text: item.nombre, style: "dataLeft" },
      { text: item.misional, style: "dataLeft" },
      { text: item.descripcion, style: "dataLeft" },
      { text: item.grupo, style: "data" },
      { text: item.horas, style: "data" },
      { text: item.responsable, style: "dataLeft" },
    ]);

    tableSeguimiento.push([
      { text: index + 1, style: "header" },
      { text: item.horas, style: "data" },
      { text: item.horas, style: "data" },
      { text: item.horas, style: "data" },
      { text: item.horas, style: "data" },
      { text: item.horas, style: "data" },
      { text: item.horas, style: "data" },
      { text: item.horas, style: "data" },
      { text: item.horas, style: "data" },
      { text: item.horas, style: "data" },
      { text: item.horas, style: "data" },
      { text: item.horas, style: "data" },
      { text: item.horas, style: "data" },
      { text: item.horas, style: "data" },
      { text: item.horas, style: "data" },
      { text: item.horas, style: "data" },
      { text: item.horas, style: "data" },
      { text: item.horas, style: "data" },
      { text: item.horas * 17, style: "header" },
    ]);

    tableProductos.push([
      { text: index + 1, style: "header" },
      { text: item.producto.descripcion, style: "dataLeft" },
      { text: convertirFecha(item.producto.fechaEstimada), style: "data" },
      { text: convertirFecha(item.producto.fechaReal), style: "data" },
      { text: item.producto.comentario, style: "dataLeft" },
    ]);
  });

  tableSeguimiento.push([
    { text: "H/S", style: "header" },
    { text: countHoras, style: "data" },
    { text: countHoras, style: "data" },
    { text: countHoras, style: "data" },
    { text: countHoras, style: "data" },
    { text: countHoras, style: "data" },
    { text: countHoras, style: "data" },
    { text: countHoras, style: "data" },
    { text: countHoras, style: "data" },
    { text: countHoras, style: "data" },
    { text: countHoras, style: "data" },
    { text: countHoras, style: "data" },
    { text: countHoras, style: "data" },
    { text: countHoras, style: "data" },
    { text: countHoras, style: "data" },
    { text: countHoras, style: "data" },
    { text: countHoras, style: "data" },
    { text: countHoras, style: "data" },
    { text: "", style: "header" },
  ]);

  let tableHorario = [
    [
      {
        text: `Hora`,
        style: "header",
      },
      {
        text: `Lunes`,
        style: "header",
      },
      {
        text: `Martes`,
        style: "header",
      },
      {
        text: `Miercoles`,
        style: "header",
      },
      {
        text: `Jueves`,
        style: "header",
      },
      {
        text: `Viernes`,
        style: "header",
      },
      {
        text: `Sabado`,
        style: "header",
      },
    ],
  ];

  let lunesCount = 0;
  let martesCount = 0;
  let miercolesCount = 0;
  let juevesCount = 0;
  let viernesCount = 0;
  let sabadoCount = 0;

  HORAS.forEach((item, index) => {
    let actForDay = [
      {
        text: item,
        style: "data",
      },
      {
        text: ``,
        style: "data",
      },
      {
        text: ``,
        style: "data",
      },
      {
        text: ``,
        style: "data",
      },
      {
        text: ``,
        style: "data",
      },
      {
        text: ``,
        style: "data",
      },
      {
        text: ``,
        style: "data",
      },
    ];
    scheduleData.horas.forEach((horario) => {
      if (
        horario.registro[0].momento === index &&
        horario.registro[0].dia === "Lunes"
      ) {
        lunesCount++;
        actForDay[1] = {
          text: horario.actividad,
          style: horario.clasificacion.split(" ").join(""),
        };
      }

      if (
        horario.registro[0].momento === index &&
        horario.registro[0].dia === "Martes"
      ) {
        martesCount++;
        actForDay[2] = {
          text: horario.actividad,
          style: horario.clasificacion.split(" ").join(""),
        };
      }

      if (
        horario.registro[0].momento === index &&
        horario.registro[0].dia === "Miercoles"
      ) {
        miercolesCount++;
        actForDay[3] = {
          text: horario.actividad,
          style: horario.clasificacion.split(" ").join(""),
        };
      }

      if (
        horario.registro[0].momento === index &&
        horario.registro[0].dia === "Jueves"
      ) {
        juevesCount++;
        actForDay[4] = {
          text: horario.actividad,
          style: horario.clasificacion.split(" ").join(""),
        };
      }

      if (
        horario.registro[0].momento === index &&
        horario.registro[0].dia === "Viernes"
      ) {
        viernesCount++;
        actForDay[5] = {
          text: horario.actividad,
          style: horario.clasificacion.split(" ").join(""),
        };
      }

      if (
        horario.registro[0].momento === index &&
        horario.registro[0].dia === "Sabado"
      ) {
        sabadoCount++;
        actForDay[6] = {
          text: horario.actividad,
          style: horario.clasificacion.split(" ").join(""),
        };
      }
    });
    tableHorario.push(actForDay);
  });

  tableHorario.push(
    [
      {
        text: "Horas de 45 minutos",
        style: "header",
      },
      {
        text: lunesCount,
        style: "header",
      },
      {
        text: martesCount,
        style: "header",
      },
      {
        text: miercolesCount,
        style: "header",
      },
      {
        text: juevesCount,
        style: "header",
      },
      {
        text: viernesCount,
        style: "header",
      },
      {
        text: sabadoCount,
        style: "header",
      },
    ],
    [
      {
        text: "Horas de 60 minutos",
        style: "header",
      },
      {
        text: lunesCount * 0.75,
        style: "header",
      },
      {
        text: martesCount * 0.75,
        style: "header",
      },
      {
        text: miercolesCount * 0.75,
        style: "header",
      },
      {
        text: juevesCount * 0.75,
        style: "header",
      },
      {
        text: viernesCount * 0.75,
        style: "header",
      },
      {
        text: sabadoCount * 0.75,
        style: "header",
      },
    ]
  );

  const docDefinition = {
    pageSize: "A3",
    pageOrientation: "landscape",
    pageMargins: [20, 20, 20, 20],
    content: [
      {
        layout: "noBorders",
        table: {
          widths: ["auto", "*", "auto"],

          heights: 1,
          body: [
            [
              [
                {
                  image: Logo,
                  fit: [100, 100],
                  margin: [10, 0, 0, 5],
                },
                {
                  text: "F - DC - 54",
                  style: "title",
                  margin: [10, 0, 0, 0],
                },
              ],
              [
                {
                  text: "DOCENCIA",
                  style: "title",
                  margin: [0, 25, 0, 0],
                },
                {
                  text: "PLAN DE TRABAJO DOCENTES PLANTA, TIEMPO COMPLETO, MEDIO TIEMPO ",
                  style: "title",
                },
              ],
              {
                image: imgPersonal,
                fit: [80, 80],
                margin: [0, 0, 10, 5],
                style: "fotoPersonal",
              },
            ],
          ],
        },
      },

      {
        table: {
          headerRows: 1,
          widths: ["*"],
          heights: 1,
          body: [
            [
              {
                text: `INFORMACIÓN GENERAL`,
                style: "headerTitle",
              },
            ],
          ],
        },
      },

      {
        table: {
          headerRows: 1,
          widths: ["*", "*", "*", "*"],
          heights: 1,
          body: [
            [
              {
                text: `Apellidos`,
                style: "header",
              },
              {
                text: `Nombres`,
                style: "header",
              },
              {
                text: `Tarjeta profesional`,
                style: "header",
              },
              {
                text: `Documento`,
                style: "header",
              },
            ],
            [
              {
                text: userData.apellidos,
                style: "data",
              },
              {
                text: userData.nombres,
                style: "data",
              },
              {
                text: userData.tarjeta,
                style: "data",
              },
              {
                text: userData.documento,
                style: "data",
              },
            ],
          ],
        },
      },

      {
        table: {
          headerRows: 1,
          widths: ["*", "*", "*", "*", "*", "*"],
          heights: 1,
          body: [
            [
              {
                text: `Facultad/Departamento`,
                style: "header",
              },
              {
                text: `Unidad académica`,
                style: "header",
              },
              {
                text: `Campus`,
                style: "header",
              },
              {
                text: `Tipo de vinculación`,
                style: "header",
              },
              {
                text: `Escalafón docente`,
                style: "header",
              },
              {
                text: `Semestre - año`,
                style: "header",
              },
            ],
            [
              {
                text: userData.facultad,
                style: "data",
              },
              {
                text: userData.unidadAcademica,
                style: "data",
              },
              {
                text: userData.campus,
                style: "data",
              },
              {
                text: userData.vinculacion,
                style: "data",
              },
              {
                text: userData.escalafon,
                style: "data",
              },
              {
                text: process.env.CURRENTSEMESTER,
                style: "data",
              },
            ],
          ],
        },
      },

      {
        table: {
          headerRows: 1,
          widths: ["*", "*", "*"],
          heights: 1,
          body: [
            [
              {
                text: `Dirección residencia`,
                style: "header",
              },
              {
                text: `Número celular`,
                style: "header",
              },
              {
                text: `Correo electronico`,
                style: "header",
              },
            ],
            [
              {
                text: userData.direccion,
                style: "data",
              },
              {
                text: userData.celular,
                style: "data",
              },
              {
                text: userData.correo,
                style: "data",
              },
            ],
          ],
        },
      },

      {
        table: {
          headerRows: 1,
          widths: ["*"],
          heights: 1,
          body: [
            [
              {
                text: `INFORMACIÓN ACADÉMICA (Titulos obtenidos en Colombia o convalidados por el MEN)`,
                style: "headerTitle",
              },
            ],
          ],
        },
      },

      {
        table: {
          widths: ["auto", "*", "auto", "auto", "*", "auto", "*", "auto", "*"],
          heights: 1,
          body: [
            [
              {
                text: `Pregrado`,
                style: "header",
              },
              {
                text: userData.pregrado,
                style: "data",
              },
              {
                text: `Postgradual`,
                style: "header",
              },
              {
                text: `Esp.`,
                style: "header",
              },
              {
                text: userData.especializacion,
                style: "data",
              },
              {
                text: `Mag.`,
                style: "header",
              },
              {
                text: userData.magister,
                style: "data",
              },
              {
                text: `Dr. o Ph.D. .`,
                style: "header",
              },
              {
                text: userData.doctorado,
                style: "data",
              },
            ],
          ],
        },
      },

      {
        table: {
          headerRows: 1,
          widths: ["*"],
          heights: 1,
          body: [
            [
              {
                text: `LISTA DE ACTIVIDADES`,
                style: "headerTitle",
              },
            ],
          ],
        },
        margin: [0, 15, 0, 0],
      },

      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "auto", "*", "auto", "auto", "auto"],
          heights: 1,
          body: tableActividades,
        },
      },

      {
        table: {
          headerRows: 1,
          widths: ["*", "auto"],
          heights: 1,
          body: [
            [
              {
                text: `TOTAL HORAS SEMANALES`,
                style: "dataRight",
              },
              {
                text: countHoras,
                style: "header",
              },
            ],
          ],
        },
        margin: [0, 0, 0, 15],
      },

      {
        table: {
          headerRows: 1,
          widths: ["*"],
          heights: 1,
          body: [
            [
              {
                text: `SEGUIMIENTO DE LAS ACTIVIDADES`,
                style: "headerTitle",
              },
            ],
            [
              {
                text: `Semanas`,
                style: "header",
              },
            ],
          ],
        },
      },

      {
        table: {
          headerRows: 1,
          widths: [
            "*",
            "*",
            "*",
            "*",
            "*",
            "*",
            "*",
            "*",
            "*",
            "*",
            "*",
            "*",
            "*",
            "*",
            "*",
            "*",
            "*",
            "*",
            "*",
          ],
          heights: 1,
          body: tableSeguimiento,
        },
      },

      {
        table: {
          headerRows: 1,
          widths: ["*", "auto"],
          heights: 1,
          body: [
            [
              {
                text: `TOTAL HORAS DE 45 MINUTOS POR SEMESTRE`,
                style: "dataRight",
              },
              {
                text: countHoras * 17,
                style: "header",
              },
            ],
            [
              {
                text: `TOTAL HORAS DE 60 MINUTOS POR SEMESTRE`,
                style: "dataRight",
              },
              {
                text: convertirHora(countHoras * 17),
                style: "header",
              },
            ],
          ],
        },
        margin: [0, 0, 0, 15],
      },

      {
        table: {
          headerRows: 1,
          widths: ["*"],
          heights: 1,
          body: [
            [
              {
                text: `LISTA DE PRODUCTOS`,
                style: "headerTitle",
              },
            ],
          ],
        },
      },

      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "auto", "auto", "*"],
          heights: 1,
          body: tableProductos,
        },
        margin: [0, 0, 0, 15],
      },

      {
        table: {
          headerRows: 1,
          widths: ["*"],
          heights: 1,
          body: [
            [
              {
                text: `HORARIO SEMANAL`,
                style: "headerTitle",
              },
            ],
          ],
        },
      },

      {
        table: {
          headerRows: 1,
          widths: ["*", "*", "*", "*", "*", "*", "*"],
          heights: 1,
          body: tableHorario,
        },
      },

      {
        table: {
          headerRows: 1,
          widths: ["*", "auto"],
          heights: 1,
          body: [
            [
              {
                text: "TOTAL HORAS SEMANAL DE 45 MINUTOS",
                style: "dataRight",
              },
              {
                text: countHoras,
                style: "header",
              },
            ],
            [
              {
                text: "TOTAL HORAS SEMANAL DE 60 MINUTOS",
                style: "dataRight",
              },
              {
                text: convertirHora(countHoras),
                style: "header",
              },
            ],
          ],
        },
        margin: [0, 0, 0, 15],
      },

      {
        table: {
          headerRows: 1,
          widths: ["*"],
          heights: 1,
          body: [
            [
              {
                text: "OBSERVACIONES GENERALES",
                style: "header",
              },
            ],
            [
              {
                text: scheduleData.observacion,
                style: "dataLeft",
                margin: [5, 5, 5, 5],
              },
            ],
          ],
        },
        margin: [0, 0, 0, 15],
      },

      {
        table: {
          headerRows: 1,
          widths: ["*", "*", "*"],
          heights: 1,
          body: [
            [
              {
                text: `${userData.nombres} ${userData.apellidos}`,
                style: "header",
              },

              {
                text: "Coordinador del programa",
                style: "header",
              },

              {
                text: "Decano",
                style: "header",
              },
            ],
            [
              {
                image: imgFirma,
                fit: [150, 150],
                margin: [0, 8, 0, 8],
                style: "data",
              },

              {
                text: "",
                style: "data",
              },

              {
                text: "",
                style: "data",
              },
            ],
            [
              {
                text: "Firma Docente",
                style: "data",
              },

              {
                text: "Firma Jefe Grupo de Unidad Académica o Departamentos",
                style: "data",
              },

              {
                text: "Firma Decano o Director de Regionalización",
                style: "data",
              },
            ],
          ],
        },
        margin: [0, 0, 0, 15],
      },

      {
        table: {
          headerRows: 1,
          widths: ["*"],
          heights: 1,
          body: [
            [
              {
                text: "Al diligenciar este documento, autorizo de manera previa, expresa e inequívoca a UNIDADES TECNOLÓGICAS DE SANTANDER a dar tratamiento de mis datos personales aquí consignados, incluyendo el consentimiento explícito para tratar datos sensibles aun conociendo la posibilidad de oponerme a ello, conforme a las finalidades incorporadas en la Política de Tratamiento de Información publicada en www.uts.edu.co y/o en Calle de los estudiantes 9-82 Ciudadela Real de Minas, que declaro conocer y estar informado que en ella se presentan los derechos que me asisten como titular y los canales de atención donde ejercerlos.",
                style: "dataLeft",
                margin: [5, 5, 5, 5],
              },
            ],
          ],
        },
        margin: [0, 0, 0, 15],
      },

      {
        table: {
          headerRows: 1,
          widths: ["*", "*", "*", "*"],
          heights: 1,
          body: [
            [
              {
                text: "ELABORADO POR",
                style: "header",
              },
              {
                text: "DESARROLLADO POR",
                style: "header",
              },
              {
                text: "REVISADO POR",
                style: "header",
              },
              {
                text: "APROBADO POR",
                style: "header",
              },
            ],
            [
              {
                text: "Docencia",
                style: "data",
              },
              {
                text: "Carlos Arturo Toloza Valencia",
                style: "data",
              },
              {
                text: "Sistema integrado de gestión SIG",
                style: "data",
              },
              {
                text: "Líder del sistema integrado de gestión",
                style: "data",
              },
            ],
          ],
        },
        margin: [0, 0, 0, 15],
      },
    ],

    styles: {
      headerTitle: {
        fillColor: "#d4d4d4",
        lineHeight: 1,
        alignment: "center",
        fontSize: 10,
        bold: true,
      },
      header: {
        fillColor: "#ededed",
        lineHeight: 1,
        alignment: "center",
        fontSize: 10,
        bold: true,
      },
      title: {
        alignment: "center",
        margin: [0, 5, 0, 2],
        fontSize: 10,
      },
      center: {
        alignment: "center",
        margin: [0, 3],
        bold: true,
      },
      data: {
        lineHeight: 1,
        alignment: "center",
        fontSize: 10,
      },
      dataLeft: {
        lineHeight: 1,
        alignment: "left",
        fontSize: 10,
      },
      dataRight: {
        lineHeight: 1,
        alignment: "right",
        fontSize: 10,
        fillColor: "#ededed",
        bold: true,
      },
      Docenciadirecta: {
        lineHeight: 1,
        alignment: "center",
        fontSize: 10,
        fillColor: "#97ce81",
      },
      Investigación: {
        lineHeight: 1,
        alignment: "center",
        fontSize: 10,
        fillColor: "#bddab2",
      },
      Extensión: {
        lineHeight: 1,
        alignment: "center",
        fontSize: 10,
        fillColor: "#e9d4c1",
      },
      ProcesosOACA: {
        lineHeight: 1,
        alignment: "center",
        fontSize: 10,
        fillColor: "#d3e4f3",
      },
      ProcesosODA: {
        lineHeight: 1,
        alignment: "center",
        fontSize: 10,
        fillColor: "#87a4e4",
      },
      Comités: {
        lineHeight: 1,
        alignment: "center",
        fontSize: 10,
        fillColor: "#f6ff7b",
      },
      Otras: {
        lineHeight: 1,
        alignment: "center",
        fontSize: 10,
        fillColor: "#b4b4b4",
      },
    },
    defaultStyle: {
      font: "Helvetica",
      fontSize: 10,
      lineHeight: 1.3,
    },
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(res);
  pdfDoc.end();
};

module.exports = generatePDF;
