import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send({
      status: "error",
      message: "No se encontró el token",
    });
  } else {
    token = token.split(" ")[1];
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        status: "error",
        message: "Token inválido: " + err.message,
      });
    } else {
      req.user = decoded;
      next();
    }
  });
};

export const verifyTeacher = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).send({
      status: "error",
      message: "No tienes permisos para acceder a esta ruta",
    });
  }

  next();
};

export const verifyCoordinator = (req, res, next) => {
  if (req.user.role !== "coordinator") {
    return res.status(403).send({
      status: "error",
      message: "No tienes permisos para acceder a esta ruta",
    });
  }

  next();
};

export const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "campus") {
    return res.status(403).send({
      status: "error",
      message: "No tienes permisos para acceder a esta ruta",
    });
  }

  next();
};
