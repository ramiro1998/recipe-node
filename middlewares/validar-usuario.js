const Usuario = require("../models/usuarios");

const validarUsuario = async (req, res, next) => {
  const usuarioExiste = await Usuario.findOne({ token: auth });

  if (!usuarioExiste) {
    return res.status(400).json({
      msg: "Usuario no existente",
    });
  }

  next();
};

module.exports = {
  validarUsuario,
};
