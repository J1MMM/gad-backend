const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recordSchema = new Schema({
  studentIdNo: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  brgy: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  age: {
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
  otherGender: {
    type: String,
    required: false,
  },
  pronouns: {
    type: String,
    required: false,
  },
  otherPronouns: {
    type: String,
    required: false,
  },
  civilStatus: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },

  school: {
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
  scholarship: {
    type: String,
    required: true,
  },
  academicStanding: {
    type: String,
    required: true,
  },
  otherAcademicStanding: {
    type: String,
    required: false,
  },
  livingArrangement: {
    type: String,
    required: true,
  },
  householdIncomeLevel: {
    type: String,
    required: true,
  },
  parttimeJob: {
    type: String,
    required: false,
  },
  sourceFinancialSupport: {
    type: String,
    required: false,
  },
  otherSourceFinancialSupport: {
    type: String,
    required: false,
  },
  disability: {
    type: String,
    required: false,
  },
  specifyDisability: {
    type: String,
    required: false,
  },
  accessHealthcare: {
    type: String,
    required: false,
  },
  healthInsuranceProgram: {
    type: String,
    required: false,
  },
  stressAnxiety: {
    type: String,
    required: false,
  },
  discrimination: {
    type: String,
    required: false,
  },
  studentOrganizations: {
    type: String,
    required: false,
  },
  specifyStudentOrganizations: {
    type: String,
    required: false,
  },
  GADSeminar: {
    type: String,
    required: false,
  },
  InterestedGADSeminar: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: false,
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
    required: false,
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
