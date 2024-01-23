const { Router } = require("express");
const { check } = require("express-validator");
const { createUsuario, usuariosGet } = require("../controllers/usuario");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.get(
  "/",
  [
    // check("correo", "El correo es obligatorio").isEmail(),
    // check("password", "El password es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  usuariosGet
);

module.exports = router;
