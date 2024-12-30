import React, { useState } from 'react';

const PRIORITY_LABELS = {
  1: "Low",
  2: "Medium",
  3: "High",
  4: "Urgent",
};

const STATUS_LABELS = {
  1: "Draft",
  2: "In Progress",
  3: "On Hold",
  4: "Completed",
  5: "Deleted",
};

const getMinDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString().split('T')[0];
  };

const EditTaskPopup = ({ task, onSave, onClose }) => {
  const [editedTask, setEditedTask] = useState({...task});

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-800 p-6 rounded-xl w-full max-w-md max-h-full overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-cyan-400">Edit Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
            <textarea
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 h-24"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Due Date</label>
            <input
              type="date"
              value={editedTask.due_date ? editedTask.due_date.split('T')[0] : ''}
              onChange={(e) => setEditedTask({ ...editedTask, due_date: e.target.value })}
              min={getMinDate()}
              className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Priority</label>
            <select
              value={editedTask.priority_id}
              onChange={(e) => setEditedTask({ ...editedTask, priority_id: Number(e.target.value) })}
              className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            >
              {Object.entries(PRIORITY_LABELS).map(([id, label]) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Status</label>
            <select
              value={editedTask.status_id}
              onChange={(e) => setEditedTask({ ...editedTask, status_id: Number(e.target.value) })}
              className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            >
              {Object.entries(STATUS_LABELS).map(([id, label]) => (
                <option key={id} value={id}>{label}</option>
              ))}
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskPopup;