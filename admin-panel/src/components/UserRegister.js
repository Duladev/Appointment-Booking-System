import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserRegister = () => {
    const [user, setUser] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        // Dummy user registration logic (Replace with backend API call)
        if (user.name && user.email && user.password) {
            alert("Registration Successful! Please log in.");
            navigate("/user/login"); // Redirect to login page after registration
        } else {
            alert("Please fill all fields.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 via-green-500 to-purple-600">
            <div className="w-full max-w-md p-8 bg-white bg-opacity-80 rounded-xl shadow-xl">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">User Registration</h2>
                <form onSubmit={handleRegister} className="space-y-6">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserRegister;
