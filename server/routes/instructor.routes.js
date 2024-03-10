const {
    register,
    findAllInstructors,
    findOneSingleInstructor,
    findSingleEntityInstructorOrAdmin,
    deleteOneSpecificInstructor,
    updateExistingInstructor,
    createInstructor,
  } = require("../controllers/instructor.controller");
  
  const { authenticate } = require('../config/jwt.config');

  const { checkPermissions } = require('../config/jwt.config');

  module.exports = app => {
      app.post("/api/registerInstructor", register);  
      app.post("/api/instructors",authenticate,checkPermissions('admin'), createInstructor); 
      app.get("/api/instructors",authenticate, checkPermissions('admin'), findAllInstructors);
      app.get('/api/instructors/:id',authenticate, checkPermissions('admin'), findOneSingleInstructor);
      app.get('/api/instructorOradmin/:id',authenticate, checkPermissions('admin','instructor','student'), findSingleEntityInstructorOrAdmin);
      app.patch("/api/instructors/:id",authenticate, checkPermissions('admin'), updateExistingInstructor);
      app.delete("/api/instructors/:id",authenticate, checkPermissions('admin'),  deleteOneSpecificInstructor);
  }
  
  
  
  
  
  