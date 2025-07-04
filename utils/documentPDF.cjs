const PdfPrinter = require("pdfmake/src/printer");
const Logo = __dirname + "/logoUTS.png";
const nullSignature = __dirname + "/null_signature.png";

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

  return Math.ceil(horasDe60Minutos.toFixed(2));
}

function convertirFecha(fecha) {
  if (fecha !== null && fecha !== undefined) {
    const fechaObj = new Date(fecha);

    const day = fechaObj.getDate().toString().padStart(2, "0");
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, "0");
    const anio = fechaObj.getFullYear();
    const fechaFormateada = `${day}/${mes}/${anio}`;

    return fechaFormateada;
  } else {
    return "";
  }
}

const generatePDF = ({
  res,
  userData,
  coordinatorData,
  deanData,
  activityData,
  scheduleData,
  formatData,
}) => {
  let imgPersonal = __dirname + "/images/" + userData.document + "foto.jpg";
  let imgFirmaDocente =
    __dirname + "/images/" + userData.document + "firma.jpg";
  let imgFirmaCoordinador =
    __dirname + "/images/" + coordinatorData.document + "firma.jpg";
  let imgFirmaDecano = __dirname + "/images/" + deanData.document + "firma.jpg";

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
        text: `Fecha de entrega (real)`,
        style: "header",
      },
      {
        text: `Comentarios del responsable del seguimiento`,
        style: "header",
      },
    ],
  ];
  let countHours = 0;

  activityData.forEach((item, index) => {
    countHours += parseFloat(item.hours);

    if (parseFloat(item.hours) % 1 === 0) {
      item.hours = parseFloat(item.hours).toFixed(0);
    } else {
      item.hours = parseFloat(item.hours).toFixed(2);
    }

    tableActividades.push([
      { text: index + 1, style: "header" },
      { text: item.name, style: "dataLeft" },
      { text: item.mission, style: "dataLeft" },
      { text: item.description, style: "dataLeft" },
      { text: item.group_name, style: "data" },
      { text: item.hours, style: "data" },
      { text: item.responsible, style: "dataLeft" },
    ]);

    tableSeguimiento.push([
      { text: index + 1, style: "header" },
      { text: item.hours, style: "data" },
      { text: item.hours, style: "data" },
      { text: item.hours, style: "data" },
      { text: item.hours, style: "data" },
      { text: item.hours, style: "data" },
      { text: item.hours, style: "data" },
      { text: item.hours, style: "data" },
      { text: item.hours, style: "data" },
      { text: item.hours, style: "data" },
      { text: item.hours, style: "data" },
      { text: item.hours, style: "data" },
      { text: item.hours, style: "data" },
      { text: item.hours, style: "data" },
      { text: item.hours, style: "data" },
      { text: item.hours, style: "data" },
      { text: item.hours, style: "data" },
      { text: item.hours, style: "data" },
      { text: (item.hours * 17).toFixed(2), style: "header" },
    ]);

    tableProductos.push([
      { text: index + 1, style: "header" },
      { text: item.product.description, style: "dataLeft" },
      { text: convertirFecha(item.product.estimated_date), style: "data" },
      { text: convertirFecha(item.product.real_date), style: "data" },
      { text: item.product.comment, style: "dataLeft" },
    ]);
  });

  tableSeguimiento.push([
    { text: "H/S", style: "header" },
    { text: countHours, style: "data" },
    { text: countHours, style: "data" },
    { text: countHours, style: "data" },
    { text: countHours, style: "data" },
    { text: countHours, style: "data" },
    { text: countHours, style: "data" },
    { text: countHours, style: "data" },
    { text: countHours, style: "data" },
    { text: countHours, style: "data" },
    { text: countHours, style: "data" },
    { text: countHours, style: "data" },
    { text: countHours, style: "data" },
    { text: countHours, style: "data" },
    { text: countHours, style: "data" },
    { text: countHours, style: "data" },
    { text: countHours, style: "data" },
    { text: countHours, style: "data" },
    { text: (countHours * 17).toFixed(2), style: "header" },
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
        text: `Miércoles`,
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
        text: `Sábado`,
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
    scheduleData.forEach((horario) => {
      if (horario.moment === index && horario.day === "Lunes") {
        lunesCount++;
        actForDay[1] = {
          text: horario.name,
          style: horario.classification.split(" ").join(""),
        };
      }

      if (horario.moment === index && horario.day === "Martes") {
        martesCount++;
        actForDay[2] = {
          text: horario.name,
          style: horario.classification.split(" ").join(""),
        };
      }

      if (horario.moment === index && horario.day === "Miércoles") {
        miercolesCount++;
        actForDay[3] = {
          text: horario.name,
          style: horario.classification.split(" ").join(""),
        };
      }

      if (horario.moment === index && horario.day === "Jueves") {
        juevesCount++;
        actForDay[4] = {
          text: horario.name,
          style: horario.classification.split(" ").join(""),
        };
      }

      if (horario.moment === index && horario.day === "Viernes") {
        viernesCount++;
        actForDay[5] = {
          text: horario.name,
          style: horario.classification.split(" ").join(""),
        };
      }

      if (horario.moment === index && horario.day === "Sábado") {
        sabadoCount++;
        actForDay[6] = {
          text: horario.name,
          style: horario.classification.split(" ").join(""),
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
        text: lunesCount.toFixed(2),
        style: "header",
      },
      {
        text: martesCount.toFixed(2),
        style: "header",
      },
      {
        text: miercolesCount.toFixed(2),
        style: "header",
      },
      {
        text: juevesCount.toFixed(2),
        style: "header",
      },
      {
        text: viernesCount.toFixed(2),
        style: "header",
      },
      {
        text: sabadoCount.toFixed(2),
        style: "header",
      },
    ],
    [
      {
        text: "Horas de 60 minutos",
        style: "header",
      },
      {
        text: (lunesCount * 0.75).toFixed(2),
        style: "header",
      },
      {
        text: (martesCount * 0.75).toFixed(2),
        style: "header",
      },
      {
        text: (miercolesCount * 0.75).toFixed(2),
        style: "header",
      },
      {
        text: (juevesCount * 0.75).toFixed(2),
        style: "header",
      },
      {
        text: (viernesCount * 0.75).toFixed(2),
        style: "header",
      },
      {
        text: (sabadoCount * 0.75).toFixed(2),
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
          widths: ["auto", "*", "auto", "auto"],
          dontBreakRows: true,
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
                  text: "PLAN DE TRABAJO DOCENTES DE CARRERA, TIEMPO COMPLETO, MEDIO TIEMPO",
                  style: "title",
                },
              ],
              {
                image: imgPersonal,
                fit: [100, 100],
                margin: [0, 0, 10, 5],
                style: "fotoPersonal",
              },

              {
                text: "VERSIÓN: 7.0",
                style: "title",
                margin: [0, 50, 10, 0],
              },
            ],
          ],
        },
      },

      {
        table: {
          dontBreakRows: true,
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
          dontBreakRows: true,
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
                text: userData.last_name,
                style: "data",
              },
              {
                text: userData.first_name,
                style: "data",
              },
              {
                text: userData.card,
                style: "data",
              },
              {
                text: userData.document,
                style: "data",
              },
            ],
          ],
        },
      },

      {
        table: {
          dontBreakRows: true,
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
                text: `Categoría docente`,
                style: "header",
              },
              {
                text: `Semestre - año`,
                style: "header",
              },
            ],
            [
              {
                text: userData.faculty,
                style: "data",
              },
              {
                text: userData.program_name,
                style: "data",
              },
              {
                text: userData.campus,
                style: "data",
              },
              {
                text: userData.employment_type,
                style: "data",
              },
              {
                text: userData.rank,
                style: "data",
              },
              {
                text: activityData[0].semester,
                style: "data",
              },
            ],
          ],
        },
      },

      {
        table: {
          dontBreakRows: true,
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
                text: `Correo electrónico`,
                style: "header",
              },
            ],
            [
              {
                text: userData.address,
                style: "data",
              },
              {
                text: userData.phone,
                style: "data",
              },
              {
                text: userData.email,
                style: "data",
              },
            ],
          ],
        },
      },

      {
        table: {
          dontBreakRows: true,
          widths: ["*"],
          heights: 1,
          body: [
            [
              {
                text: `INFORMACIÓN ACADÉMICA (Títulos obtenidos en Colombia o convalidados por el MEN)`,
                style: "headerTitle",
              },
            ],
          ],
        },
      },

      {
        table: {
          dontBreakRows: true,
          widths: ["auto", "*", "auto", "auto", "*", "auto", "*", "auto", "*"],
          heights: 1,
          body: [
            [
              {
                text: `Pregrado`,
                style: "header",
              },
              {
                text: userData.undergraduate,
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
                text: userData.specialization,
                style: "data",
              },
              {
                text: `Mag.`,
                style: "header",
              },
              {
                text: userData.master,
                style: "data",
              },
              {
                text: `Dr. o Ph.D. .`,
                style: "header",
              },
              {
                text: userData.doctorate,
                style: "data",
              },
            ],
          ],
        },
      },

      {
        table: {
          dontBreakRows: true,
          widths: ["*"],
          heights: 1,
          body: [
            [
              {
                text: `LISTA DE ACTIVIDADES`,
                style: "headerTitle",
              },
            ],
            [
              {
                text: `Docencia, Investigación, Extensión, Otros`,
                style: "headerTitle",
              },
            ],
          ],
        },
        margin: [0, 15, 0, 0],
      },

      {
        table: {
          dontBreakRows: true,
          widths: ["auto", "*", "auto", "*", "auto", "auto", "auto"],
          heights: 1,
          body: tableActividades,
        },
      },

      {
        table: {
          dontBreakRows: true,
          widths: ["*", "auto"],
          heights: 1,
          body: [
            [
              {
                text: `TOTAL HORAS SEMANALES`,
                style: "dataRight",
              },
              {
                text: countHours.toFixed(2),
                style: "header",
              },
            ],
          ],
        },
        margin: [0, 0, 0, 15],
      },

      {
        table: {
          dontBreakRows: true,
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
          dontBreakRows: true,
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
          dontBreakRows: true,
          widths: ["*", "auto"],
          heights: 1,
          body: [
            [
              {
                text: `TOTAL HORAS DE 45 MINUTOS POR SEMESTRE`,
                style: "dataRight",
              },
              {
                text: (countHours * 17).toFixed(2),
                style: "header",
              },
            ],
            [
              {
                text: `TOTAL HORAS DE 60 MINUTOS POR SEMESTRE`,
                style: "dataRight",
              },
              {
                text: convertirHora(countHours * 17),
                style: "header",
              },
            ],
          ],
        },
        margin: [0, 15, 0, 15],
      },

      {
        table: {
          dontBreakRows: true,
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
          dontBreakRows: true,
          widths: ["auto", "*", "auto", "auto", "*"],
          heights: 1,
          body: tableProductos,
        },
        margin: [0, 0, 0, 15],
      },

      {
        table: {
          dontBreakRows: true,
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
          dontBreakRows: true,
          widths: ["*", "*", "*", "*", "*", "*", "*"],
          heights: 1,
          body: tableHorario,
        },
      },

      {
        table: {
          dontBreakRows: true,
          widths: ["*", "auto"],
          heights: 1,
          body: [
            [
              {
                text: "TOTAL HORAS SEMANAL DE 45 MINUTOS",
                style: "dataRight",
              },
              {
                text: countHours.toFixed(2),
                style: "header",
              },
            ],
            [
              {
                text: "TOTAL HORAS SEMANAL DE 60 MINUTOS",
                style: "dataRight",
              },
              {
                text: convertirHora(countHours),
                style: "header",
              },
            ],
          ],
        },
        margin: [0, 0, 0, 15],
      },

      {
        table: {
          dontBreakRows: true,
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
                text: formatData.observation,
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
          dontBreakRows: true,
          widths: ["*", "*", "*"],
          heights: 1,
          body: [
            [
              {
                text: `${userData.first_name} ${userData.last_name}`,
                style: "header",
              },

              {
                text: `${coordinatorData.first_name} ${coordinatorData.last_name}`,
                style: "header",
              },

              {
                text: `${deanData.first_name} ${deanData.last_name}`,
                style: "header",
              },
            ],
            [
              {
                image: imgFirmaDocente,
                fit: [150, 150],
                margin: [0, 2, 0, 2],
                style: "data",
              },

              {
                image: formatData?.is_coord_signed
                  ? imgFirmaCoordinador
                  : nullSignature,
                fit: [150, 150],
                margin: [0, 2, 0, 2],
                style: "data",
              },

              {
                image: formatData?.is_dean_signed
                  ? imgFirmaDecano
                  : nullSignature,
                fit: [150, 150],
                margin: [0, 2, 0, 2],
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
          dontBreakRows: true,
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
          dontBreakRows: true,
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
                text: "Nicolas Santiago Ortiz Pedraza",
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
        marginTop: 2,
        marginBottom: 2,
      },
      header: {
        fillColor: "#ededed",
        lineHeight: 1,
        alignment: "center",
        fontSize: 10,
        bold: true,
        marginTop: 2,
        marginBottom: 2,
      },
      title: {
        alignment: "center",
        margin: [0, 5, 0, 2],
        fontSize: 12,
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
        marginTop: 2,
        marginBottom: 2,
      },
      dataLeft: {
        lineHeight: 1,
        alignment: "left",
        fontSize: 10,
        marginTop: 2,
        marginBottom: 2,
      },
      dataRight: {
        lineHeight: 1,
        alignment: "right",
        fontSize: 10,
        fillColor: "#ededed",
        bold: true,
        marginTop: 2,
        marginBottom: 2,
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
  res.setHeader(
    "Content-Disposition",
    `filename="F-DC-54-${userData.first_name} ${userData.last_name} - Semestre${activityData[0].semester}.pdf"`
  );
  res.setHeader("Content-Type", "application/pdf");

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(res);
  pdfDoc.end();
};

module.exports = generatePDF;
