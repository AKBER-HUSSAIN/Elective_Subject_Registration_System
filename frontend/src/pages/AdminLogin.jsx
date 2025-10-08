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
                rollNo: rollNo
            }));

            navigate("/admin-dashboard");
        } catch (err) {
            setError(err.response?.data?.msg || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
                <div className="text-center mb-8">
                    <div className="text-4xl mb-4">⚙️</div>
                    <h2 className="text-3xl font-bold text-white mb-2">Admin Login</h2>
                    <p className="text-gray-300">Access the administrative dashboard</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-6">
                        <p className="text-red-200 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            Admin Roll Number
                        </label>
                        <input
                            type="text"
                            placeholder="Enter admin roll number"
                            value={rollNo}
                            onChange={(e) => setRollNo(e.target.value)}
                            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="text-blue-400 hover:text-blue-300 text-sm transition"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
