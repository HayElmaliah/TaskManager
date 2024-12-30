import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      // Send registration request
      const registerResponse = await axios.post("http://localhost:5000/api/users/register", { username, password });

      // Automatically log in the user after successful registration
      const loginResponse = await axios.post("http://localhost:5000/api/users/login", {
        username,
        password,
      });

      // Save the token to localStorage
      localStorage.setItem("user", JSON.stringify(loginResponse.data));

      // Redirect to task list page
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message || error.message);
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-zinc-900 text-white">
      <h1 className="text-cyan-400 text-3xl font-bold mb-6">Task Track</h1>
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