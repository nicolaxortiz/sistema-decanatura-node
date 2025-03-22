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
  semester,
  program_name,
}) => {
  let tableDocenteActividad = [
    [
      {
        text: `Docente`,
        style: "headerTitle",
        rowSpan: 3,
        marginTop: 105,
      },

      {
        text: `Tipo de contrato`,
        style: "headerTitle",
        rowSpan: 3,
        marginTop: 100,
      },

      {
        text: `Docencia (50%)`,
        style: "Docenciadirecta",
        rowSpan: 3,
        marginTop: 100,
      },

      {
        text: `Investigación (15%)`,
        style: "Investigación",
        colSpan: 5,
        rowSpan: 2,
        marginTop: 8,
      },
      {},
      {},
      {},
      {},

      {
        text: `Extensión (5%)`,
        style: "Extensión",
        colSpan: 5,
        rowSpan: 2,
        marginTop: 7,
      },
      {},
      {},
      {},
      {},

      {
        text: `Otras actividades (30%)`,
        style: "Docenciadirecta",
        colSpan: 24,
      },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},

      {
        text: `Total otras actividades`,
        style: "Docenciadirecta",
        rowSpan: 3,
        marginTop: 100,
      },

      {
        text: `TOTAL HORAS`,
        style: "Docenciadirecta",
        rowSpan: 3,
        marginTop: 100,
      },
    ],

    [
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      { text: `Procesos OACA`, style: "ProcesosOACA", colSpan: 7 },
      {},
      {},
      {},
      {},
      {},
      {},
      { text: `Procesos ODA`, style: "ProcesosODA", colSpan: 9 },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      { text: `Comités`, style: "Comités", colSpan: 3 },
      {},
      {},
      { text: `Otras`, style: "Otras", colSpan: 5 },
      {},
      {},
      {},
      {},
    ],

    [
      {},
      {},
      {},
      {
        image: titles.investigacion1,
        width: 15,
        style: "Investigación",
        marginTop: 30,
      },
      {
        image: titles.investigacion2,
        width: 15,
        style: "Investigación",
        marginTop: 30,
      },
      {
        image: titles.investigacion3,
        width: 15,
        style: "Investigación",
        marginTop: 30,
      },
      {
        image: titles.investigacion4,
        width: 15,
        style: "Investigación",
        marginTop: 30,
      },
      {
        image: titles.total,
        width: 15,
        style: "Investigación",
        marginTop: 35,
      },
      {
        image: titles.extension1,
        width: 15,
        style: "Extensión",
        marginTop: 30,
      },
      {
        image: titles.extension2,
        width: 15,
        style: "Extensión",
        marginTop: 30,
      },
      {
        image: titles.extension3,
        width: 15,
        style: "Extensión",
        marginTop: 30,
      },
      {
        image: titles.extension4,
        width: 15,
        style: "Extensión",
        marginTop: 30,
      },
      { image: titles.total, width: 15, style: "Extensión", marginTop: 35 },

      { image: titles.oaca1, width: 15, style: "ProcesosOACA", marginTop: 30 },
      { image: titles.oaca2, width: 15, style: "ProcesosOACA", marginTop: 30 },
      { image: titles.oaca3, width: 15, style: "ProcesosOACA", marginTop: 30 },
      { image: titles.oaca4, width: 15, style: "ProcesosOACA", marginTop: 30 },
      { image: titles.oaca5, width: 15, style: "ProcesosOACA", marginTop: 30 },
      { image: titles.oaca6, width: 15, style: "ProcesosOACA", marginTop: 30 },
      { image: titles.total, width: 15, style: "ProcesosOACA", marginTop: 35 },
      { image: titles.oda1, width: 15, style: "ProcesosODA", marginTop: 30 },
      { image: titles.oda2, width: 15, style: "ProcesosODA", marginTop: 30 },
      { image: titles.oda3, width: 15, style: "ProcesosODA", marginTop: 30 },
      { image: titles.oda4, width: 15, style: "ProcesosODA", marginTop: 30 },
      { image: titles.oda5, width: 15, style: "ProcesosODA", marginTop: 30 },
      { image: titles.oda6, width: 15, style: "ProcesosODA", marginTop: 30 },
      { image: titles.oda7, width: 15, style: "ProcesosODA", marginTop: 30 },
      { image: titles.oda8, width: 15, style: "ProcesosODA", marginTop: 30 },
      { image: titles.total, width: 15, style: "ProcesosODA", marginTop: 30 },
      { image: titles.comites1, width: 15, style: "Comités", marginTop: 30 },
      { image: titles.comites2, width: 15, style: "Comités", marginTop: 30 },
      { image: titles.total, width: 15, style: "Comités", marginTop: 35 },
      { image: titles.otras1, width: 15, style: "Otras", marginTop: 50 },
      { image: titles.otras2, width: 15, style: "Otras" },
      { image: titles.otras3, width: 15, style: "Otras", marginTop: 40 },
      { image: titles.otras4, width: 15, style: "Otras" },
      { image: titles.total, width: 15, style: "Otras", marginTop: 30 },
    ],
  ];

  let columns = {
    columnDocencia: 0,
    columnInvestigación1: 0,
    columnInvestigación2: 0,
    columnInvestigación3: 0,
    columnInvestigación4: 0,
    columnInvestigaciónTotal: 0,
    columnExtensión1: 0,
    columnExtensión2: 0,
    columnExtensión3: 0,
    columnExtensión4: 0,
    columnExtensiónTotal: 0,
    columnOACA1: 0,
    columnOACA2: 0,
    columnOACA3: 0,
    columnOACA4: 0,
    columnOACA5: 0,
    columnOACA6: 0,
    columnOACATotal: 0,
    columnODA1: 0,
    columnODA2: 0,
    columnODA3: 0,
    columnODA4: 0,
    columnODA5: 0,
    columnODA6: 0,
    columnODA7: 0,
    columnODA8: 0,
    columnODATotal: 0,
    columnComités1: 0,
    columnComités2: 0,
    columnComitésTotal: 0,
    columnOtras1: 0,
    columnOtras2: 0,
    columnOtras3: 0,
    columnOtras4: 0,
    columnOtrasTotal: 0,
    columnOtrasActividadesTotal: 0,
    columnTotal: 0,
  };

  let countTeacher = 0;

  teachersData.forEach((teacher) => {
    countTeacher++;
    let counts = {
      countDocencia: 0,
      countInvestigación1: 0,
      countInvestigación2: 0,
      countInvestigación3: 0,
      countInvestigación4: 0,
      countInvestigaciónTotal: 0,
      countExtensión1: 0,
      countExtensión2: 0,
      countExtensión3: 0,
      countExtensión4: 0,
      countExtensiónTotal: 0,
      countOACA1: 0,
      countOACA2: 0,
      countOACA3: 0,
      countOACA4: 0,
      countOACA5: 0,
      countOACA6: 0,
      countOACATotal: 0,
      countODA1: 0,
      countODA2: 0,
      countODA3: 0,
      countODA4: 0,
      countODA5: 0,
      countODA6: 0,
      countODA7: 0,
      countODA8: 0,
      countODATotal: 0,
      countComités1: 0,
      countComités2: 0,
      countComitésTotal: 0,
      countOtras1: 0,
      countOtras2: 0,
      countOtras3: 0,
      countOtras4: 0,
      countOtrasTotal: 0,
      countOtrasActividadesTotal: 0,
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

    counts.countInvestigaciónTotal =
      counts.countInvestigación1 +
      counts.countInvestigación2 +
      counts.countInvestigación3 +
      counts.countInvestigación4;

    counts.countExtensiónTotal =
      counts.countExtensión1 +
      counts.countExtensión2 +
      counts.countExtensión3 +
      counts.countExtensión4;

    counts.countOACATotal =
      counts.countOACA1 +
      counts.countOACA2 +
      counts.countOACA3 +
      counts.countOACA4 +
      counts.countOACA5 +
      counts.countOACA6;

    counts.countODATotal =
      counts.countODA1 +
      counts.countODA2 +
      counts.countODA3 +
      counts.countODA4 +
      counts.countODA5 +
      counts.countODA6 +
      counts.countODA7 +
      counts.countODA8;

    counts.countComitésTotal = counts.countComités1 + counts.countComités2;

    counts.countOtrasTotal =
      counts.countOtras1 +
      counts.countOtras2 +
      counts.countOtras3 +
      counts.countOtras4;

    counts.countOtrasActividadesTotal =
      counts.countOACATotal +
      counts.countODATotal +
      counts.countComitésTotal +
      counts.countOtrasTotal;

    columns.columnDocencia += counts.countDocencia;

    columns.columnInvestigación1 += counts.countInvestigación1;
    columns.columnInvestigación2 += counts.countInvestigación2;
    columns.columnInvestigación3 += counts.countInvestigación3;
    columns.columnInvestigación4 += counts.countInvestigación4;
    columns.columnInvestigaciónTotal += counts.countInvestigaciónTotal;

    columns.columnExtensión1 += counts.countExtensión1;
    columns.columnExtensión2 += counts.countExtensión2;
    columns.columnExtensión3 += counts.countExtensión3;
    columns.columnExtensión4 += counts.countExtensión4;
    columns.columnExtensiónTotal += counts.countExtensiónTotal;

    columns.columnOACA1 += counts.countOACA1;
    columns.columnOACA2 += counts.countOACA2;
    columns.columnOACA3 += counts.countOACA3;
    columns.columnOACA4 += counts.countOACA4;
    columns.columnOACA5 += counts.countOACA5;
    columns.columnOACA6 += counts.countOACA6;
    columns.columnOACATotal += counts.countOACATotal;

    columns.columnODA1 += counts.countODA1;
    columns.columnODA2 += counts.countODA2;
    columns.columnODA3 += counts.countODA3;
    columns.columnODA4 += counts.countODA4;
    columns.columnODA5 += counts.countODA5;
    columns.columnODA6 += counts.countODA6;
    columns.columnODA7 += counts.countODA7;
    columns.columnODA8 += counts.countODA8;
    columns.columnODATotal += counts.countODATotal;

    columns.columnComités1 += counts.countComités1;
    columns.columnComités2 += counts.countComités2;
    columns.columnComitésTotal += counts.countComitésTotal;

    columns.columnOtras1 += counts.countOtras1;
    columns.columnOtras2 += counts.countOtras2;
    columns.columnOtras3 += counts.countOtras3;
    columns.columnOtras4 += counts.countOtras4;
    columns.columnOtrasTotal += counts.countOtrasTotal;

    columns.columnOtrasActividadesTotal += counts.countOtrasActividadesTotal;
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
          : ((columns[key] / columns.columnTotal) * 100).toFixed(1) + "%",
      style: "totalPercent",
    })),
  ]);

  // Definir datos para el diagrama circular
  const data = [
    (columns.columnDocencia / columns.columnTotal) * 100,
    (columns.columnInvestigaciónTotal / columns.columnTotal) * 100,
    (columns.columnExtensiónTotal / columns.columnTotal) * 100,
    (columns.columnOtrasActividadesTotal / columns.columnTotal) * 100,
  ];
  const colors = ["#97ce81", "#d3e4f3", "#e9d4c1", "#DADADA"];

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
    { label: "Otras actividades", color: "#DADADA" },
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
    pageSize: { width: 1500, height: 1000 },
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
                        text: `${(
                          (columns.columnDocencia / columns.columnTotal) *
                          100
                        ).toFixed(1)}%`,
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
                          (columns.columnInvestigaciónTotal /
                            columns.columnTotal) *
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
                          (columns.columnExtensiónTotal / columns.columnTotal) *
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
                          (columns.columnOtrasActividadesTotal /
                            columns.columnTotal) *
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
                        text: `${(
                          (columns.columnTotal / columns.columnTotal) *
                          100
                        ).toFixed(1)}%`,
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
    `filename="Reporte de distribución de la actividad docente ${semester} - ${program_name}.pdf"`
  );

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(res);
  pdfDoc.end();
};

module.exports = reportePDF;
