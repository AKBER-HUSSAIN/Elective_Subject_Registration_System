import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <h1 className="text-4xl font-extrabold mb-4 text-center">
        Elective Subject Registration System
      </h1>
      <p className="mb-6 text-gray-300 text-lg text-center">
        Choose your role to continue
      </p>
      <div className="flex gap-6">
        <Link
          to="/login"
          className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg shadow-lg transition"
        >
          Student Login
        </Link>
        <Link
          to="/admin-dashboard"
          className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg shadow-lg transition"
        >
          Admin Dashboard
        </Link>
      </div>
    </div>
  );
}
