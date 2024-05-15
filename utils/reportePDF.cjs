const axios = require("axios");
const fs = require("fs");
const path = require("path");
const PdfPrinter = require("pdfmake/src/printer");
const Logo = __dirname + "/logoUTS.png";

const { createCanvas, loadImage } = require("canvas");

const canvas = createCanvas(800, 400);
const ctx = canvas.getContext("2d");

const fonts = {
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

const printer = new PdfPrinter(fonts);

const reportePDF = ({ res, activityData }) => {
  let tableDocenteActividad = [
    [
      {
        text: `Docente`,
        style: "headerTitle",
        margin: [0, 15, 0, 15],
        rowSpan: 2,
      },
      {
        text: `Tipo de contato`,
        style: "headerTitle",
        margin: [0, 15, 0, 15],
        rowSpan: 2,
      },

      {
        text: `Docencia (50%)`,
        style: "Docenciadirecta",
        margin: [0, 15, 0, 15],
        rowSpan: 2,
      },

      {
        text: `Investigacion (15%)`,
        style: "Investigación",
        margin: [0, 15, 0, 15],
        rowSpan: 2,
      },

      {
        text: `Extensión (5%)`,
        style: "Extensión",
        margin: [0, 15, 0, 15],
        rowSpan: 2,
      },

      {
        text: `Otras actividades (30%)`,
        style: "headerTitle",
        margin: [0, 10, 0, 10],
        colSpan: 5,
      },
      {},
      {},
      {},
      {},

      {
        text: `Total horas`,
        margin: [0, 15, 0, 15],
        style: "header",
        rowSpan: 2,
      },
    ],
    [
      {},
      {},

      {},

      {},

      {},

      {
        text: `Procesos OACA`,
        style: "ProcesosOACA",
        margin: [30, 0, 0, 0],
      },
      { text: `Procesos ODA`, style: "ProcesosODA", margin: [30, 0, 0, 0] },
      { text: `Comités`, style: "Comités", margin: [30, 0, 0, 0] },
      { text: `Otras`, style: "Otras", margin: [30, 0, 0, 0] },
      {
        text: `Total otras actividades`,
        style: "header",
        margin: [30, 0, 0, 0],
      },

      {
        text: `Total horas`,
        margin: [0, 10, 0, 10],
        style: "header",
      },
    ],
  ];

  let columnDocencia = 0,
    columnInvestigacion = 0,
    columnExtension = 0,
    columnOACA = 0,
    columnODA = 0,
    columnComites = 0,
    columnOtras = 0,
    columnOtrasActividades = 0,
    columnTotal = 0;

  activityData.forEach((item) => {
    let countDocencia = 0,
      countInvestigacion = 0,
      countExtension = 0,
      countOACA = 0,
      countODA = 0,
      countComites = 0,
      countOtras = 0,
      countOtrasActividades = 0,
      countTotal = 0;

    item.actividad.forEach((activity) => {
      countTotal += activity.horas;
      if (activity.convencion === "Docencia directa") {
        countDocencia += activity.horas;
      } else if (activity.convencion === "Investigación") {
        countInvestigacion += activity.horas;
      } else if (activity.convencion === "Extensión") {
        countExtension += activity.horas;
      } else if (activity.convencion === "Procesos OACA") {
        countOACA += activity.horas;
      } else if (activity.convencion === "Procesos ODA") {
        countODA += activity.horas;
      } else if (activity.convencion === "Comités") {
        countComites += activity.horas;
      } else if (activity.convencion === "Otras") {
        countOtras += activity.horas;
      }
    });

    countOtrasActividades = countOACA + countODA + countComites + countOtras;
    (columnOtrasActividades += countOtrasActividades),
      (columnDocencia += countDocencia),
      (columnInvestigacion += countInvestigacion),
      (columnExtension += countExtension),
      (columnOACA += countOACA),
      (columnODA += countODA),
      (columnComites += countComites),
      (columnOtras += countOtras),
      (columnTotal += countTotal);

    tableDocenteActividad.push([
      {
        text: `${item.idDocente.nombres} ${item.idDocente.apellidos}`,
        style: "data",
      },
      {
        text: `${item.idDocente.vinculacion}`,
        style: "data",
      },

      { text: countDocencia.toFixed(2).toLocaleString(), style: "data" },

      { text: countInvestigacion.toFixed(2).toLocaleString(), style: "data" },
      { text: countExtension.toFixed(2).toLocaleString(), style: "data" },

      { text: countOACA.toFixed(2).toLocaleString(), style: "data" },
      { text: countODA.toFixed(2).toLocaleString(), style: "data" },
      { text: countComites.toFixed(2).toLocaleString(), style: "data" },
      { text: countOtras.toFixed(2).toLocaleString(), style: "data" },

      {
        text: countOtrasActividades.toFixed(2).toLocaleString(),
        style: "data",
      },
      { text: countTotal.toFixed(2).toLocaleString(), style: "data" },
    ]);
  });

  tableDocenteActividad.push(
    [
      {
        text: "Total horas por actividad",
        style: "headerTitle",
        colSpan: 2,
        rowSpan: 2,
        margin: [0, 7, 0, 0],
      },
      {},
      { text: columnDocencia.toFixed(2).toLocaleString(), style: "header" },
      {
        text: columnInvestigacion.toFixed(2).toLocaleString(),
        style: "header",
      },
      { text: columnExtension.toFixed(2).toLocaleString(), style: "header" },
      { text: columnOACA.toFixed(2).toLocaleString(), style: "header" },
      { text: columnODA.toFixed(2).toLocaleString(), style: "header" },
      { text: columnComites.toFixed(2).toLocaleString(), style: "header" },
      { text: columnOtras.toFixed(2).toLocaleString(), style: "header" },
      {
        text: columnOtrasActividades.toFixed(2).toLocaleString(),
        style: "header",
      },
      { text: columnTotal.toFixed(2).toLocaleString(), style: "header" },
    ],
    [
      {},
      {},
      {
        text: `${((columnDocencia / columnTotal) * 100).toFixed(1)}%`,
        style: "porcentajes",
      },
      {
        text: `${((columnInvestigacion / columnTotal) * 100).toFixed(1)}%`,
        style: "porcentajes",
      },
      {
        text: `${((columnExtension / columnTotal) * 100).toFixed(1)}%`,
        style: "porcentajes",
      },
      {
        text: `${((columnOACA / columnTotal) * 100).toFixed(1)}%`,
        style: "porcentajes",
      },
      {
        text: `${((columnODA / columnTotal) * 100).toFixed(1)}%`,
        style: "porcentajes",
      },
      {
        text: `${((columnComites / columnTotal) * 100).toFixed(1)}%`,
        style: "porcentajes",
      },
      {
        text: `${((columnOtras / columnTotal) * 100).toFixed(1)}%`,
        style: "porcentajes",
      },
      {
        text: `${((columnOtrasActividades / columnTotal) * 100).toFixed(1)}%`,
        style: "porcentajes",
      },
      {
        text: `${((columnTotal / columnTotal) * 100).toFixed(1)}%`,
        style: "porcentajes",
      },
    ]
  );

  // Definir datos para el diagrama circular
  const data = [
    (columnDocencia / columnTotal) * 100,
    (columnInvestigacion / columnTotal) * 100,
    (columnExtension / columnTotal) * 100,
    (columnOtrasActividades / columnTotal) * 100,
  ];
  const colors = ["#97ce81", "#d3e4f3", "#e9d4c1", "#b4b4b4"];

  // Calcular el total
  const total = data.reduce((acc, value) => acc + value, 0);

  // Definir el centro del círculo
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Definir el radio del círculo
  const radius = Math.min(canvas.width, canvas.height) / 2 - 10;

  // Dibujar el diagrama circular
  let startAngle = 0;
  for (let i = 0; i < data.length; i++) {
    const angle = (Math.PI * 2 * data[i]) / total;
    const endAngle = startAngle + angle;

    // Dibujar el sector
    ctx.beginPath();
    ctx.fillStyle = colors[i];
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
    ctx.font = "20px Arial";
    ctx.fillStyle = "#000";

    startAngle = endAngle;
  }

  const legend = [
    { label: "Docencia", color: "#97ce81" },
    { label: "Investigación", color: "#d3e4f3" },
    { label: "Extensión", color: "#e9d4c1" },
    { label: "Otras actividades", color: "#b4b4b4" },
    // Agrega más categorías según sea necesario
  ];

  // Dibujar la leyenda
  const legendX = 10; // Posición X de la leyenda
  let legendY = 10; // Posición Y inicial de la leyenda

  legend.forEach((item) => {
    ctx.fillStyle = item.color;
    ctx.fillRect(legendX, legendY, 20, 20); // Dibujar un cuadrado coloreado
    ctx.fillStyle = "#000"; // Color del texto
    ctx.fillText(item.label, legendX + 30, legendY + 15); // Escribir el texto al lado del cuadrado
    legendY += 25; // Incrementar la posición Y para la siguiente entrada de la leyenda
  });

  // Guardar el diagrama circular como imagen
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(__dirname + "/images/diagrama.png", buffer);

  const diagrama = __dirname + "/images/diagrama.png";

  const docDefinition = {
    pageSize: "A3",
    pageOrientation: "landscape",
    pageMargins: [20, 20, 20, 20],
    content: [
      {
        layout: "noBorders",
        table: {
          widths: ["auto", "*"],

          heights: 1,
          body: [
            [
              {
                image: Logo,
                fit: [100, 100],
                margin: [10, 0, 0, 5],
              },

              {
                text: `FORMATO DE DISTRIBUCIÓN DE LA ACTIVIDAD DOCENTE ${process.env.CURRENTSEMESTER}`,
                style: "title",
                margin: [0, 25, 0, 0],
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
            "auto",
            "auto",
            "auto",
            "auto",
            "auto",
            "auto",
            "auto",
            "auto",
            "auto",
            "auto",
          ],
          heights: 1,
          body: tableDocenteActividad,
        },
        margin: [0, 25, 0, 0],
      },

      {
        layout: "noBorders",
        table: {
          headerRows: 1,
          widths: ["auto", "*"],
          heights: 1,

          body: [
            [
              {
                table: {
                  headerRows: 1,
                  widths: ["auto", "auto", "auto"],
                  heights: 1,
                  body: [
                    [
                      {
                        text: "Consolidado",
                        style: "headerTitle",
                        colSpan: 3,
                      },
                      {},
                      {},
                    ],
                    [
                      { text: "", style: "headerTitle" },
                      {
                        text: "% DE REFERENCIA",
                        style: "headerTitle",
                      },
                      { text: "% REAL", style: "headerTitle" },
                    ],

                    [
                      { text: "Docencia", style: "Docenciadirecta" },
                      {
                        text: "50%",
                        style: "Docenciadirecta",
                      },
                      {
                        text: `${((columnDocencia / columnTotal) * 100).toFixed(
                          1
                        )}%`,
                        style: "Docenciadirecta",
                      },
                    ],

                    [
                      { text: "Investigación", style: "ProcesosOACA" },
                      {
                        text: "15%",
                        style: "ProcesosOACA",
                      },
                      {
                        text: `${(
                          (columnInvestigacion / columnTotal) *
                          100
                        ).toFixed(1)}%`,
                        style: "ProcesosOACA",
                      },
                    ],

                    [
                      { text: "Extensión", style: "Extensión" },
                      {
                        text: "5%",
                        style: "Extensión",
                      },
                      {
                        text: `${(
                          (columnExtension / columnTotal) *
                          100
                        ).toFixed(1)}%`,
                        style: "Extensión",
                      },
                    ],

                    [
                      { text: "Otras actividades", style: "Otras" },
                      {
                        text: "5%",
                        style: "Otras",
                      },
                      {
                        text: `${(
                          (columnOtrasActividades / columnTotal) *
                          100
                        ).toFixed(1)}%`,
                        style: "Otras",
                      },
                    ],
                    [
                      { text: "Totales", style: "headerTitle" },
                      {
                        text: "100%",
                        style: "headerTitle",
                      },
                      {
                        text: `${((columnTotal / columnTotal) * 100).toFixed(
                          1
                        )}%`,
                        style: "headerTitle",
                      },
                    ],
                  ],
                },
                margin: [0, 20, 0, 0],
              },

              {
                image: diagrama,
                fit: [400, 400],
                margin: [50, 50, 0, 0],
              },
            ],
          ],
        },
      },
    ],

    styles: {
      headerTitle: {
        fillColor: "#ededed",
        lineHeight: 1,
        alignment: "center",
        fontSize: 10,
        bold: true,
      },
      header: {
        fillColor: "#c4ea9e",
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
        bold: true,
      },
      Investigación: {
        lineHeight: 1,
        alignment: "center",
        fontSize: 10,
        fillColor: "#bddab2",
        bold: true,
      },
      Extensión: {
        lineHeight: 1,
        alignment: "center",
        fontSize: 10,
        fillColor: "#e9d4c1",
        bold: true,
      },
      ProcesosOACA: {
        lineHeight: 1,
        alignment: "center",
        fontSize: 10,
        fillColor: "#d3e4f3",
        bold: true,
      },
      ProcesosODA: {
        lineHeight: 1,
        alignment: "center",
        fontSize: 10,
        fillColor: "#87a4e4",
        bold: true,
      },
      Comités: {
        lineHeight: 1,
        alignment: "center",
        fontSize: 10,
        fillColor: "#f6ff7b",
        bold: true,
      },
      Otras: {
        lineHeight: 1,
        alignment: "center",
        fontSize: 10,
        fillColor: "#b4b4b4",
        bold: true,
      },
      porcentajes: {
        lineHeight: 1,
        alignment: "center",
        fontSize: 10,
        fillColor: "#e5f5d2",
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

module.exports = reportePDF;
