const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

  updateExistingAdminPassword: async (req, res) => {
    const { id, password, confirmPassword } = req.body;

    // Check if password update is requested
    if (password) {
      // Validate and hash the new password
      const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password);
      if (!passwordValidation) {
        return res.status(400).json({
          message: "Error: password must contain at least one lowercase letter, one uppercase letter, one number and one special character, and be at least 8 characters long",
        });
      }
    }
    else{
      return res.status(400).json({ message: "passwords doesn't exists." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Error: passwords didn't match. Please try again.", p:password, cp:confirmPassword });
    }

    AdminModel.findOneAndUpdate(
      { _id: id },
      {
        password: await bcrypt.hash(password, 10),
      },
      { new: true, runValidators: true }
    )
      .then((updatedAdmin) => {
        if (!updatedAdmin) {
          return res.status(404).json({ message: "admin introuvable" });
        }
        res.status(200).json({
          message: "admin mis à jour avec succès",
          admin: updatedAdmin,
        });
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          return res
            .status(400)
            .json({ message: "Validation Errors", errors: err });
        }
        res
          .status(400)
          .json({ message: "Une erreur s'est produite", errors: err });
      });
  },
};
