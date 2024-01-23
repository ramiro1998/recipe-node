const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuarios");

const validarJWT = async (req = request, res = response, next) => {
  const { auth } = req.query;

  if (!auth) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }

  try {
    const { uid } = jwt.verify(auth, process.env.TOKEN_SECRET);

    // Leer el usuario que corresponde al uid
    const usuario = await Usuario.findOne({ _id: uid });
    if (!usuario) {
      return res.status(401).status({
        msg: "Token no válido - usuario no existe DB",
      });
    }

    req.usuario = usuario;

    next();
  } catch (error) {
    console.log("err", error);
    return res.status(401).json({
      msg: "Token no válido",
    });
  }
};

module.exports = {
  validarJWT,
};
