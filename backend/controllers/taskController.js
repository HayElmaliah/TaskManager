const Task = require('../models/Task');

// Get all tasks for the authenticated user
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ 
      user_id: req.user._id,
      status_id: { $ne: 5 }
    }).sort('order');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

// Create a new task for the authenticated user
const createTask = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user found in request" });
      }
      
      // Find the highest task_id across all users
      const lastTask = await Task.findOne().sort('-task_id');
      const task_id = lastTask ? lastTask.task_id + 1 : 1;
  
      const maxOrderTask = await Task.findOne({ user_id: req.user._id }).sort('-order');
      const order = maxOrderTask ? maxOrderTask.order + 1 : 1;
  
      const task = new Task({
        ...req.body,
        task_id,
        order,
        user_id: req.user._id,
        assigned_user_id: req.body.assigned_user_id || req.user._id,
        create_date: new Date(),
        update_date: new Date(),
      });
  
      const newTask = await task.save();
      res.status(201).json(newTask);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ message: 'Error creating task', error: error.message });
    }
};

// Update a task for the authenticated user
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { task_id: req.params.task_id, user_id: req.user._id },
      { ...req.body, update_date: new Date() },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
};

// Delete a task (soft delete) for the authenticated user
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { task_id: req.params.task_id, user_id: req.user._id },
      { status_id: 5, update_date: new Date() },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};

// Update task order
const updateTaskOrder = async (req, res) => {
  try {
    const { task_id, new_order } = req.body;
    const task = await Task.findOne({ task_id, user_id: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const old_order = task.order;

    if (new_order > old_order) {
      await Task.updateMany(
        { user_id: req.user._id, order: { $gt: old_order, $lte: new_order } },
        { $inc: { order: -1 } }
      );
    } else if (new_order < old_order) {
      await Task.updateMany(
        { user_id: req.user._id, order: { $gte: new_order, $lt: old_order } },
        { $inc: { order: 1 } }
      );
    }

    task.order = new_order;
    await task.save();

    res.json({ message: 'Task order updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task order' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskOrder,
};