import React, { useState } from 'react';

const getMinDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString().split('T')[0];
  };

const NewTaskPopup = ({ onAdd, onClose, user }) => {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: '',
    priority_id: 1,
    status_id: 1,
    assigned_user_id: user._id,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newTask);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-cyan-400">Add New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
          <textarea
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 h-24"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">Due Date</label>
          <input
            type="date"
            value={newTask.due_date}
            onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
            min={getMinDate()}
            className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">Priority</label>
          <select
            value={newTask.priority_id}
            onChange={(e) => setNewTask({ ...newTask, priority_id: Number(e.target.value) })}
            className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          >
            <option value={1}>Low</option>
            <option value={2}>Medium</option>
            <option value={3}>High</option>
            <option value={4}>Urgent</option>
          </select>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-400 text-white rounded-lg hover:bg-cyan-500 transition-colors"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTaskPopup;