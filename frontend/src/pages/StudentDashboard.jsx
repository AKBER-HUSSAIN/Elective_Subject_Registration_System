import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const [electives, setElectives] = useState([]);
  const [myElective, setMyElective] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myReg = await API.get("/registrations/me");
        if (myReg.data.elective) {
          setMyElective(myReg.data.elective);
        } else {
          const res = await API.get("/electives"); // backend filters
          setElectives(res.data);
        }
      } catch (err) {
        setError("Failed to load electives");
      }
    };
    fetchData();
  }, []);

  const handleSelect = async (id) => {
    try {
      await API.post("/registrations", { electiveId: id });
      alert("Elective registered successfully!");
      navigate(0); // reload
    } catch (err) {
      setError(err.response?.data?.msg || "Error registering elective");
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      {error && <p className="text-red-400">{error}</p>}

      {myElective ? (
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl">Your Elective:</h2>
          <p>{myElective.name} ({myElective.code})</p>
        </div>
      ) : (
        <div>
          <h2 className="text-xl mb-2">Available Electives:</h2>
          {electives.length === 0 ? (
            <p>No electives available</p>
          ) : (
            electives.map((e) => (
              <div key={e._id} className="bg-gray-800 p-3 my-2 rounded flex justify-between">
                <span>{e.name} ({e.code})</span>
                <button
                  onClick={() => handleSelect(e._id)}
                  className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                >
                  Select
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
