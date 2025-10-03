import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { rollNo, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "student") {
        navigate("/student-dashboard");
      } else {
        navigate("/admin-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-400">{error}</p>}

        <input
          type="text"
          placeholder="Roll Number"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-gray-700"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-gray-700"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 p-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
