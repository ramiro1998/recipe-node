const { response, request } = require("express");
const Recipe = require("../models/recipes");
const Ingredient = require("../models/ingredients");
const Usuario = require("../models/usuarios");
const mongoose = require("mongoose");

const getRecipes = async (req = request, res = response) => {
  const { auth } = req.query;

  const usuarioExiste = await Usuario.findOne({ token: auth });

  if (!usuarioExiste) {
    return res.status(400).json({
      msg: "Usuario no existente",
    });
  }

  const idString = usuarioExiste._id.toString();
  const recipes = await Recipe.find({ usuario: idString });
  const recipeIds = recipes.map((recipe) => recipe._id);
  const ingredients = await Ingredient.find({ recipe: { $in: recipeIds } });

  const dtoRecipesFull = [];
  recipes.forEach((rec) => {
    const ingredientsRecipes = ingredients.filter((i) => {
      if (i.recipe.equals(rec._id)) {
        return { name: i.name, amount: i.amoun };
      }
    });
    const dtoIngredient = [];
    ingredientsRecipes.forEach((ing) => {
      const ingFormat = {
        name: ing.name,
        amount: ing.amount,
      };
      dtoIngredient.push(ingFormat);
    });

    const dtoRecipe = {
      _id: rec._id,
      name: rec.name,
      description: rec.description,
      ingredients: dtoIngredient,
      imagePath: rec.imagePath,
    };
    dtoRecipesFull.push(dtoRecipe);
  });

  const cant_recipes = await Recipe.countDocuments();
  res.json(dtoRecipesFull);
};

const createRecipe = async (req, res = response) => {
  const { auth } = req.query;
  const { name, description, imagePath, ingredients } = req.body;

  const usuarioExiste = await Usuario.findOne({ token: auth });

  if (!usuarioExiste) {
    return res.status(400).json({
      msg: "Usuario no existente",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Crear la receta
    const newRecipe = new Recipe({
      name,
      description,
      imagePath,
      usuario: usuarioExiste._id,
    });

    const createdRecipe = await newRecipe.save({ session });

    // Crear los ingredientes y asignar la referencia a la receta
    const createdIngredients = await Promise.all(
      ingredients.map(async (ingred) => {
        const newIngredient = new Ingredient({
          name: ingred.name,
          amount: ingred.amount,
          recipe: createdRecipe._id, // Asignar la referencia a la receta
        });
        await newIngredient.save({ session });
        return newIngredient;
      })
    );

    // Confirmar la transacción
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ msg: "Receta y ingredientes creados exitosamente" });
  } catch (error) {
    // Deshacer la transacción en caso de error
    await session.abortTransaction();
    session.endSession();

    res
      .status(500)
      .json({ msg: "Error al crear la receta y los ingredientes", error });
  }
};

const editRecipe = async (req = request, res = response) => {
  const { id } = req.params;
  const { name, description, imagePath, ingredients } = req.body;

  const recipeExiste = await Recipe.findOne({ _id: id });

  if (!recipeExiste) {
    return res.status(400).json({
      msg: "Usuario no existente",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  if (req.usuario._id.toString() != recipeExiste.usuario._id.toString()) {
    return res.status(400).json({
      msg: "No tienes permisos para modificar esta receta",
    });
  }

  try {
    // Editar la receta
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      {
        name,
        description,
        imagePath,
      },
      { new: true, session }
    );

    // Eliminar los ingredientes anteriores de la receta
    await Ingredient.deleteMany({ recipe: id }, { session });

    // Crear los nuevos ingredientes y asignar la referencia a la receta
    const createdIngredients = await Promise.all(
      ingredients.map(async (ingred) => {
        const newIngredient = new Ingredient({
          name: ingred.name,
          amount: ingred.amount,
          recipe: id, // Asignar la referencia a la receta existente
        });
        await newIngredient.save({ session });
        return newIngredient;
      })
    );

    // Confirmar la transacción
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      msg: "Receta y ingredientes editados exitosamente",
      updatedRecipe,
    });
  } catch (error) {
    // Deshacer la transacción en caso de error
    await session.abortTransaction();
    session.endSession();

    res
      .status(500)
      .json({ msg: "Error al editar la receta y los ingredientes", error });
  }
};

const deleteRecipe = async (req = request, res = response) => {
  const { id } = req.params;

  const recipeExiste = await Recipe.findOne({ _id: id });

  if (!recipeExiste) {
    return res.status(400).json({
      msg: "Usuario no existente",
    });
  }

  if (req.usuario._id.toString() === recipeExiste.usuario._id.toString()) {
    // Eliminar los ingredientes anteriores de la receta
    await Ingredient.deleteMany({ recipe: id });
    await Recipe.findByIdAndDelete(id);
    return res.status(200).json({ msg: "delete ok" });
  }

  return res.status(400).json({
    msg: "No tienes permisos para eliminar esta receta",
  });
};

module.exports = {
  createRecipe,
  getRecipes,
  editRecipe,
  deleteRecipe,
};
