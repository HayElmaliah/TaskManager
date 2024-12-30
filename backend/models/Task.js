const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  task_id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  create_date: {
    type: Date,
    default: Date.now
  },
  update_date: {
    type: Date,
    default: Date.now
  },
  due_date: {
    type: Date,
    required: true
  },
  assigned_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  priority_id: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4], // 1-Low, 2-Medium, 3-High, 4-Urgent
    default: 1
  },
  status_id: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, 5], // 1-Draft, 2-In Progress, 3-On Hold, 4-Completed, 5-Deleted
    default: 1
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: Number,
    required: true
  }
});

// Update the update_date on every save
taskSchema.pre('save', function(next) {
  this.update_date = new Date();
  next();
});

module.exports = mongoose.model('Task', taskSchema, 'tasks');