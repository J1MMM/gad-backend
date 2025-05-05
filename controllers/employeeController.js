const Employee = require("../model/Employee");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

// Extend dayjs with the required plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const getEmployees = async (req, res) => {
  try {
    const result = await Employee.find({ archived: false }).sort({
      fullname: 1,
    });
    if (!result || result.length === 0) {
      return res.status(204).json({ message: "No records found" });
    }

    const records = result.map((obj) => ({
      ...obj.toObject(),
      id: obj._id,
      completeAddress: `${obj.brgy}, ${obj.city} ${obj.province}`,
    }));
    res.json(records);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addEmployee = async (req, res) => {
  const recordData = req.body;

  // Validate input
  if (!recordData || Object.keys(recordData).length === 0) {
    return res.status(400).json({ message: "Record data is required." });
  }

  try {
    // Create the record in the database
    const result = await Employee.create(recordData);

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

const archiveEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const record = await Employee.findOne({ _id: id });

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

const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const record = await Employee.findOne({ _id: id });

    if (!record) {
      return res.status(404).json({ message: "Record not found." });
    }
    await record.deleteOne();
    res.json({ message: "Record deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEmployee = async (req, res) => {
  const recordData = req.body;

  try {
    const record = await Employee.findById(recordData?.id);
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

const getAllArchivedEmployees = async (req, res) => {
  try {
    const result = await Employee.find({ archived: true }).sort({
      archivedAt: 1,
    });
    if (!result || result.length === 0) {
      return res.status(204).json({ message: "No records found" });
    }

    const records = result.map((obj) => ({
      ...obj.toObject(),
      id: obj._id,
      completeAddress: `${obj.brgy}, ${obj.city} ${obj.province}`,
    }));
    res.json(records);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const restoreEmployee = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const record = await Employee.findOne({ _id: id });

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
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  archiveEmployee,
  getAllArchivedEmployees,
  restoreEmployee,
};
