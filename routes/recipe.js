const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  createRecipe,
  getRecipes,
  editRecipe,
  deleteRecipe,
} = require("../controllers/recipe");
const { validarJWT } = require("../middlewares/validar-jwt");
const { existIngredients } = require("../middlewares/validar-ingredientes");

const router = Router();

router.get("/get", [validarJWT, validarCampos], getRecipes);

router.post(
  "/add",
  [
    validarJWT,
    check("name", "El name es obligatorio").not().isEmpty(),
    check("description", "El description es obligatorio").not().isEmpty(),
    check("imagePath", "El imagePath es obligatorio").not().isEmpty(),
    check("ingredients").custom((ingredients) => existIngredients(ingredients)),
    validarCampos,
  ],
  createRecipe
);

router.put(
  "/edit/:id",
  [
    validarJWT,
    check("name", "El name es obligatorio").not().isEmpty(),
    check("description", "El description es obligatorio").not().isEmpty(),
    check("imagePath", "El imagePath es obligatorio").not().isEmpty(),
    check("ingredients").custom((ingredients) => existIngredients(ingredients)),
    validarCampos,
  ],
  editRecipe
);

router.delete(
  "/delete/:id",
  [
    validarJWT,
    validarCampos,
  ],
  deleteRecipe
);

module.exports = router;
