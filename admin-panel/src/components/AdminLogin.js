import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    // Predefined Admin Credentials (Replace with backend validation)
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "admin123";

    const handleLogin = (e) => {
        e.preventDefault();

        if (credentials.username === ADMIN_USERNAME && credentials.password === ADMIN_PASSWORD) {
            navigate("/admin/dashboard"); // Redirect to Admin Dashboard
        } else {
            alert("Invalid admin credentials!");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                />
                <br />
                <input
                    type="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
                <br />
                <button type="submit" style={{ padding: "10px 20px", backgroundColor: "blue", color: "white" }}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;
