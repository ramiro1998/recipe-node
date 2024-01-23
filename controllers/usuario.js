const { response } = require("express");
const { request } = require("express");
const Usuario = require("../models/usuarios");
// const bcryptjs = require("bcryptjs");
// const { generarJWT } = require("../helpers/generar-jwt");

const usuariosGet = async (req, res = response) => {
  // si no existe nombre
  const usuarios = await Usuario.find();
  res.json({
    ok: true,
    msg: "get API - controlador",
    usuarios: usuarios,
  });
};

module.exports = {
  usuariosGet,
};
