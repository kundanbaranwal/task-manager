const Task = require("../models/Task");
const { getClient } = require("../config/redis");

const getTasks = async (req, res) => {
  const redisClient = getClient();
  const cacheKey = `tasks:${req.user.id}`;

  if (redisClient && redisClient.isOpen) {
    try {
      const cachedTasks = await redisClient.get(cacheKey);
      if (cachedTasks) {
        console.log("Cache Hit");
        return res.status(200).json(JSON.parse(cachedTasks));
      }
    } catch (error) {
      console.error("Redis Get Error:", error);
    }
  }

  console.log("Cache Miss");
  const tasks = await Task.find({ user: req.user.id });

  if (redisClient && redisClient.isOpen) {
    try {
      await redisClient.set(cacheKey, JSON.stringify(tasks), {
        EX: 3600, // Cache for 1 hour
      });
    } catch (error) {
      console.error("Redis Set Error:", error);
    }
  }

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

  // Invalidate cache
  const redisClient = getClient();
  if (redisClient && redisClient.isOpen) {
    try {
      await redisClient.del(`tasks:${req.user.id}`);
    } catch (error) {
      console.error("Redis Del Error:", error);
    }
  }

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

  // Invalidate cache
  const redisClient = getClient();
  if (redisClient && redisClient.isOpen) {
    try {
      await redisClient.del(`tasks:${req.user.id}`);
    } catch (error) {
      console.error("Redis Del Error:", error);
    }
  }

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

  // Invalidate cache
  const redisClient = getClient();
  if (redisClient && redisClient.isOpen) {
    try {
      await redisClient.del(`tasks:${req.user.id}`);
    } catch (error) {
      console.error("Redis Del Error:", error);
    }
  }

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
