const express = require("express");
const { getRecords } = require("../../controllers/record/recordsController");
const router = express.Router();

router.get("/", getRecords);

module.exports = router;
