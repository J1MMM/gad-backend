const express = require("express");
const {
  deleteEmployee,
  getEmployees,
  addEmployee,
  updateEmployee,
  archiveEmployee,
  restoreEmployee,
  getAllArchivedEmployees,
} = require("../../controllers/employeeController");
const router = express.Router();

router.route("/").get(getEmployees).post(addEmployee).patch(updateEmployee);
router
  .route("/:id")
  .delete(deleteEmployee)
  .patch(archiveEmployee)
  .put(restoreEmployee);
router.route("/archived").get(getAllArchivedEmployees);

module.exports = router;
