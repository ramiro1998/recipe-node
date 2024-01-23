const { Schema, model } = require("mongoose");

const RecipeSchema = Schema({
  name: {
    type: String,
    required: [true, "El name es obligatorio"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "La description es obligatoria"],
  },
  imagePath: {
    type: String,
    required: [true, "La imagePath es obligatoria"],
  },
  usuario: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Usuario",
    require: true,
  },
  // ingredients: {
  //   type: [
  //     {
  //       name: Striing,
  //       amount: Number,
  //     },
  //   ],
  //   require: true,
  // },
  // userEmail: {
  //   type: String,
  // },
});

module.exports = model("Recipe", RecipeSchema);
