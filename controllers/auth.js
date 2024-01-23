const { response } = require("express");
const { generarJWT } = require("../helpers/generar-jwt");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuarios");

const login = async (req, res = response) => { 
  const { email, password } = req.body;

  const usuarioNoExiste = await Usuario.findOne({ correo: email });

  if (!usuarioNoExiste) {
    return res.status(400).json({
      msg: "User not exists",
    });
  }

  // Generate JWT
  const idToken = await generarJWT(usuarioNoExiste._id);

  const validPassword = bcrypt.compareSync(
    password,
    usuarioNoExiste.contraseña
  );

  if (!validPassword) {
    return res.status(400).json({
      msg: "User / Password are wrong - password",
    });
  }

   // Save token in database
   usuarioNoExiste.token = idToken;
   await usuarioNoExiste.save();

  res.json({
    ok: true,
    msg: "login ok",
    idToken,
  });
};

const registro = async (req, res = response) => {
  try {
    const { email, password } = req.body;
    const newUser = {
      correo: email,
      contraseña: password,
    };

    const usuarioExiste = await Usuario.findOne({ correo: email });

    if (usuarioExiste) {
      return res.status(400).json({
        msg: "Existing user",
      });
    }

    newUser.contraseña = bcrypt.hashSync(newUser.contraseña, 10);

    const usuarioCreated = await new Usuario(newUser);

    usuarioCreated.save();

    res.json({
      ok: true,
      msg: "register ok",
      usuario: usuarioCreated,
    });
  } catch (error) {
    res.status(400).json({
      ok: true,
      msg: "Error creating user",
      error: error,
    });
  }
};

module.exports = {
  login,
  registro,
};
