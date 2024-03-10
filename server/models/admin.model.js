const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Error: name is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Error: email is required"],
      validate: {
        validator: (val) => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Error: password is required"],
      validate: {
        validator: function(val) {
          return /^(?=.*[A-Z])(?=.{4,})/.test(val);
        },
        message: "Error: password must contain at least one uppercase letter and be at least 4 characters long",
      },
    },
    role: {
      type: String,
      default: "admin",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

AdminSchema.virtual("confirmPassword")
  .get(() => this._confirmPassword)
  .set((value) => (this._confirmPassword = value));

AdminSchema.pre("validate", function (next) {
  if (this.confirmPassword !== this.password) {
    this.invalidate(
      "confirmPassword",
      "Error: passwords didn't match. Please try again."
    );
  }

  next();
});

AdminSchema.pre("save", function (next) {
  bcrypt.hash(this.password, 10).then((hashedPassword) => {
    this.password = hashedPassword;
    next();
  });
});

const AdminModel = mongoose.model("Admin", AdminSchema);

module.exports = AdminModel;
