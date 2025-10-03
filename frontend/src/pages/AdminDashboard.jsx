import { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminDashboard() {
  const [electives, setElectives] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [newElective, setNewElective] = useState({
    name: "", code: "", description: "", semester: "", oddEven: "odd"
  });

  const fetchElectives = async () => {
    const res = await API.get("/electives");
    setElectives(res.data);
  };

  const fetchRegistrations = async () => {
    const res = await API.get("/registrations");
    setRegistrations(res.data);
  };

  useEffect(() => {
    fetchElectives();
    fetchRegistrations();
  }, []);

  const handleAddElective = async (e) => {
    e.preventDefault();
    await API.post("/electives", newElective);
    setNewElective({ name: "", code: "", description: "", semester: "", oddEven: "odd" });
    fetchElectives();
  };

  const handleDeleteElective = async (id) => {
    await API.delete(`/electives/${id}`);
    fetchElectives();
  };

  const handleDownload = async (type) => {
    const res = await API.get(`/reports/${type}`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${type}.xlsx`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Elective Management */}
      <div className="mb-8">
        <h2 className="text-xl mb-3">Manage Electives</h2>
        <form onSubmit={handleAddElective} className="flex gap-2 mb-4 flex-wrap">
          <input type="text" placeholder="Name" className="p-2 rounded bg-gray-700"
            value={newElective.name} onChange={(e) => setNewElective({...newElective, name: e.target.value})} />
          <input type="text" placeholder="Code" className="p-2 rounded bg-gray-700"
            value={newElective.code} onChange={(e) => setNewElective({...newElective, code: e.target.value})} />
          <input type="text" placeholder="Description" className="p-2 rounded bg-gray-700"
            value={newElective.description} onChange={(e) => setNewElective({...newElective, description: e.target.value})} />
          <input type="number" placeholder="Semester" className="p-2 rounded bg-gray-700"
            value={newElective.semester} onChange={(e) => setNewElective({...newElective, semester: e.target.value})} />
          <select className="p-2 rounded bg-gray-700"
            value={newElective.oddEven} onChange={(e) => setNewElective({...newElective, oddEven: e.target.value})}>
            <option value="odd">Odd</option>
            <option value="even">Even</option>
          </select>
          <button type="submit" className="bg-green-500 px-4 py-2 rounded">Add</button>
        </form>

        <ul>
          {electives.map(e => (
            <li key={e._id} className="flex justify-between bg-gray-800 p-3 my-2 rounded">
              <span>{e.name} ({e.code}) - Sem {e.semester} [{e.oddEven}]</span>
              <button onClick={() => handleDeleteElective(e._id)}
                className="bg-red-500 px-3 py-1 rounded">Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Registrations */}
      <div className="mb-8">
        <h2 className="text-xl mb-3">Student Registrations</h2>
        {registrations.length === 0 ? <p>No registrations yet</p> : (
          <table className="w-full text-left border border-gray-700">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-2">Roll No</th>
                <th className="p-2">Name</th>
                <th className="p-2">Semester</th>
                <th className="p-2">Elective</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map(r => (
                <tr key={r._id} className="border-b border-gray-700">
                  <td className="p-2">{r.student.rollNo}</td>
                  <td className="p-2">{r.student.name}</td>
                  <td className="p-2">{r.student.semester}</td>
                  <td className="p-2">{r.elective.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Reports */}
      <div>
        <h2 className="text-xl mb-3">Download Reports</h2>
        <button onClick={() => handleDownload("per-elective")}
          className="bg-blue-500 px-4 py-2 mr-3 rounded">Per Elective</button>
        <button onClick={() => handleDownload("multi-sheet")}
          className="bg-purple-500 px-4 py-2 rounded">Multi-Sheet</button>
      </div>
    </div>
  );
}
