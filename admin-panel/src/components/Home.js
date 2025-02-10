import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
            <div className="text-center p-8 bg-white bg-opacity-60 rounded-lg shadow-lg">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Welcome to the Appointment Booking System</h1>
                <p className="text-xl text-gray-700 mb-6">Please select your login type:</p>
                <div className="flex space-x-6">
                    <div> <button
                        onClick={() => navigate("/user/login")}
                        className="px-8 py-4 bg-blue-600 text-white rounded-full shadow-lg transform hover:scale-105 hover:bg-blue-700 transition-all duration-300"
                    >
                        User Login
                    </button></div>
                    <button
                        onClick={() => navigate("/admin/login")}
                        className="px-8 py-4 bg-green-600 text-white rounded-full shadow-lg transform hover:scale-105 hover:bg-green-700 transition-all duration-300"
                    >
                        Admin Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
