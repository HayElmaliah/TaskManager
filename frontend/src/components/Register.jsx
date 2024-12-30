import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    console.log('Current Environment:', import.meta.env.MODE);
    console.log('API URL:', apiUrl);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      console.log('Attempting registration at:', `${apiUrl}/users/register`);
      
      // Send registration request
      const registerResponse = await axios.post(
        `${apiUrl}/users/register`, 
        { username, password }
      );
      console.log('Registration successful:', registerResponse.data);

      // Automatically log in the user after successful registration
      console.log('Attempting auto-login after registration');
      const loginResponse = await axios.post(
        `${apiUrl}/users/login`,
        { username, password }
      );
      console.log('Auto-login successful:', loginResponse.data);

      // Save the token to localStorage
      localStorage.setItem("user", JSON.stringify(loginResponse.data));

      // Redirect to task list page
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-zinc-900 text-white">
      <h1 className="text-cyan-400 text-3xl font-bold mb-6">Task Track</h1>
      
      {/* Environment indicator - only show in development */}
      {import.meta.env.DEV && (
        <div className="text-xs text-zinc-500 mb-2">
          API URL: {apiUrl}
        </div>
      )}
      
      <div className="bg-zinc-800 p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold text-cyan-400 mb-4">Create an Account</h2>
        {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-cyan-400 text-white rounded-lg font-medium hover:bg-cyan-500 transition-colors"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-zinc-400 mt-4">
          Already registered?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-cyan-400 cursor-pointer hover:underline"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;