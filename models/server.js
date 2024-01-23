const express = require("express");
const cors = require("cors");

const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuarioPath = "/api/usuario";
    this.authPath = "/api/auth";
    this.recipesPath = "/api/recipes";

    // Conectar a la base de datos
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Diectorio público
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.usuarioPath, require("../routes/usuario"));
    this.app.use(this.authPath, require("../routes/auth"));
    this.app.use(this.recipesPath, require("../routes/recipe"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

module.exports = Server;
