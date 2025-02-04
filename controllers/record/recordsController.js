const bcrypt = require("bcrypt");
const User = require("../../model/User");
const nodeMailer = require("nodemailer");
const ROLES_LIST = require("../../config/roles_list");
const Record = require("../../model/Record");

const getRecords = async (req, res) => {
  try {
    const result = await Record.find({ archived: false });
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

const archiveRecord = async (req, res) => {
  const { id } = req.params;

  try {
    const record = await Record.findOne({ _id: id });

    if (!record) {
      return res.status(404).json({ message: "Record not found." });
    }

    record.archived = true;
    record.archivedAt = new Date();
    await record.save();
    res.json({ message: "Record archived successfully." });
    console.log("Record archived successfully.");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRecord = async (req, res) => {
  const { id } = req.params;

  try {
    const record = await Record.findOne({ _id: id });

    if (!record) {
      return res.status(404).json({ message: "Record not found." });
    }
    await record.deleteOne();
    res.json({ message: "Record deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRecord = async (req, res) => {
  const recordData = req.body;

  try {
    const record = await Record.findById(recordData?.id);
    if (!record) {
      return res.status(404).json({ message: "Record not found." });
    }

    record.set(recordData);

    await record.save();
    res.json({ message: "Record updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllArchivedRecords = async (req, res) => {
  try {
    const result = await Record.find({ archived: true }).sort({
      archivedAt: 1,
    });
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

const restoreRecord = async (req, res) => {
  const { id } = req.params;

  try {
    const record = await Record.findOne({ _id: id });

    if (!record) {
      return res.status(404).json({ message: "Record not found." });
    }

    record.archived = false;
    record.archivedAt = null;
    await record.save();
    res.json({ message: "Record restored successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRecords,
  addRecords,
  updateRecord,
  deleteRecord,
  archiveRecord,
  getAllArchivedRecords,
  restoreRecord,
};
