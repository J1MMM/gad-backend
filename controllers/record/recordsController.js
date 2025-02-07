const bcrypt = require("bcrypt");
const User = require("../../model/User");
const nodeMailer = require("nodemailer");
const ROLES_LIST = require("../../config/roles_list");
const Record = require("../../model/Record");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

// Extend dayjs with the required plugins
dayjs.extend(utc);
dayjs.extend(timezone);

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

const getAnalytics = async (req, res) => {
  try {
    const result = await Record.aggregate([
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" }, // MongoDB: 1 = Sunday, 7 = Saturday
          records: { $sum: 1 },
          archived: { $sum: { $cond: ["$archived", 1, 0] } },
        },
      },
      { $sort: { _id: 1 } }, // Sort by day of week
    ]);

    console.log("result 1");
    console.log(result);

    // Get today's index (0 = Sunday, 6 = Saturday)
    const todayIndex = new Date().getDay();

    // Define labels but replace today’s day with "Today"
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Initialize arrays with zeros
    let recordsData = new Array(7).fill(0);
    let archivedData = new Array(7).fill(0);

    // Fill data from MongoDB results
    result.forEach(({ _id, records, archived }) => {
      const dayIndex = (_id - 1) % 7; // Convert MongoDB (1-7) to JS (0-6)
      recordsData[dayIndex] = records;
      archivedData[dayIndex] = archived;
    });

    console.log("result 2");
    console.log(result);

    // **Ensure today's data is last in the array**
    const reorderedRecordsData = [
      ...recordsData.slice(todayIndex + 1),
      ...recordsData.slice(0, todayIndex),
      recordsData[todayIndex], // Move today’s value to the last index
    ];

    const reorderedArchivedData = [
      ...archivedData.slice(todayIndex + 1),
      ...archivedData.slice(0, todayIndex),
      archivedData[todayIndex], // Move today’s value to the last index
    ];

    const reorderedDays = [
      ...daysOfWeek.slice(todayIndex + 1),
      ...daysOfWeek.slice(0, todayIndex),
      "Today", // Replace the last label with "Today"
    ];

    const spcResident = await Record.countDocuments({
      spcResident: "YES",
      archived: false,
    });
    const outsideSPC = await Record.countDocuments({
      spcResident: "NO",
      archived: false,
    });
    const totalRecords = await Record.countDocuments({ archived: false });
    const totalMale = await Record.countDocuments({
      gender: "MALE",
      archived: false,
    });
    const totalFemale = await Record.countDocuments({
      gender: "FEMALE",
      archived: false,
    });
    const totalOtherGender = totalRecords - (totalMale + totalFemale);

    const _result = {
      totalRecords,
      totalMale,
      totalFemale,
      totalOtherGender,
      residencyData: [
        {
          id: 0,
          value: spcResident,
          label: "SPC Resident",
          color: "#075FC8",
        },
        {
          id: 1,
          value: outsideSPC,
          label: "Outside SPC",
          color: "#ECEDFC",
        },
      ],
      data: [
        { data: reorderedRecordsData, label: "Records" },
        { data: reorderedArchivedData, label: "Archived" },
      ],
      labels: reorderedDays,
    };

    res.json(_result);
  } catch (error) {
    console.log(error);

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
  getAnalytics,
};
