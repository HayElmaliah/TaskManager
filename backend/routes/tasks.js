const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskOrder,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Wrap async functions for error handling
const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/', protect, asyncHandler(getTasks));
router.post('/', protect, asyncHandler(createTask));
router.put('/:task_id', protect, asyncHandler(updateTask));
router.delete('/:task_id', protect, asyncHandler(deleteTask));
router.put('/order', protect, asyncHandler(updateTaskOrder));

module.exports = router;
