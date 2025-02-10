import React, { useState } from "react";

const UserAppointment = () => {
    const [appointment, setAppointment] = useState({
        date: "",
        time: "",
        reason: ""
    });

    const handleChange = (e) => {
        setAppointment({ ...appointment, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem("userId"); // Get user ID from local storage

        const response = await fetch("http://localhost:5000/api/appointments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, ...appointment }),
        });

        const data = await response.json();
        alert(data.message);
    };

    return (
        <div>
            <h2>Book an Appointment</h2>
            <form onSubmit={handleSubmit}>
                <label>Date:</label>
                <input type="date" name="date" value={appointment.date} onChange={handleChange} required />

                <label>Time:</label>
                <input type="time" name="time" value={appointment.time} onChange={handleChange} required />

                <label>Reason:</label>
                <textarea name="reason" value={appointment.reason} onChange={handleChange} required />

                <button type="submit">Book Appointment</button>
            </form>
        </div>
    );
};

export default UserAppointment;
