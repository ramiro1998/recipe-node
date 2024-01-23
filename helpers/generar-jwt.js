const jwt = require("jsonwebtoken");

const generarJWT = (uid = "") => {
  return new Promise((resolve, reject) => {
    console.log("uidd", uid);
    const payload = { uid };
    jwt.sign(
      payload,
      process.env.TOKEN_SECRET,
      {
        expiresIn: "4h",
      },
      (err, token) => {
        if (err) {
          console.log("error", err);
          reject("no se pudo generar el token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  generarJWT,
};
