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

    const records = result.map((obj) => ({
      ...obj.toObject(),
      id: obj._id,
      programYearSection: `${obj.program}-${obj.yearLevel}${obj.section}`,
      fullname: `${obj.fname} ${obj.mname} ${obj.lname}`,
    }));
    res.json(records);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addRecords = async (req, res) => {
  const recordData = req.body;

  // Validate input
  if (!recordData || Object.keys(recordData).length === 0) {
    return res.status(400).json({ message: "Record data is required." });
  }

  try {
    // Create the record in the database
    const result = await Record.create(recordData);

    // Respond with success
    res.status(201).json({
      message: "Record added successfully.",
      record: result,
    });
  } catch (error) {
    console.error("Error adding record:", error);

    // Respond with error details
    res
      .status(500)
      .json({ message: "Failed to add record.", error: error.message });
  }
};

module.exports = {
  getRecords,
  addRecords,
};
