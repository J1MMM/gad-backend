const bcrypt = require("bcrypt");
const User = require("../../model/User");
const nodeMailer = require("nodemailer");
const ROLES_LIST = require("../../config/roles_list");
const Record = require("../../model/Record");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const Employee = require("../../model/Employee");

// Extend dayjs with the required plugins
dayjs.extend(utc);
dayjs.extend(timezone);

function getLast7DaysLabels() {
  const labels = [];

  for (let i = 6; i >= 1; i--) {
    labels.push(dayjs().subtract(i, "day").format("ddd"));
  }

  labels.push("Today");

  return labels;
}

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
      completeAddress: `${obj.brgy}, ${obj.city} ${obj.province}`,
    }));
    res.json(records);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addRecords = async (req, res) => {
  const recordData = req.body;
  console.log(recordData);

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
      completeAddress: `${obj.brgy}, ${obj.city} ${obj.province}`,
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
    const [
      studentSpcResident,
      studentOutsideSPC,
      studentTotalRecords,
      studentTotalMale,
      studentTotalFemale,
    ] = await Promise.all([
      Record.countDocuments({ spcResident: "Yes", archived: false }),
      Record.countDocuments({ spcResident: "No", archived: false }),
      Record.countDocuments({ archived: false }),
      Record.countDocuments({ gender: "Male", archived: false }),
      Record.countDocuments({ gender: "Female", archived: false }),
    ]);

    const [
      employeeSpcResident,
      employeeOutsideSPC,
      employeeTotalRecords,
      employeeTotalMale,
      employeeTotalFemale,
    ] = await Promise.all([
      Employee.countDocuments({ spcResident: "Yes", archived: false }),
      Employee.countDocuments({ spcResident: "No", archived: false }),
      Employee.countDocuments({ archived: false }),
      Employee.countDocuments({ gender: "Man", archived: false }),
      Employee.countDocuments({ gender: "Woman", archived: false }),
    ]);
    //for person with disability chart
    const [
      pwdEmployeeTotalRecords,
      pwdEmployeeTotalMale,
      pwdEmployeeTotalFemale,
    ] = await Promise.all([
      Employee.countDocuments({
        disabilityStatus: "With Disability",
        archived: false,
      }),
      Employee.countDocuments({
        disabilityStatus: "With Disability",
        gender: "Man",
        archived: false,
      }),
      Employee.countDocuments({
        disabilityStatus: "With Disability",
        gender: "Woman",
        archived: false,
      }),
    ]);

    const [pwdStudentTotalRecords, pwdStudentTotalMale, pwdStudentTotalFemale] =
      await Promise.all([
        Record.countDocuments({
          disability: "Yes",
          archived: false,
        }),
        Record.countDocuments({
          disability: "Yes",
          gender: "Male",
          archived: false,
        }),
        Record.countDocuments({
          disability: "Yes",
          gender: "Female",
          archived: false,
        }),
      ]);

    const [
      studentAdded7DaysAgo,
      studentAdded6DaysAgo,
      studentAdded5DaysAgo,
      studentAdded4DaysAgo,
      studentAdded3DaysAgo,
      studentAdded2DaysAgo,
      studentAddedToday,
    ] = await Promise.all([
      Record.countDocuments({
        createdAt: {
          $gte: dayjs().subtract(6, "day").startOf("day").toDate(),
          $lt: dayjs().subtract(6, "day").endOf("day").toDate(),
        },
        archived: false,
      }),
      Record.countDocuments({
        createdAt: {
          $gte: dayjs().subtract(5, "day").startOf("day").toDate(),
          $lt: dayjs().subtract(5, "day").endOf("day").toDate(),
        },
        archived: false,
      }),
      Record.countDocuments({
        createdAt: {
          $gte: dayjs().subtract(4, "day").startOf("day").toDate(),
          $lt: dayjs().subtract(4, "day").endOf("day").toDate(),
        },
        archived: false,
      }),
      Record.countDocuments({
        createdAt: {
          $gte: dayjs().subtract(3, "day").startOf("day").toDate(),
          $lt: dayjs().subtract(3, "day").endOf("day").toDate(),
        },
        archived: false,
      }),
      Record.countDocuments({
        createdAt: {
          $gte: dayjs().subtract(2, "day").startOf("day").toDate(),
          $lt: dayjs().subtract(2, "day").endOf("day").toDate(),
        },
        archived: false,
      }),
      Record.countDocuments({
        createdAt: {
          $gte: dayjs().subtract(1, "day").startOf("day").toDate(),
          $lt: dayjs().subtract(1, "day").endOf("day").toDate(),
        },
        archived: false,
      }),
      Record.countDocuments({
        createdAt: {
          $gte: dayjs().startOf("day").toDate(),
          $lt: dayjs().endOf("day").toDate(),
        },
        archived: false,
      }),
    ]);
    const [
      employeeAdded7DaysAgo,
      employeeAdded6DaysAgo,
      employeeAdded5DaysAgo,
      employeeAdded4DaysAgo,
      employeeAdded3DaysAgo,
      employeeAdded2DaysAgo,
      employeeAddedToday,
    ] = await Promise.all([
      Employee.countDocuments({
        createdAt: {
          $gte: dayjs().subtract(6, "day").startOf("day").toDate(),
          $lt: dayjs().subtract(6, "day").endOf("day").toDate(),
        },
        archived: false,
      }),
      Employee.countDocuments({
        createdAt: {
          $gte: dayjs().subtract(5, "day").startOf("day").toDate(),
          $lt: dayjs().subtract(5, "day").endOf("day").toDate(),
        },
        archived: false,
      }),
      Employee.countDocuments({
        createdAt: {
          $gte: dayjs().subtract(4, "day").startOf("day").toDate(),
          $lt: dayjs().subtract(4, "day").endOf("day").toDate(),
        },
        archived: false,
      }),
      Employee.countDocuments({
        createdAt: {
          $gte: dayjs().subtract(3, "day").startOf("day").toDate(),
          $lt: dayjs().subtract(3, "day").endOf("day").toDate(),
        },
        archived: false,
      }),
      Employee.countDocuments({
        createdAt: {
          $gte: dayjs().subtract(2, "day").startOf("day").toDate(),
          $lt: dayjs().subtract(2, "day").endOf("day").toDate(),
        },
        archived: false,
      }),
      Employee.countDocuments({
        createdAt: {
          $gte: dayjs().subtract(1, "day").startOf("day").toDate(),
          $lt: dayjs().subtract(1, "day").endOf("day").toDate(),
        },
        archived: false,
      }),
      Employee.countDocuments({
        createdAt: {
          $gte: dayjs().startOf("day").toDate(),
          $lt: dayjs().endOf("day").toDate(),
        },
        archived: false,
      }),
    ]);

    const totalRecords = studentTotalRecords + employeeTotalRecords;
    const totalMale = studentTotalMale + employeeTotalMale;
    const totalFemale = studentTotalFemale + employeeTotalFemale;
    const totalOtherGender = totalRecords - (totalMale + totalFemale);
    const spcResident = studentSpcResident + employeeSpcResident;
    const outsideSPC = studentOutsideSPC + employeeOutsideSPC;

    const pwdTotal = pwdEmployeeTotalRecords + pwdStudentTotalRecords;
    const pwdTotalMale = pwdEmployeeTotalMale + pwdStudentTotalMale;
    const pwdTotalMalePercent = ((pwdTotalMale / pwdTotal) * 100).toFixed(2);
    const pwdTotalFemale = pwdEmployeeTotalFemale + pwdStudentTotalFemale;
    const pwdTotalFemalePercent = ((pwdTotalFemale / pwdTotal) * 100).toFixed(
      2
    );
    const pwdOtherGender = pwdTotal - (pwdTotalMale + pwdTotalFemale);
    const pwdOtherGenderPercent = ((pwdOtherGender / pwdTotal) * 100).toFixed(
      2
    );

    const response = {
      totalRecords,
      totalMale,
      totalFemale,
      totalOtherGender,

      pwdTotal,
      pwdTotalMalePercent,
      pwdTotalFemalePercent,
      pwdOtherGenderPercent,

      pwdChartData: [
        {
          id: 0,
          value: pwdTotalMale || 0,
          label: "Male",
          color: "#02A3FE",
        },
        {
          id: 1,
          value: pwdTotalFemale || 0,
          label: "Female",
          color: "#EC49A6",
        },
        {
          id: 2,
          value: pwdOtherGender || 0,
          label: "Others",
          color: "#FED808",
        },
      ],

      residencyChartData: [
        {
          id: 0,
          value: spcResident || 0,
          label: "SPC Resident",
          color: "#6200E8",
        },
        {
          id: 1,
          value: outsideSPC || 0,
          label: "Outside SPC",
          color: "#ECEDFC",
        },
      ],

      recordsOverview: [
        {
          color: "#2E96FF",
          data: [
            studentAdded7DaysAgo,
            studentAdded6DaysAgo,
            studentAdded5DaysAgo,
            studentAdded4DaysAgo,
            studentAdded3DaysAgo,
            studentAdded2DaysAgo,
            studentAddedToday,
          ],
          label: "Students",
        },
        {
          color: "#B800D8",
          data: [
            employeeAdded7DaysAgo,
            employeeAdded6DaysAgo,
            employeeAdded5DaysAgo,
            employeeAdded4DaysAgo,
            employeeAdded3DaysAgo,
            employeeAdded2DaysAgo,
            employeeAddedToday,
          ],
          label: "Employees",
        },
      ],

      recordsOverviewLabel: getLast7DaysLabels(),
    };

    res.json(response);
  } catch (error) {
    console.error("Error in getAnalytics:", error.stack || error);
    res.status(500).json({ message: "Internal Server Error" });
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
