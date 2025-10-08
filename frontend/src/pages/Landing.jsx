import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <div className="text-2xl font-bold">Elective System</div>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-6 py-20">
        <h1 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Elective Subject Registration System
        </h1>
        <p className="text-xl text-gray-300 mb-12 text-center max-w-2xl">
          Streamline your academic journey with our comprehensive elective subject management platform.
          Students can easily register for courses, while administrators maintain full control.
        </p>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Student Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition">
            <div className="text-4xl mb-4">🎓</div>
            <h2 className="text-2xl font-bold mb-4">For Students</h2>
            <p className="text-gray-300 mb-6">
              Register for elective subjects based on your semester and academic requirements.
              View available courses and manage your academic choices easily.
            </p>
            <div className="space-y-3">
              <Link
                to="/register"
                className="block w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-center transition"
              >
                Register as Student
              </Link>
              <Link
                to="/login"
                className="block w-full border border-white/30 hover:bg-white/10 px-6 py-3 rounded-lg text-center transition"
              >
                Student Login
              </Link>
            </div>
          </div>

          {/* Admin Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition">
            <div className="text-4xl mb-4">⚙️</div>
            <h2 className="text-2xl font-bold mb-4">For Administrators</h2>
            <p className="text-gray-300 mb-6">
              Manage elective subjects, view student registrations, and generate comprehensive reports.
              Full administrative control over the system.
            </p>
            <div className="space-y-3">
              <Link
                to="/admin-login"
                className="block w-full bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-center transition"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold mb-8">Key Features</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl">
            <div className="bg-white/5 rounded-lg p-6">
              <div className="text-3xl mb-3">📚</div>
              <h4 className="text-xl font-semibold mb-2">Semester-based Filtering</h4>
              <p className="text-gray-300">Students see only relevant electives for their semester and academic type.</p>
            </div>
            <div className="bg-white/5 rounded-lg p-6">
              <div className="text-3xl mb-3">📊</div>
              <h4 className="text-xl font-semibold mb-2">Excel Reports</h4>
              <p className="text-gray-300">Generate comprehensive reports with student enrollment data.</p>
            </div>
            <div className="bg-white/5 rounded-lg p-6">
              <div className="text-3xl mb-3">🔐</div>
              <h4 className="text-xl font-semibold mb-2">Secure Access</h4>
              <p className="text-gray-300">Role-based authentication ensures proper access control.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
