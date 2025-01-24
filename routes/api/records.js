const express = require("express");
const {
  getRecords,
  addRecords,
} = require("../../controllers/record/recordsController");
const router = express.Router();

router.route("/").get(getRecords).post(addRecords);

module.exports = router;
