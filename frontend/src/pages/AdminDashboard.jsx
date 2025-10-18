import { useEffect, useState } from "react";
import { electiveAPI, registrationAPI, adminAPI } from "../services/api";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function AdminDashboard() {
  const [electives, setElectives] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("electives");
  const [newElective, setNewElective] = useState({
    name: "", code: "", description: "", semester: ""
  });
  const [editingElective, setEditingElective] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "", code: "", description: "", semester: ""
  });
  const [excelFile, setExcelFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Filtering state
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedElective, setSelectedElective] = useState("");
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);

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
      await Promise.all([fetchElectives(), fetchRegistrations(), fetchSemesters()]);
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
    const res = await electiveAPI.getAll();
    setElectives(res.data);
  };

  const fetchRegistrations = async () => {
    const res = await registrationAPI.getAll();
    setRegistrations(res.data);
  };

  const fetchSemesters = async () => {
    const res = await adminAPI.getSemesters();
    setSemesters(res.data);
  };

  const fetchElectivesBySemester = async (semester) => {
    if (!semester) return;
    const res = await adminAPI.getElectivesBySemester(semester);
    setElectives(res.data);
  };

  const fetchSectionsBySemester = async (semester) => {
    if (!semester) return;
    const res = await adminAPI.getSectionsBySemester(semester);
    setSections(res.data);
  };

  const fetchFilteredRegistrations = async () => {
    const params = {};
    if (selectedSemester) params.semester = selectedSemester;
    if (selectedElective) params.electiveId = selectedElective;
    if (selectedSection) params.section = selectedSection;

    const res = await adminAPI.getFilteredRegistrations(params);
    setFilteredRegistrations(res.data);
  };

  const handleAddElective = async (e) => {
    e.preventDefault();
    try {
      await electiveAPI.create(newElective);
      setNewElective({ name: "", code: "", description: "", semester: "" });
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
      semester: elective.semester.toString()
    });
  };

  const handleUpdateElective = async (e) => {
    e.preventDefault();
    try {
      await electiveAPI.update(editingElective, editForm);
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
    setEditForm({ name: "", code: "", description: "", semester: "" });
  };

  const handleDeleteElective = async (id) => {
    if (window.confirm("Are you sure you want to delete this elective?")) {
      try {
        await electiveAPI.delete(id);
        setSuccess("Elective deleted successfully!");
        setTimeout(() => setSuccess(""), 3000);
        fetchElectives();
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to delete elective");
        setTimeout(() => setError(""), 5000);
      }
    }
  };


  const handleDownloadPerElective = async (electiveId, electiveCode) => {
    try {
      console.log("Downloading report for elective:", electiveId, electiveCode);
      const res = await API.get(`/reports/per-elective?electiveId=${electiveId}`, { responseType: "blob" });
      console.log("Download response received:", res.status);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${electiveCode}_enrollments.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      console.error("Error response:", err.response?.data);
      setError("Failed to download report: " + (err.response?.data?.msg || err.message));
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleDownloadPerElectiveSection = async (electiveId, electiveCode, section) => {
    try {
      console.log("Downloading section report for elective:", electiveId, electiveCode, "section:", section);
      const res = await API.get(`/reports/per-elective-section?electiveId=${electiveId}&section=${section}`, { responseType: "blob" });
      console.log("Download response received:", res.status);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${electiveCode}_Section${section}_enrollments.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      console.error("Error response:", err.response?.data);
      setError("Failed to download section report: " + (err.response?.data?.msg || err.message));
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleExcelUpload = async (e) => {
    e.preventDefault();
    if (!excelFile) {
      setError("Please select an Excel file");
      return;
    }

    try {
      setUploadLoading(true);
      console.log("Uploading file:", excelFile.name, excelFile.type, excelFile.size);

      const formData = new FormData();
      formData.append('excelFile', excelFile);

      console.log("FormData created, sending request...");
      const res = await adminAPI.uploadStudents(formData);
      console.log("Upload response:", res.data);

      setSuccess(`Excel uploaded successfully! Created: ${res.data.results.created}, Updated: ${res.data.results.updated}`);
      setExcelFile(null);
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      console.error("Upload error:", err);
      console.error("Error response:", err.response?.data);
      setError(err.response?.data?.msg || "Failed to upload Excel file");
      setTimeout(() => setError(""), 5000);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  // Filtering handlers
  const handleSemesterChange = async (semester) => {
    setSelectedSemester(semester);
    setSelectedElective("");
    setSelectedSection("");
    setElectives([]);
    setSections([]);
    setFilteredRegistrations([]);

    if (semester) {
      await Promise.all([
        fetchElectivesBySemester(semester),
        fetchSectionsBySemester(semester)
      ]);
    }
  };

  const handleElectiveChange = (electiveId) => {
    setSelectedElective(electiveId);
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const handleApplyFilter = async () => {
    await fetchFilteredRegistrations();
  };

  const handleClearFilter = () => {
    setSelectedSemester("");
    setSelectedElective("");
    setSelectedSection("");
    setElectives([]);
    setSections([]);
    setFilteredRegistrations([]);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-800 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            {userInfo && (
              <p className="text-gray-600">
                Welcome, {userInfo.name} ({userInfo.branch} Branch)
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition text-gray-700"
            >
              Home
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Alert Messages */}
        {error && (
          <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-6">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white rounded-lg shadow-sm p-1 mb-8">
          <button
            onClick={() => setActiveTab("electives")}
            className={`px-6 py-3 rounded-lg transition ${activeTab === "electives" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-50 text-gray-700"
              }`}
          >
            Manage Electives
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`px-6 py-3 rounded-lg transition ${activeTab === "students" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-50 text-gray-700"
              }`}
          >
            Upload Students
          </button>
          <button
            onClick={() => setActiveTab("registrations")}
            className={`px-6 py-3 rounded-lg transition ${activeTab === "registrations" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-50 text-gray-700"
              }`}
          >
            View Registrations
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-6 py-3 rounded-lg transition ${activeTab === "reports" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-50 text-gray-700"
              }`}
          >
            Download Reports
          </button>
        </div>

        {/* Students Upload Tab */}
        {activeTab === "students" && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Upload Students</h2>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Excel Upload Instructions</h3>
              <div className="text-gray-600 space-y-2">
                <p>• Upload an Excel file (.xlsx) with the following columns:</p>
                <p>• <strong>Name:</strong> Student's full name</p>
                <p>• <strong>RollNo:</strong> Student's roll number</p>
                <p>• <strong>Section:</strong> Student's section</p>
                <p>• <strong>Password:</strong> Student's login password</p>
                <p>• <strong>Semester:</strong> Student's current semester (1-8)</p>
                <p className="text-sm text-gray-500 mt-4">
                  Note: Students will be automatically assigned to your branch ({userInfo?.branch})
                </p>
              </div>
            </div>

            <form onSubmit={handleExcelUpload} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Select Excel File
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={uploadLoading || !excelFile}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition"
                >
                  {uploadLoading ? "Uploading..." : "Upload Students"}
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    if (!excelFile) {
                      setError("Please select a file first");
                      return;
                    }
                    try {
                      const formData = new FormData();
                      formData.append('excelFile', excelFile);
                      const res = await adminAPI.testUpload(formData);
                      console.log("Test upload response:", res.data);
                      setSuccess(`Test successful: ${res.data.msg}`);
                    } catch (err) {
                      console.error("Test upload error:", err);
                      setError("Test upload failed: " + (err.response?.data?.msg || err.message));
                    }
                  }}
                  disabled={!excelFile}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition"
                >
                  Test Upload
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Elective Management Tab */}
        {activeTab === "electives" && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Manage Electives</h2>

            {/* Add New Elective Form */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Add New Elective</h3>
              <form onSubmit={handleAddElective} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Elective Name"
                  value={newElective.name}
                  onChange={(e) => setNewElective({ ...newElective, name: e.target.value })}
                  className="p-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Code (e.g., CS501)"
                  value={newElective.code}
                  onChange={(e) => setNewElective({ ...newElective, code: e.target.value })}
                  className="p-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newElective.description}
                  onChange={(e) => setNewElective({ ...newElective, description: e.target.value })}
                  className="p-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newElective.semester}
                  onChange={(e) => setNewElective({ ...newElective, semester: e.target.value })}
                  className="p-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition text-white col-span-full md:col-span-1"
                >
                  Add Elective
                </button>
              </form>
            </div>

            {/* Electives List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Current Electives</h3>
              {electives.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No electives added yet</p>
              ) : (
                electives.map(elective => (
                  <div key={elective._id} className="bg-gray-50 rounded-lg p-4">
                    {editingElective === elective._id ? (
                      // Edit Form
                      <form onSubmit={handleUpdateElective} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <input
                            type="text"
                            placeholder="Elective Name"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="p-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Code (e.g., CS501)"
                            value={editForm.code}
                            onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                            className="p-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Description"
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="p-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <select
                            value={editForm.semester}
                            onChange={(e) => setEditForm({ ...editForm, semester: e.target.value })}
                            className="p-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition text-white"
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      // Display Mode
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">{elective.name}</h4>
                          <p className="text-blue-600">Code: {elective.code}</p>
                          <p className="text-gray-600">Semester {elective.semester} • {elective.semester % 2 === 1 ? 'Odd' : 'Even'}</p>
                          {elective.description && (
                            <p className="text-gray-500 text-sm">{elective.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditElective(elective)}
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition text-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteElective(elective._id)}
                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition text-white"
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
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Student Registrations</h2>

            {/* Filter Controls */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Filter Registrations</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Semester Filter */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Select Semester
                  </label>
                  <select
                    value={selectedSemester}
                    onChange={(e) => handleSemesterChange(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose Semester</option>
                    {semesters.map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>

                {/* Elective Filter */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Select Elective
                  </label>
                  <select
                    value={selectedElective}
                    onChange={(e) => handleElectiveChange(e.target.value)}
                    disabled={!selectedSemester}
                    className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Choose Elective</option>
                    {electives.map(elective => (
                      <option key={elective._id} value={elective._id}>
                        {elective.name} ({elective.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Section Filter */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Select Section
                  </label>
                  <select
                    value={selectedSection}
                    onChange={(e) => handleSectionChange(e.target.value)}
                    disabled={!selectedSemester}
                    className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Choose Section</option>
                    {sections.map(section => (
                      <option key={section} value={section}>Section {section}</option>
                    ))}
                  </select>
                </div>

                {/* Filter Actions */}
                <div className="flex gap-2 items-end">
                  <button
                    onClick={handleApplyFilter}
                    disabled={!selectedSemester}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition"
                  >
                    Apply Filter
                  </button>
                  <button
                    onClick={handleClearFilter}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            {filteredRegistrations.length === 0 && !selectedSemester ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-gray-600">Select a semester to view registrations</p>
              </div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-600">No registrations found for the selected filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="mb-4">
                  <p className="text-gray-600">
                    Showing {filteredRegistrations.length} registration(s)
                  </p>
                </div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-4 font-semibold text-gray-800">Roll Number</th>
                      <th className="pb-4 font-semibold text-gray-800">Student Name</th>
                      <th className="pb-4 font-semibold text-gray-800">Semester</th>
                      <th className="pb-4 font-semibold text-gray-800">Section</th>
                      <th className="pb-4 font-semibold text-gray-800">Elective</th>
                      <th className="pb-4 font-semibold text-gray-800">Elective Code</th>
                      <th className="pb-4 font-semibold text-gray-800">Registered Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegistrations
                      .sort((a, b) => a.student.rollNo.localeCompare(b.student.rollNo))
                      .map(reg => (
                        <tr key={reg._id} className="border-b border-gray-100">
                          <td className="py-4 text-gray-700">{reg.student.rollNo}</td>
                          <td className="py-4 text-gray-700">{reg.student.name}</td>
                          <td className="py-4 text-gray-700">{reg.student.semester}</td>
                          <td className="py-4 text-gray-700">{reg.student.section}</td>
                          <td className="py-4 text-gray-700">{reg.elective.name}</td>
                          <td className="py-4 text-gray-700">{reg.elective.code}</td>
                          <td className="py-4 text-gray-700">{new Date(reg.createdAt).toLocaleDateString()}</td>
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
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Download Reports</h2>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">📋 Elective-wise Reports</h3>
              <p className="text-gray-600 mb-6">
                Select a semester to view and download reports for electives in that semester.
              </p>

              {/* Semester Filter for Reports */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Select Semester for Reports
                </label>
                <select
                  value={selectedSemester}
                  onChange={(e) => handleSemesterChange(e.target.value)}
                  className="w-full md:w-64 p-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose Semester</option>
                  {semesters.map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>

              {!selectedSemester ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-gray-600">Select a semester to view electives for reporting</p>
                </div>
              ) : electives.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-gray-600">No electives available for Semester {selectedSemester}</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {electives.map(elective => {
                    const electiveRegistrations = registrations.filter(reg => reg.elective._id === elective._id);
                    const sections = [...new Set(electiveRegistrations.map(reg => reg.student.section))].sort();

                    return (
                      <div key={elective._id} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">{elective.name}</h4>
                            <p className="text-blue-600 text-sm">Code: {elective.code}</p>
                            <p className="text-gray-600 text-sm">Semester {elective.semester} • {electiveRegistrations.length} students enrolled</p>
                          </div>
                          <button
                            onClick={() => handleDownloadPerElective(elective._id, elective.code)}
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition text-white"
                            disabled={electiveRegistrations.length === 0}
                          >
                            Download All
                          </button>
                        </div>

                        {sections.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600 mb-2">Download by Section:</p>
                            <div className="flex flex-wrap gap-2">
                              {sections.map(section => {
                                const sectionRegistrations = electiveRegistrations.filter(reg => reg.student.section === section);
                                return (
                                  <button
                                    key={section}
                                    onClick={() => handleDownloadPerElectiveSection(elective._id, elective.code, section)}
                                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs font-medium transition text-white"
                                    disabled={sectionRegistrations.length === 0}
                                  >
                                    Section {section} ({sectionRegistrations.length})
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
