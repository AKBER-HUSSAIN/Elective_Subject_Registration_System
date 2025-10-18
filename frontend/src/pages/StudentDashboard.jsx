import { useEffect, useState } from "react";
import { electiveAPI, registrationAPI } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function StudentDashboard() {
  const [electives, setElectives] = useState([]);
  const [myElective, setMyElective] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const user = JSON.parse(localStorage.getItem("userInfo") || "{}");

    if (!token || role !== "student") {
      navigate("/login");
      return;
    }

    setUserInfo(user);
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Check if student already registered
      const myReg = await registrationAPI.getMy();
      if (myReg.data.elective) {
        setMyElective(myReg.data.elective);
      } else {
        // Get electives filtered for this student
        const res = await electiveAPI.getMy();
        setElectives(res.data);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        setError("Failed to load electives");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (id) => {
    try {
      await registrationAPI.register({ electiveId: id });
      alert("Elective registered successfully!");
      window.location.reload(); // reload to show registered elective
    } catch (err) {
      setError(err.response?.data?.msg || "Error registering elective");
    }
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
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
            {userInfo && (
              <p className="text-gray-600">
                Welcome, {userInfo.name} (Semester {userInfo.semester}, {userInfo.branch} - {userInfo.section})
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

      <div className="max-w-4xl mx-auto p-6">
        {error && (
          <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {myElective ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Elective Registered!</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">{myElective.name}</h3>
                <p className="text-blue-600 text-lg mb-2">Code: {myElective.code}</p>
                <p className="text-gray-600 mb-4">Semester {myElective.semester} ({myElective.semester % 2 === 1 ? 'Odd' : 'Even'})</p>
                {myElective.description && (
                  <p className="text-gray-500">{myElective.description}</p>
                )}
              </div>
              <p className="text-green-600 mt-4">
                Your elective selection has been successfully registered.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Available Electives</h2>
              <p className="text-gray-600 text-lg">
                Choose from electives available for your semester and branch.
              </p>
            </div>

            {electives.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">No Electives Available</h3>
                <p className="text-gray-600">
                  There are currently no electives available for your semester and branch.
                  Please contact your administrator for more information.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {electives.map((elective) => (
                  <div key={elective._id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2 text-gray-800">{elective.name}</h3>
                        <p className="text-blue-600 text-lg mb-2">Code: {elective.code}</p>
                        <p className="text-gray-600 mb-3">
                          Semester {elective.semester} • {elective.semester % 2 === 1 ? 'Odd' : 'Even'} Semester
                        </p>
                        {elective.description && (
                          <p className="text-gray-500 mb-4">{elective.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleSelect(elective._id)}
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition text-white"
                      >
                        Select This Elective
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
