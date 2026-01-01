const Task = require("../models/Task");

const getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });

  res.status(200).json(tasks);
};

const setTask = async (req, res) => {
  if (!req.body.title) {
    res.status(400).json({ message: "Please add a title" });
    return;
  }

  const task = await Task.create({
    title: req.body.title,
    description: req.body.description,
    user: req.user.id,
  });

  res.status(200).json(task);
};

const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(400).json({ message: "Task not found" });
    return;
  }

  if (!req.user) {
    res.status(401).json({ message: "User not found" });
    return;
  }

  if (task.user.toString() !== req.user.id) {
    res.status(401).json({ message: "User not authorized" });
    return;
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedTask);
};

const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(400).json({ message: "Task not found" });
    return;
  }

  if (!req.user) {
    res.status(401).json({ message: "User not found" });
    return;
  }

  if (task.user.toString() !== req.user.id) {
    res.status(401).json({ message: "User not authorized" });
    return;
  }

  await task.deleteOne();

  res.status(200).json({ id: req.params.id });
};

const getTasksByUser = async (req, res) => {
  const tasks = await Task.find({ user: req.params.userId });
  res.status(200).json(tasks);
};

module.exports = {
  getTasks,
  setTask,
  updateTask,
  deleteTask,
  getTasksByUser,
};
