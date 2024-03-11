
const AdminModel = require("../models/admin.model");

module.exports = {
  register: (req, res) => {
    if (req.body.keyCode !== process.env.KEY_CODE) {
      return res.status(400).json({ message: "Invalid keycode", errors: "Invalid keycode" });
    }

    const { keycode, ...adminData } = req.body;

    req.body = adminData;

    const newAdmin = new AdminModel(req.body);

    newAdmin
      .save()
      .then((newAdmin) => {
        res
          .status(201)
          .json({ message: "Admin successfully created", admin: newAdmin });
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          return res
            .status(400)
            .json({ message: "Validation Errors", errors: err });
        }
        res.status(400).json({ message: "Something went wrong", errors: err });
      });
  },
};
