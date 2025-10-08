import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function AdminDashboard() {
  const [electives, setElectives] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("electives");
  const [newElective, setNewElective] = useState({
    name: "", code: "", description: "", semester: "", oddEven: "odd"
  });
  const [editingElective, setEditingElective] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "", code: "", description: "", semester: "", oddEven: "odd"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const user = JSON.parse(localStorage.getItem("userInfo") || "{}");

    if (!token || role !== "admin") {
      navigate("/admin-login");
      return;
    }

    setUserInfo(user);
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchElectives(), fetchRegistrations()]);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/admin-login");
      } else {
        setError("Failed to load data");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchElectives = async () => {
    const res = await API.get("/electives");
    setElectives(res.data);
  };

  const fetchRegistrations = async () => {
    const res = await API.get("/registrations");
    setRegistrations(res.data);
  };

  const handleAddElective = async (e) => {
    e.preventDefault();
    try {
      await API.post("/electives", newElective);
      setNewElective({ name: "", code: "", description: "", semester: "", oddEven: "odd" });
      setSuccess("Elective added successfully!");
      setTimeout(() => setSuccess(""), 3000);
      fetchElectives();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to add elective");
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleEditElective = (elective) => {
    setEditingElective(elective._id);
    setEditForm({
      name: elective.name,
      code: elective.code,
      description: elective.description || "",
      semester: elective.semester.toString(),
      oddEven: elective.oddEven
    });
  };

  const handleUpdateElective = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/electives/${editingElective}`, editForm);
      setSuccess("Elective updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
      setEditingElective(null);
      fetchElectives();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to update elective");
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleCancelEdit = () => {
    setEditingElective(null);
    setEditForm({ name: "", code: "", description: "", semester: "", oddEven: "odd" });
  };

  const handleDeleteElective = async (id) => {
    if (window.confirm("Are you sure you want to delete this elective?")) {
      try {
        await API.delete(`/electives/${id}`);
        setSuccess("Elective deleted successfully!");
        setTimeout(() => setSuccess(""), 3000);
        fetchElectives();
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to delete elective");
        setTimeout(() => setError(""), 5000);
      }
    }
  };

  const handleDownload = async (type) => {
    try {
      const res = await API.get(`/reports/${type}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type === 'multi-sheet' ? 'all_electives_report' : 'elective_report'}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download report");
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleDownloadPerElective = async (electiveId, electiveCode) => {
    try {
      const res = await API.get(`/reports/per-elective?electiveId=${electiveId}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${electiveCode}_enrollments.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download report");
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 text-white">
      {/* Header */}
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            {userInfo && (
              <p className="text-green-200">
                Welcome, {userInfo.name}
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition"
            >
              Home
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Alert Messages */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-200">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6">
            <p className="text-green-200">{success}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1 mb-8">
          <button
            onClick={() => setActiveTab("electives")}
            className={`px-6 py-3 rounded-lg transition ${activeTab === "electives" ? "bg-white/20" : "hover:bg-white/10"
              }`}
          >
            Manage Electives
          </button>
          <button
            onClick={() => setActiveTab("registrations")}
            className={`px-6 py-3 rounded-lg transition ${activeTab === "registrations" ? "bg-white/20" : "hover:bg-white/10"
              }`}
          >
            View Registrations
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-6 py-3 rounded-lg transition ${activeTab === "reports" ? "bg-white/20" : "hover:bg-white/10"
              }`}
          >
            Download Reports
          </button>
        </div>

        {/* Elective Management Tab */}
        {activeTab === "electives" && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold mb-6">Manage Electives</h2>

            {/* Add New Elective Form */}
            <div className="bg-white/5 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Add New Elective</h3>
              <form onSubmit={handleAddElective} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <input
                  type="text"
                  placeholder="Elective Name"
                  value={newElective.name}
                  onChange={(e) => setNewElective({ ...newElective, name: e.target.value })}
                  className="p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Code (e.g., CS501)"
                  value={newElective.code}
                  onChange={(e) => setNewElective({ ...newElective, code: e.target.value })}
                  className="p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newElective.description}
                  onChange={(e) => setNewElective({ ...newElective, description: e.target.value })}
                  className="p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <select
                  value={newElective.semester}
                  onChange={(e) => setNewElective({ ...newElective, semester: e.target.value })}
                  className="p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select Semester</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                  <option value="5">Semester 5</option>
                  <option value="6">Semester 6</option>
                  <option value="7">Semester 7</option>
                  <option value="8">Semester 8</option>
                </select>
                <select
                  value={newElective.oddEven}
                  onChange={(e) => setNewElective({ ...newElective, oddEven: e.target.value })}
                  className="p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="odd">Odd Semester</option>
                  <option value="even">Even Semester</option>
                </select>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition col-span-full md:col-span-1"
                >
                  Add Elective
                </button>
              </form>
            </div>

            {/* Electives List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Current Electives</h3>
              {electives.length === 0 ? (
                <p className="text-gray-300 text-center py-8">No electives added yet</p>
              ) : (
                electives.map(elective => (
                  <div key={elective._id} className="bg-white/5 rounded-lg p-4">
                    {editingElective === elective._id ? (
                      // Edit Form
                      <form onSubmit={handleUpdateElective} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                          <input
                            type="text"
                            placeholder="Elective Name"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Code (e.g., CS501)"
                            value={editForm.code}
                            onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                            className="p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Description"
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          <select
                            value={editForm.semester}
                            onChange={(e) => setEditForm({ ...editForm, semester: e.target.value })}
                            className="p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          >
                            <option value="">Select Semester</option>
                            <option value="2">Semester 2</option>
                            <option value="3">Semester 3</option>
                            <option value="4">Semester 4</option>
                            <option value="5">Semester 5</option>
                            <option value="6">Semester 6</option>
                            <option value="7">Semester 7</option>
                            <option value="8">Semester 8</option>
                          </select>
                          <select
                            value={editForm.oddEven}
                            onChange={(e) => setEditForm({ ...editForm, oddEven: e.target.value })}
                            className="p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <option value="odd">Odd Semester</option>
                            <option value="even">Even Semester</option>
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition"
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      // Display Mode
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-lg font-semibold">{elective.name}</h4>
                          <p className="text-green-200">Code: {elective.code}</p>
                          <p className="text-gray-300">Semester {elective.semester} • {elective.oddEven}</p>
                          {elective.description && (
                            <p className="text-gray-400 text-sm">{elective.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditElective(elective)}
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteElective(elective._id)}
                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Registrations Tab */}
        {activeTab === "registrations" && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold mb-6">Student Registrations</h2>
            {registrations.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-gray-300">No registrations yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="pb-4 font-semibold">Roll Number</th>
                      <th className="pb-4 font-semibold">Student Name</th>
                      <th className="pb-4 font-semibold">Semester</th>
                      <th className="pb-4 font-semibold">Type</th>
                      <th className="pb-4 font-semibold">Elective</th>
                      <th className="pb-4 font-semibold">Elective Code</th>
                      <th className="pb-4 font-semibold">Registered Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map(reg => (
                      <tr key={reg._id} className="border-b border-white/10">
                        <td className="py-4">{reg.student.rollNo}</td>
                        <td className="py-4">{reg.student.name}</td>
                        <td className="py-4">{reg.student.semester}</td>
                        <td className="py-4">{reg.student.oddEven}</td>
                        <td className="py-4">{reg.elective.name}</td>
                        <td className="py-4">{reg.elective.code}</td>
                        <td className="py-4">{new Date(reg.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold mb-6">Download Reports</h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Multi-Sheet Report */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">📊 Comprehensive Report</h3>
                <p className="text-gray-300 mb-4">
                  Download a single Excel file with multiple sheets - one sheet per elective plus a summary.
                </p>
                <button
                  onClick={() => handleDownload("multi-sheet")}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition w-full"
                >
                  Download Multi-Sheet Report
                </button>
              </div>

              {/* Per-Elective Reports */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">📋 Individual Elective Reports</h3>
                <p className="text-gray-300 mb-4">
                  Download individual Excel files for each elective with enrolled students.
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {electives.map(elective => {
                    const electiveRegistrations = registrations.filter(reg => reg.elective._id === elective._id);
                    return (
                      <div key={elective._id} className="flex justify-between items-center bg-white/5 rounded p-2">
                        <span className="text-sm">
                          {elective.name} ({electiveRegistrations.length} students)
                        </span>
                        <button
                          onClick={() => handleDownloadPerElective(elective._id, elective.code)}
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition"
                          disabled={electiveRegistrations.length === 0}
                        >
                          Download
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
