import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function AdminLogin() {
    const [rollNo, setRollNo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await API.post("/auth/login", { rollNo, password });

            // Check if user is admin
            if (res.data.role !== "admin") {
                setError("Access denied. Admin credentials required.");
                return;
            }

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("userInfo", JSON.stringify({
                name: res.data.name,
                rollNo: rollNo,
                branch: res.data.branch
            }));

            navigate("/admin-dashboard");
        } catch (err) {
            setError(err.response?.data?.msg || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Login</h2>
                    <p className="text-gray-600">Access the administrative dashboard</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-6">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Admin Roll Number
                        </label>
                        <input
                            type="text"
                            placeholder="Enter admin roll number"
                            value={rollNo}
                            onChange={(e) => setRollNo(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>


                <div className="mt-6 text-center">
                    <Link
                        to="/"
                        className="text-blue-600 hover:text-blue-500 text-sm transition"
                    >
                        ← Back to Student Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
