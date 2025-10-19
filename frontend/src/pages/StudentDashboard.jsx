import { useEffect, useState } from "react";
import { electiveAPI, registrationAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import { showToast } from "../components/Toast";
import CollegeHeader from "../components/CollegeHeader";

export default function StudentDashboard() {
  const [electives, setElectives] = useState([]);
  const [myElective, setMyElective] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
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
        showToast.error("Failed to load electives");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (id) => {
    try {
      await registrationAPI.register({ electiveId: id });
      showToast.success("Elective registered successfully!");
      fetchData(); // Refresh data instead of full page reload
    } catch (err) {
      showToast.error(err.response?.data?.msg || "Error registering elective");
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
    <div className="min-h-screen bg-background font-classic">
      {/* Header */}
      <nav className="bg-card shadow-classic border-b border-primary/10 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <CollegeHeader type="logo" size="small" />
            <div>
              <h1 className="text-2xl font-bold text-primary tracking-tight">
                Student Dashboard
              </h1>
              {userInfo && (
                <>
                  <p className="text-primary-light">Welcome, {userInfo.name}</p>
                  <p className="text-accent">
                    (Semester {userInfo.semester}, {userInfo.branch} -{" "}
                    {userInfo.section})
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-error hover:bg-error/80 transition text-white rounded-xl shadow-classic hover:shadow-hover font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        {myElective ? (
          <div className="bg-card rounded-2xl shadow-classic p-8 border border-primary/10">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                Elective Registered!
              </h2>
              <div className="bg-background rounded-xl p-6 border border-primary/10">
                <h3 className="text-2xl font-semibold mb-2 text-primary">
                  {myElective.name}
                </h3>
                <p className="text-accent text-lg mb-2">
                  Code: {myElective.code}
                </p>
                <p className="text-primary-light mb-4">
                  Semester {myElective.semester}
                </p>
                {myElective.description && (
                  <p className="text-primary-light">{myElective.description}</p>
                )}
              </div>
              <p className="text-success mt-4">
                Your elective selection has been successfully registered.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                Available Electives
              </h2>
              <p className="text-gray-600 text-lg">
                Choose from electives available for your semester and branch.
              </p>
            </div>

            {electives.length === 0 ? (
              <div className="bg-card rounded-2xl shadow-classic p-8 text-center border border-primary/10">
                <h3 className="text-2xl font-bold mb-4 text-primary">
                  No Electives Available
                </h3>
                <p className="text-primary-light">
                  There are currently no electives available for your semester
                  and branch. Please contact your administrator for more
                  information.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {electives.map((elective) => (
                  <div
                    key={elective._id}
                    className="bg-card rounded-2xl shadow-classic p-6 hover:shadow-hover transition border border-primary/10"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2 text-primary">
                          {elective.name}
                        </h3>
                        <p className="text-accent text-lg mb-2">
                          Code: {elective.code}
                        </p>
                        <p className="text-primary-light mb-3">
                          Semester {elective.semester}{" "}
                        </p>
                        {elective.description && (
                          <p className="text-primary-light mb-4">
                            {elective.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleSelect(elective._id)}
                        className="bg-accent hover:bg-accent-dark px-6 py-3 rounded-xl font-semibold transition-shadow shadow-classic hover:shadow-hover text-white"
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
