const express = require("express");
const {
  getRecords,
  addRecords,
  updateRecord,
  deleteRecord,
  archiveRecord,
  getAllArchivedRecords,
  restoreRecord,
} = require("../../controllers/record/recordsController");
const router = express.Router();

router.route("/").get(getRecords).post(addRecords).patch(updateRecord);
router
  .route("/:id")
  .delete(deleteRecord)
  .patch(archiveRecord)
  .put(restoreRecord);
router.route("/archived").get(getAllArchivedRecords);

module.exports = router;
