import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    rollNo: "",
    name: "",
    semester: "",
    oddEven: "odd",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleRegister}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        {error && <p className="text-red-400">{error}</p>}

        <input
          type="text"
          name="rollNo"
          placeholder="Roll Number"
          value={form.rollNo}
          onChange={handleChange}
          className="w-full mb-3 p-2 rounded bg-gray-700"
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-3 p-2 rounded bg-gray-700"
        />
        <input
          type="number"
          name="semester"
          placeholder="Semester"
          value={form.semester}
          onChange={handleChange}
          className="w-full mb-3 p-2 rounded bg-gray-700"
        />
        <select
          name="oddEven"
          value={form.oddEven}
          onChange={handleChange}
          className="w-full mb-3 p-2 rounded bg-gray-700"
        >
          <option value="odd">Odd</option>
          <option value="even">Even</option>
        </select>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-3 p-2 rounded bg-gray-700"
        />
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 p-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
}
