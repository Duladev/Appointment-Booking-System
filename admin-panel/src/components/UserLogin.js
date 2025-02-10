import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Dummy validation (Replace with backend authentication)
        if (credentials.email && credentials.password) {
            navigate("/user/dashboard"); // Redirect to user dashboard
        } else {
            alert("Invalid user credentials!");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
            <div className="w-full max-w-md p-8 bg-white bg-opacity-80 rounded-xl shadow-xl">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">User Login</h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <input
                        type="email"
                        placeholder="Email"
                        value={credentials.email}
                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex justify-between items-center">
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/user/register")}
                            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserLogin;
