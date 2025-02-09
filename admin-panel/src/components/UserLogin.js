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
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>User Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                />
                <br />
                <input
                    type="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
                <br />
                <button type="submit" style={{ marginRight: "10px", padding: "10px 20px" }}>Login</button>
                <button
                    type="button"
                    onClick={() => navigate("/user/register")}
                    style={{ padding: "10px 20px", backgroundColor: "green", color: "white" }}
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default UserLogin;
