import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import Login from './components/Login';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <div>
      {user ? (
        <TaskList user={user} onLogout={handleLogout} />
      ) : (
        <Login setUser={handleLogin} />
      )}
    </div>
  );
};

export default App;