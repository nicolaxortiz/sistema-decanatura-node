const fs = require("fs");
const PdfPrinter = require("pdfmake/src/printer");
const Logo = __dirname + "/logoUTS.png";

const titles = {
  comites1: __dirname + "/titles/comites1.png",
  comites2: __dirname + "/titles/comites2.png",
  extension1: __dirname + "/titles/extension1.png",
  extension2: __dirname + "/titles/extension2.png",
  extension3: __dirname + "/titles/extension3.png",
  extension4: __dirname + "/titles/extension4.png",
  investigacion1: __dirname + "/titles/investigacion1.png",
  investigacion2: __dirname + "/titles/investigacion2.png",
  investigacion3: __dirname + "/titles/investigacion3.png",
  investigacion4: __dirname + "/titles/investigacion4.png",
  oaca1: __dirname + "/titles/oaca1.png",
  oaca2: __dirname + "/titles/oaca2.png",
  oaca3: __dirname + "/titles/oaca3.png",
  oaca4: __dirname + "/titles/oaca4.png",
  oaca5: __dirname + "/titles/oaca5.png",
  oaca6: __dirname + "/titles/oaca6.png",
  oda1: __dirname + "/titles/oda1.png",
  oda2: __dirname + "/titles/oda2.png",
  oda3: __dirname + "/titles/oda3.png",
  oda4: __dirname + "/titles/oda4.png",
  oda5: __dirname + "/titles/oda5.png",
  oda6: __dirname + "/titles/oda6.png",
  oda7: __dirname + "/titles/oda7.png",
  oda8: __dirname + "/titles/oda8.png",
  otras1: __dirname + "/titles/otras1.png",
  otras2: __dirname + "/titles/otras2.png",
  otras3: __dirname + "/titles/otras3.png",
  otras4: __dirname + "/titles/otras4.png",
  total: __dirname + "/titles/total.png",
};

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

const reportePDF = ({
  res,
  teachersData,
  activitiesData,
  otherActivitiesData,
  semester,
  program_name,
}) => {
  let tableDocenteActividad = [
    [
      {
        text: `Docente`,
        style: "headerTitle",
        rowSpan: 2,
        marginTop: 105,
      },

      {
        text: `Tipo de contrato`,
        style: "headerTitle",
        rowSpan: 2,
        marginTop: 100,
      },

      { text: `Procesos ODA`, style: "ProcesosODA", colSpan: 9 },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},

      {
        text: `TOTAL HORAS`,
        style: "Docenciadirecta",
        rowSpan: 2,
        marginTop: 100,
      },
    ],

    [
      {},
      {},
      { image: titles.oda1, width: 15, style: "ProcesosODA", marginTop: 30 },
      { image: titles.oda2, width: 15, style: "ProcesosODA", marginTop: 30 },
      { image: titles.oda3, width: 15, style: "ProcesosODA", marginTop: 30 },
      { image: titles.oda4, width: 15, style: "ProcesosODA", marginTop: 30 },
      { image: titles.oda5, width: 15, style: "ProcesosODA", marginTop: 30 },
      { image: titles.oda6, width: 15, style: "ProcesosODA", marginTop: 30 },
      { image: titles.oda7, width: 15, style: "ProcesosODA", marginTop: 30 },
      { image: titles.oda8, width: 15, style: "ProcesosODA", marginTop: 30 },
      { image: titles.total, width: 15, style: "ProcesosODA", marginTop: 30 },
    ],
  ];

  let columns = {
    columnODA1: 0,
    columnODA2: 0,
    columnODA3: 0,
    columnODA4: 0,
    columnODA5: 0,
    columnODA6: 0,
    columnODA7: 0,
    columnODA8: 0,
    columnODATotal: 0,
    columnTotal: 0,
  };

  let columnOtrasActividades = 0;

  let countTeacher = 0;

  teachersData.forEach((teacher) => {
    countTeacher++;
    let counts = {
      countODA1: 0,
      countODA2: 0,
      countODA3: 0,
      countODA4: 0,
      countODA5: 0,
      countODA6: 0,
      countODA7: 0,
      countODA8: 0,
      countODATotal: 0,
      countTotal: 0,
    };

    activitiesData.forEach((activity) => {
      if (activity.teacher_id === teacher.id) {
        counts.countTotal += parseFloat(activity.hours);

        let countKey = `count${activity.consolidated}`;
        if (counts.hasOwnProperty(countKey)) {
          counts[countKey] += parseFloat(activity.hours);
        }
      }
    });

    counts.countODATotal =
      counts.countODA1 +
      counts.countODA2 +
      counts.countODA3 +
      counts.countODA4 +
      counts.countODA5 +
      counts.countODA6 +
      counts.countODA7 +
      counts.countODA8;

    columns.columnODA1 += counts.countODA1;
    columns.columnODA2 += counts.countODA2;
    columns.columnODA3 += counts.countODA3;
    columns.columnODA4 += counts.countODA4;
    columns.columnODA5 += counts.countODA5;
    columns.columnODA6 += counts.countODA6;
    columns.columnODA7 += counts.countODA7;
    columns.columnODA8 += counts.countODA8;
    columns.columnODATotal += counts.countODATotal;

    columns.columnTotal += counts.countTotal;

    let tipoContrato = "";

    if (teacher.employment_type === "Planta") {
      tipoContrato = "PP";
    } else if (teacher.employment_type === "Tiempo Completo") {
      tipoContrato = "TC";
    } else {
      tipoContrato = "MT";
    }

    tableDocenteActividad.push([
      {
        text: `${teacher.first_name} ${teacher.last_name}`,
        style: countTeacher % 2 === 0 ? "dataLeftPair" : "dataLeft",
      },
      {
        text: tipoContrato,
        style: countTeacher % 2 === 0 ? "dataPair" : "data",
      },

      ...Object.keys(counts).map((key) => ({
        text: counts[key],
        style: key.includes("Total")
          ? countTeacher % 2 === 0
            ? "totalStylePair"
            : "totalStyle"
          : countTeacher % 2 === 0
          ? "dataPair"
          : "data",
      })),
    ]);
  });

  teachersData.forEach((teacher) => {
    let counts = {
      countTotalOtras: 0,
    };

    otherActivitiesData.forEach((activity) => {
      if (activity.teacher_id === teacher.id) {
        counts.countTotalOtras += parseFloat(activity.hours);
      }
    });

    columnOtrasActividades += counts.countTotalOtras;
  });

  tableDocenteActividad.push([
    {
      text: "Total horas por actividad",
      style: "headerTitleGrey",
      colSpan: 2,
      rowSpan: 2,
      margin: [0, 7, 0, 0],
    },
    {},
    ...Object.keys(columns).map((key) => ({
      text: columns[key],
      style: key.includes("Total") ? "totalStyleFinal" : "Docenciadirecta",
    })),
  ]);

  tableDocenteActividad.push([
    {},
    {},
    ...Object.keys(columns).map((key) => ({
      text:
        columns[key] === 0
          ? columns[key] + "%"
          : (
              (columns[key] / (columns.columnTotal + columnOtrasActividades)) *
              100
            ).toFixed(1) + "%",
      style: "totalPercent",
    })),
  ]);

  const docDefinition = {
    pageSize: "A3",
    pageOrientation: "portrait",
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
                text: `FORMATO DE DISTRIBUCIÓN DE LA ACTIVIDAD DOCENTE ${semester}
                Programa: ${program_name}`,
                style: "title",
                margin: [0, 25, 0, 0],
              },
            ],
          ],
        },
      },

      {
        table: {
          widths: [
            200,
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
            "auto",
          ],
          heights: 1,
          body: tableDocenteActividad,
        },
        margin: [0, 25, 0, 0],
      },
    ],

    styles: {
      headerTitle: {
        fillColor: "#E2EFDA",
        lineHeight: 1,
        alignment: "center",
        fontSize: 10,
        bold: true,
      },
      headerTitleGrey: {
        fillColor: "#DADADA",
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
      },
      dataPair: {
        lineHeight: 1,
        alignment: "center",
        fontSize: 10,
        fillColor: "#E2EFDA",
      },
      totalStyle: {
        lineHeight: 1,
        alignment: "center",
        fontSize: 10,
        bold: true,
      },
      totalStylePair: {
        lineHeight: 1,
        alignment: "center",
        fontSize: 10,
        bold: true,
        fillColor: "#E2EFDA",
      },
      totalStyleFinal: {
        lineHeight: 1,
        alignment: "center",
        fontSize: 10,
        bold: true,
        fillColor: "#a5dc8e",
      },
      totalPercent: {
        lineHeight: 1,
        alignment: "center",
        fontSize: 10,
        fillColor: "#E2EFDA",
      },
      dataLeft: {
        lineHeight: 1,
        alignment: "left",
        fontSize: 10,
      },
      dataLeftPair: {
        lineHeight: 1,
        alignment: "left",
        fontSize: 10,
        fillColor: "#E2EFDA",
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
        fillColor: "#a5dc8e",
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
        fillColor: "#DADADA",
        bold: true,
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
    `filename="Reporte de procesos ODA ${semester} - ${program_name}.pdf"`
  );

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(res);
  pdfDoc.end();
};

module.exports = reportePDF;
