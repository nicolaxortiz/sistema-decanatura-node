const fs = require("fs");
const path = require("path");

async function getPath(document, image, type) {
  const pathImage = path.join(__dirname, "images", `${document}${type}.jpg`);

  await downloadImage(image, pathImage);
}

async function downloadImage(image, pathImage) {
  try {
    fs.writeFileSync(pathImage, image.buffer); // Si usas multer con memoryStorage
    return pathImage;
  } catch (error) {
    console.error("Error al guardar la imagen:", error);
    throw new Error("Error al guardar la imagen.");
  }
}

module.exports = getPath;
