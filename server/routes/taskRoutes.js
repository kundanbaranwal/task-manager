const express = require("express");
const router = express.Router();
const {
  getTasks,
  setTask,
  updateTask,
  deleteTask,
  getTasksByUser,
} = require("../controllers/taskController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").get(protect, getTasks).post(protect, setTask);
router.route("/:id").put(protect, updateTask).delete(protect, deleteTask);
router.route("/user/:userId").get(protect, admin, getTasksByUser);

module.exports = router;
