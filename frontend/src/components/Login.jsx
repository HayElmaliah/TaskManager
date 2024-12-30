import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Login = ({ setUser }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    console.log('Current Environment:', import.meta.env.MODE);
    console.log('API URL:', apiUrl);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log('Attempting login at:', `${apiUrl}/users/login`);
      
      const response = await axios.post(`${apiUrl}/users/login`, {
        username,
        password,
      });
      
      console.log('Login successful:', response.data);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log('Attempting registration at:', `${apiUrl}/users/register`);
      
      const response = await axios.post(`${apiUrl}/users/register`, {
        username,
        password,
      });

      console.log('Registration successful:', response.data);
      setSuccessMessage('Registration successful! You can now log in.');
      setIsRegistering(false);
      setError('');
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-zinc-900 text-white">
      {/* Logo */}
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">TakTick</h1>
      
      {/* Environment indicator - only show in development */}
      {import.meta.env.DEV && (
        <div className="text-xs text-zinc-500 mb-2">
          API URL: {apiUrl}
        </div>
      )}
      
      {/* Form Container */}
      <div className="bg-zinc-800 p-6 rounded-xl shadow-lg w-80">
        {isRegistering ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Register</h2>
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            {successMessage && <p className="text-green-400 text-sm mb-3">{successMessage}</p>}
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-400 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-cyan-400 text-white rounded-lg font-medium hover:bg-cyan-500 transition-colors"
              >
                Register
              </button>
            </form>
            <p className="mt-4 text-sm text-center">
              Already registered?{' '}
              <span
                className="text-cyan-400 cursor-pointer hover:underline"
                onClick={() => {
                  setIsRegistering(false);
                  setError('');
                  setSuccessMessage('');
                }}
              >
                Sign in
              </span>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Login</h2>
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-400 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-cyan-400 text-white rounded-lg font-medium hover:bg-cyan-500 transition-colors"
              >
                Login
              </button>
            </form>
            <p className="mt-4 text-sm text-center">
              New here?{' '}
              <span
                className="text-cyan-400 cursor-pointer hover:underline"
                onClick={() => {
                  setIsRegistering(true);
                  setError('');
                  setSuccessMessage('');
                }}
              >
                Create an account
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;