const express = require("express");
const {
  getAnalytics,
  getCardsAnalytics,
  getPwdAnalytics,
  getResidencyAnalytics,
} = require("../../controllers/record/recordsController");
const router = express.Router();

router.route("/").get(getAnalytics);
router.route("/cards").get(getCardsAnalytics);
router.route("/pwd").get(getPwdAnalytics);
router.route("/residency").get(getResidencyAnalytics);

module.exports = router;
