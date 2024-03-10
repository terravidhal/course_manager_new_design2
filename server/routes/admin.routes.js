const { register } = require("../controllers/admin.controller");

module.exports = (app) => {
  app.post("/api/registerAdmin", register);
  // app.post("/api/loginAdmin", login);
};
