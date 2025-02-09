import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Welcome to the Appointment Booking System</h1>
            <p>Select your login type:</p>
            <button
                onClick={() => navigate("/user/login")}
                style={{ marginRight: "10px", padding: "10px 20px" }}
            >
                User Login
            </button>
            <button
                onClick={() => navigate("/admin/login")}
                style={{ padding: "10px 20px" }}
            >
                Admin Login
            </button>
        </div>
    );
};

export default Home;
