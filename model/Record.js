const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recordSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  location: {
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
  governmentBenificiaries: {
    type: String,
    required: true,
  },

  comorbidity: {
    type: String,
    required: true,
  },
  PWD: {
    type: String,
    required: true,
  },
  socioEconomicStatus: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Record", recordSchema);
