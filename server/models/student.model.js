const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const StudentSchema = new mongoose.Schema(
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
      default: "student",
      required: true,
    },
    fieldOfStudy: {
      type: String,
      enum: ["Web developement", "data analyst", "ux design"],
      default: "Web developement",
      required: [true, "A field Of Study is required"],
    },
    levelStudent: {
      type: Number,
      required: [true, "A level is required"],
      min: [1, "level must be a minimum of 1"],
      max: [5, "level should be no more than 5"],
    },
  },
  {
    timestamps: true,
  }
);

StudentSchema.virtual("confirmPassword")
  .get(() => this._confirmPassword)
  .set((value) => (this._confirmPassword = value));

StudentSchema.pre("validate", function (next) {
  if (this.confirmPassword !== this.password) {
    this.invalidate(
      "confirmPassword",
      "Error: passwords didn't match. Please try again."
    );
  }

  next();
});

StudentSchema.pre("save", function (next) {
  bcrypt.hash(this.password, 10).then((hashedPassword) => {
    this.password = hashedPassword;
    next();
  });
});

const StudentModel = mongoose.model("Student", StudentSchema);

module.exports = StudentModel;
