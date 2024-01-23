const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { login, registro } = require("../controllers/auth");
const { generarJWT } = require("../helpers/generar-jwt");

const router = Router();

router.post(
  "/login",
  [
    check("email", "El correo es obligatorio").isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  login
);

router.post(
  "/signup",
  [
    check("email", "El correo es obligatorio").isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
    check("password", "Debe tener al menos 6 caracteres").isLength({ min: 6 }),
    validarCampos,
  ],
  registro
);

module.exports = router;
