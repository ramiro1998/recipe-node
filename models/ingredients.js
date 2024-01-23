const { Schema, model } = require("mongoose");

const IngredientSchema = Schema({
  name: {
    type: String,
    required: [true, "El nombre del ingrediente es obligatorio"],
  },
  amount: {
    type: Number,
    required: [true, "La cantidad del ingrediente es obligatoria"],
  },
  recipe: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Recipe",
    require: true,
  },
});

module.exports = model("Ingredient", IngredientSchema);
