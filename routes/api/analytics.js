const express = require("express");
const { getAnalytics } = require("../../controllers/record/recordsController");
const router = express.Router();

router.route("/").get(getAnalytics);

module.exports = router;
