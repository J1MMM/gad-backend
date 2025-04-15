const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  fname: {
    type: String,
    required: true,
  },
  mname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  employeeIdNo: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: false,
  },
  age: {
    type: String,
    required: true,
  },
  civilStatus: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: false,
  },
  sexualOrientation: {
    type: String,
    required: false,
  },
  disabilityStatus: {
    type: String,
    required: false,
  },
  disabilitySpecify: {
    type: String,
    required: false,
  },
  ethnicGroup: {
    type: String,
    required: false,
  },
  noOfDependents: {
    type: String,
    required: false,
  },
  soloParent: {
    type: String,
    required: false,
  },
  caregivingResponsibilities: {
    type: String,
    required: false,
  },
  caregivingResponsibilitiesSpecify: {
    type: String,
    required: false,
  },
  educationalAttainment: {
    type: String,
    required: false,
  },
  employmentStatus: {
    type: String,
    required: false,
  },
  lengthOfService: {
    type: String,
    required: false,
  },
  attendGenderSensitivityTraining: {
    type: String,
    required: false,
  },
  trainingSpecify: {
    type: String,
    required: false,
  },
  yearAndTitleOfTraining: {
    type: String,
    required: false,
  },

  archived: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  archivedAt: {
    type: Date,
    required: false,
  },
});

module.exports = mongoose.model("Employee", employeeSchema);
