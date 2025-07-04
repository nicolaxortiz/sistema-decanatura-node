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
  title,
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

      { text: `Otras`, style: "Otras", colSpan: 5 },
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
      { image: titles.otras1, width: 15, style: "Otras", marginTop: 50 },
      { image: titles.otras2, width: 15, style: "Otras" },
      { image: titles.otras3, width: 15, style: "Otras", marginTop: 40 },
      { image: titles.otras4, width: 15, style: "Otras" },
      { image: titles.total, width: 15, style: "Otras", marginTop: 30 },
    ],
  ];

  let columns = {
    columnOtras1: 0,
    columnOtras2: 0,
    columnOtras3: 0,
    columnOtras4: 0,
    columnOtrasTotal: 0,
    columnTotal: 0,
  };

  let columnOtrasActividades = 0;

  let countTeacher = 0;

  teachersData.forEach((teacher) => {
    countTeacher++;
    let counts = {
      countOtras1: 0,
      countOtras2: 0,
      countOtras3: 0,
      countOtras4: 0,
      countOtrasTotal: 0,
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

    counts.countOtrasTotal =
      counts.countOtras1 +
      counts.countOtras2 +
      counts.countOtras3 +
      counts.countOtras4;

    columns.columnOtras1 += counts.countOtras1;
    columns.columnOtras2 += counts.countOtras2;
    columns.columnOtras3 += counts.countOtras3;
    columns.columnOtras4 += counts.countOtras4;
    columns.columnOtrasTotal += counts.countOtrasTotal;

    columns.columnTotal += counts.countTotal;

    let tipoContrato = "";

    if (teacher.employment_type === "Carrera") {
      tipoContrato = "DC";
    } else if (teacher.employment_type === "Tiempo completo") {
      tipoContrato = "TC";
    } else if (teacher.employment_type === null) {
      tipoContrato = "";
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
      text: columns[key].toFixed(2),
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
                text: `${title}
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
          widths: [200, "auto", "auto", "auto", "auto", "auto", "auto", "auto"],
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
    `filename="Reporte de otras actividades ${semester} - ${program_name}.pdf"`
  );
  res.setHeader("Content-Type", "application/pdf");

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(res);
  pdfDoc.end();
};

module.exports = reportePDF;
