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
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>User Registration</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
                <br />
                <input
                    type="email"
                    placeholder="Email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
                <br />
                <input
                    type="password"
                    placeholder="Password"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                />
                <br />
                <button type="submit" style={{ padding: "10px 20px", backgroundColor: "blue", color: "white" }}>
                    Register
                </button>
            </form>
        </div>
    );
};

export default UserRegister;
