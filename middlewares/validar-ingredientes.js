const existIngredients = (ingredients = []) => {
  console.log("ingggg", ingredients);
  if (ingredients.length == 0) {
    throw new Error(`No hay ingredientes`);
  }

  ingredients.forEach((ingred) => {
    if (!ingred.name || !ingred.amount) {
      throw new Error(`Ingredientes inválidos`);
    }
  });

  return true; // Devuelve true si no hay errores
};

module.exports = {
  existIngredients,
};
