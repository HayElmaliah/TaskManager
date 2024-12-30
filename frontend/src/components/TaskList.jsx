import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertCircle, Calendar, LayoutDashboard, ChevronDown } from 'lucide-react';
import { format, isBefore, addDays } from 'date-fns';
import NewTaskPopup from './NewTaskPopup';
import EditTaskPopup from './EditTaskPopup';

const COLORS = ['#60A5FA', '#FCD34D', '#34D399', '#F87171'];

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

const STATUS_COLORS = {
  1: "bg-gray-200 text-gray-800",
  2: "bg-blue-200 text-blue-800",
  3: "bg-yellow-200 text-yellow-800",
  4: "bg-green-200 text-green-800",
  5: "bg-red-200 text-red-800",
};

const TaskList = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState('table');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showNewTaskPopup, setShowNewTaskPopup] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  
  const userDropdownRef = useRef(null);

  useEffect(() => {
    // Add click outside listener for dropdown
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    fetchTasks();

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [user]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddTask = async (newTask) => {
    try {
      const response = await axios.post(
        "https://taktick-backend.onrender.com/api/tasks",
        newTask,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setTasks([...tasks, response.data]);
      setShowNewTaskPopup(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const response = await axios.put(
        `https://taktick-backend.onrender.com/api/tasks/${updatedTask.task_id}`,
        updatedTask,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setTasks(tasks.map(task => task.task_id === updatedTask.task_id ? response.data : task));
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`https://taktick-backend.onrender.com/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(tasks.filter((task) => task.task_id !== taskId));
      setSelectedTaskId(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleCloneTask = async (task) => {
    try {
      // Create clean clone data without _id and task_id
      const { _id, task_id, ...cloneData } = task;
      const clonePayload = {
        ...cloneData,
        title: `Clone - ${task.title}`,
        create_date: new Date(),
        update_date: new Date(),
        status_id: 1,
        assigned_user_id: user._id,
      };

      await handleAddTask(clonePayload);
    } catch (error) {
      console.error('Error cloning task:', error);
    }
  };

  // Calculate status statistics
  const getStatusStats = () => {
    const total = tasks.length;
    if (total === 0) return [];
    
    const statusCounts = tasks.reduce((acc, task) => {
      acc[task.status_id] = (acc[task.status_id] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(STATUS_LABELS).map(([id, label]) => ({
      name: label,
      value: (statusCounts[id] || 0),
      percentage: ((statusCounts[id] || 0) / total * 100).toFixed(1)
    }));
  };

  // Get tasks that need attention (due within 3 days and not completed)
  const getUrgentTasks = () => {
    const threeDaysFromNow = addDays(new Date(), 3);
    return tasks.filter(task => 
      task.status_id !== 4 && // Not completed
      task.due_date && // Has due date
      isBefore(new Date(task.due_date), threeDaysFromNow) // Due within 3 days
    );
  };

  // Sort tasks by due date and priority
  const getSortedTasks = () => {
    return [...tasks]
      .filter(task => task.status_id !== 4 && task.status_id !== 5) // Filter out completed and deleted tasks
      .sort((a, b) => {
        // First sort by due date
        const dateA = new Date(a.due_date);
        const dateB = new Date(b.due_date);
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        
        // Then by priority (higher priority first)
        return b.priority_id - a.priority_id;
      });
  };

  const handleTaskAction = (action) => {
    const task = tasks.find(t => t.task_id === selectedTaskId);
    if (!task) return;

    switch (action) {
      case 'edit':
        setEditingTask(task);
        break;
      case 'delete':
        handleDeleteTask(task.task_id);
        break;
      case 'clone':
        handleCloneTask(task);
        break;
    }
    setSelectedTaskId(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-zinc-800 border-b border-zinc-700">
        <div className="max-w-7xl mx-auto w-full px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-cyan-400">Task Track</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setView(view === 'table' ? 'workspace' : 'table')}
                className="flex items-center gap-2 px-3 py-2 text-zinc-400 hover:text-cyan-400 transition-colors"
              >
                {view === 'table' ? (
                  <><LayoutDashboard size={18} /> Workspace</>
                ) : (
                  <><Calendar size={18} /> Table View</>
                )}
              </button>
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 px-3 py-2 text-white hover:text-cyan-400 transition-colors"
                >
                  <span>{user.username}</span>
                  <ChevronDown size={16} />
                </button>
                {showUserDropdown && (
                  <div className="absolute right-0 mt-1 w-48 bg-zinc-800 rounded-lg shadow-lg border border-zinc-700 overflow-hidden">
                    <button
                      onClick={onLogout}
                      className="w-full px-4 py-2 text-left text-sm text-white hover:bg-zinc-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Alerts Section */}
          {getUrgentTasks().length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
              <div className="flex items-center gap-3 text-amber-400">
                <AlertCircle size={20} />
                <h3 className="font-medium">Attention Needed</h3>
              </div>
              <ul className="mt-2 space-y-1">
                {getUrgentTasks().map(task => (
                  <li key={task.task_id} className="text-sm text-zinc-400">
                    "{task.title}" is due {format(new Date(task.due_date), 'MMM d')}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {view === 'workspace' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Distribution */}
              <div className="bg-zinc-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-cyan-400 mb-4">Status Distribution</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getStatusStats()}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                      >
                        {getStatusStats().map((entry, index) => (
                          <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Upcoming Tasks */}
              <div className="bg-zinc-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-cyan-400 mb-4">Upcoming Tasks</h2>
                <div className="space-y-3">
                  {getSortedTasks().slice(0, 5).map(task => (
                    <div
                      key={task.task_id}
                      className="flex items-center justify-between p-3 bg-zinc-700/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="text-zinc-200">{task.title}</h3>
                        <p className="text-sm text-zinc-400">
                          Due: {format(new Date(task.due_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded ${STATUS_COLORS[task.status_id]}`}>
                        {STATUS_LABELS[task.status_id]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b border-zinc-700">
                <div className="flex items-center gap-4">
                  {selectedTaskId && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTaskAction('edit')}
                        className="px-3 py-1.5 text-sm bg-cyan-400/10 text-cyan-400 rounded-lg hover:bg-cyan-400/20"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleTaskAction('clone')}
                        className="px-3 py-1.5 text-sm bg-violet-400/10 text-violet-400 rounded-lg hover:bg-violet-400/20"
                      >
                        Clone
                      </button>
                      <button
                        onClick={() => handleTaskAction('delete')}
                        className="px-3 py-1.5 text-sm bg-red-400/10 text-red-400 rounded-lg hover:bg-red-400/20"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowNewTaskPopup(true)}
                  className="px-4 py-2 bg-cyan-400 text-white rounded-lg hover:bg-cyan-500 transition-colors"
                >
                  Add New Task
                </button>
              </div>

              {/* Tasks List */}
              <div className="p-4 space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.task_id}
                    className="bg-zinc-700/30 rounded-lg overflow-hidden hover:bg-zinc-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 p-4">
                      <div
                        className="w-5 h-5 rounded border-2 border-zinc-600 cursor-pointer flex items-center justify-center flex-shrink-0"
                        onClick={() => setSelectedTaskId(selectedTaskId === task.task_id ? null : task.task_id)}
                      >
                        {selectedTaskId === task.task_id && (
                          <div className="w-3 h-3 bg-cyan-400 rounded-sm" />
                        )}
                      </div>
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => setExpandedTaskId(expandedTaskId === task.task_id ? null : task.task_id)}
                      >
                        <div className="flex items-center gap-2">
                          <h3 className="text-zinc-200 font-medium truncate">{task.title}</h3>
                          <ChevronDown
                            size={16}
                            className={`text-zinc-400 transform transition-transform ${
                              expandedTaskId === task.task_id ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className={`px-2 py-1 text-sm rounded ${STATUS_COLORS[task.status_id]}`}>
                          {STATUS_LABELS[task.status_id]}
                        </div>
                      </div>
                    </div>
                    {expandedTaskId === task.task_id && (
                      <div className="px-4 pb-4 pt-2 border-t border-zinc-600/30">
                        <div className="space-y-2">
                          <p className="text-zinc-300">{task.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                            <span>Priority: {PRIORITY_LABELS[task.priority_id]}</span>
                            <span>Due: {format(new Date(task.due_date), 'MMM d, yyyy')}</span>
                            <span>Created: {format(new Date(task.create_date), 'MMM d, yyyy')}</span>
                            <span>Updated: {format(new Date(task.update_date), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Popups */}
      {showNewTaskPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-zinc-800 rounded-xl w-full max-w-md">
            <NewTaskPopup
              onAdd={handleAddTask}
              onClose={() => setShowNewTaskPopup(false)}
              user={user}
            />
          </div>
        </div>
      )}
      {editingTask && (
        <EditTaskPopup
          task={editingTask}
          onSave={handleUpdateTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};

export default TaskList;