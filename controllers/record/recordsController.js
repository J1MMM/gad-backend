const bcrypt = require("bcrypt");
const User = require("../../model/User");
const nodeMailer = require("nodemailer");
const ROLES_LIST = require("../../config/roles_list");
const Record = require("../../model/Record");

const getRecords = async (req, res) => {
  try {
    const result = await Record.find();
    if (!result || result.length === 0) {
      return res.status(204).json({ message: "No records found" });
    }

    const records = result.map((obj) => ({ ...obj.toObject(), id: obj._id }));
    res.json(records);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getRecords,
};
