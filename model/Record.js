const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recordSchema = new Schema({
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
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  program: {
    type: String,
    required: true,
  },
  yearLevel: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  otherGender: {
    type: String,
    required: false,
  },
  governmentBenificiaries: {
    type: String,
    required: true,
  },

  comorbidity: {
    type: String,
    required: false,
  },
  PWD: {
    type: String,
    required: true,
  },
  socioEconomicStatus: {
    type: String,
    required: false,
  },
  spcResident: {
    type: String,
    required: true,
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

module.exports = mongoose.model("Record", recordSchema);
