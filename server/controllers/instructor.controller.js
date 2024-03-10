const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const InstructorModel = require("../models/instructor.model");
const UserModel = require("../models/user.model");
const {
  main,
  sendNewInstructorNotification,
} = require("../notifications/notifications");



module.exports = {
  register: async (req, res) => {
    try {
      const newInstructor = new InstructorModel(req.body);

      const savedInstructor = await newInstructor.save();

      const instructorInfo = {
        _id: savedInstructor._id,
        name: savedInstructor.name,
        email: savedInstructor.email,
        role: "instructor",
        isInstructor: savedInstructor.isInstructor,
      };

      const instructorToken = jwt.sign(instructorInfo, process.env.JWT_SECRET);

      const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7200000),
      };

      res.cookie("usertoken", instructorToken, cookieOptions).json({
        message: "Successfully logged in",
        instructor: instructorInfo,
      });

      await sendNewInstructorNotification(instructorInfo); // Call the notification function
    } catch (err) {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: "Validation Errors", errors: err });
      }
      res.status(400).json({ message: "Something went wrong", errors: err });
    }
  },

  createInstructor: (req, res) => {
    const newInstructor = new InstructorModel(req.body);

    newInstructor
      .save()
      .then((newInstructor) => {
        res.status(201).json({
          message: "Instructor successfully created",
          instructor: newInstructor,
        });
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

  updateExistingInstructor: async (req, res) => {
    const { id, name, email, isInstructor, password } = req.body;

    InstructorModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        name: name,
        email: email,
        isInstructor: isInstructor,
        password: await bcrypt.hash(password, 10),
      },
      { new: true, runValidators: true }
    )
      .then((updatedInstructor) => {
        if (!updatedInstructor) {
          return res.status(404).json({ message: "instructeur introuvable" });
        }
        res.status(200).json({
          message: "instructeur mis à jour avec succès",
          instructor: updatedInstructor,
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

  findAllInstructors: (req, res) => {
    InstructorModel.find({})
      .then((allInstructors) => res.status(200).json(allInstructors))
      .catch((err) =>
        res.status(400).json({ message: "Something went wrong", error: err })
      );
  },

  findOneSingleInstructor: (req, res) => {
    InstructorModel.findOne({ _id: req.params.id })
      .then((oneSingleInstructor) => {
        console.log("oneSingleInstructor", oneSingleInstructor);
        res.json({ oneSingleInstructor });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },

  findOneSingleInstructorOrUser: async (req, res) => {
    const { id } = req.params;
    const entityType = req.params.entityType;

    const models = {
      instructor: InstructorModel,
      user: UserModel,
    };

    const model = models[entityType];
    if (!model) return res.status(400).json({ error: "Invalid entity type" });

    try {
      const entity = await model.findOne({ _id: id });
      if (!entity) return res.status(404).json({ error: "Entity not found" });
      res.json({ entity });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  findSingleEntityInstructorOrAdmin: async (req, res) => {
    const { id } = req.params;
    const instructor = await InstructorModel.findOne({ _id: id });
    const user = await UserModel.findOne({ _id: id });

    if (instructor) {
      try {
        if (!instructor)
          return res.status(404).json({ error: "Instructor not found" });
        return res.json({ result: instructor });
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    } else if (user) {
      try {
        if (!user) return res.status(404).json({ error: "User not found" });
        return res.json({ result: user });
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    } else {
      return res.status(400).json({ error: "Invalid entity type" });
    }
  },

  deleteOneSpecificInstructor: (req, res) => {
    InstructorModel.deleteOne({ _id: req.params.id })
      .then((result) => {
        res.json({ result });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },

  findInstructorsByManyId: (req, res) => {
    const { ids } = req.params.id;

    if (!ids || ids.length === 0) {
      return res.status(400).json({ message: "Liste d'IDs vide." });
    }

    InstructorModel.find({ _id: { $in: ids } })
      .then((instructors) => {
        if (!instructors || instructors.length === 0) {
          return res.status(404).json({ message: "Aucun utilisateur trouvé." });
        }

        res.json({ instructors });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },

  deleteAllInstructors: (req, res) => {
    InstructorModel.deleteMany({})
      .then((result) => res.status(200).json({ result }))
      .catch((err) =>
        res.status(400).json({ message: "Something went wrong", error: err })
      );
  },
};
