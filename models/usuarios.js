const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  correo: {
    type: String,
    required: [true, "El usuario es obligatorio"],
    unique: true,
  },
  contraseña: {
    type: String,
    required: [true, "La contraseña es obligatorio"],
  },
  token: {
    type: String,
  },
});

module.exports = model("Usuario", UsuarioSchema);
