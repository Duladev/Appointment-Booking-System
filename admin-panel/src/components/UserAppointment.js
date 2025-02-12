import React, { useState, useEffect } from "react";

const UserAppointment = () => {
    const [appointment, setAppointment] = useState({
        date: "",
        time: "",
        reason: "",
    });
    const [slots, setSlots] = useState([]); // To hold the fetched slots
    const [loading, setLoading] = useState(true); // Loading state for fetching slots
    const [error, setError] = useState(null); // Error state for fetching slots

    // Fetch available slots when the component is mounted
    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:5005/api/slots")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Fetched slots:", data); // Log the fetched slots for debugging
                setSlots(data); // Set the fetched slots in state
                setLoading(false);
            })
            .catch((error) => {
                setError("Error fetching available time slots.");
                setLoading(false);
                console.error("Error fetching slots:", error); // Improved error logging
            });
    }, []);

    const handleChange = (e) => {
        setAppointment({ ...appointment, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem("userId"); // Get user ID from local storage

        const response = await fetch("http://localhost:5005/api/appointments", {
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

            {/* Display loading message */}
            {loading && <div>Loading available slots...</div>}

            {/* Display error message if any */}
            {error && <div className="text-red-500">{error}</div>}

            <form onSubmit={handleSubmit}>
                <label>Date:</label>
                <input
                    type="date"
                    name="date"
                    value={appointment.date}
                    onChange={handleChange}
                    required
                />

                <label>Time:</label>
                {slots.length > 0 ? (
                    <select
                        name="time"
                        value={appointment.time}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a time</option>
                        {slots.map((slot, index) => (
                            <option key={index} value={slot.time}>
                                {slot.time}
                            </option>
                        ))}
                    </select>
                ) : (
                    <div>No available slots at the moment.</div> // Display message if no slots are available
                )}

                <label>Reason:</label>
                <textarea
                    name="reason"
                    value={appointment.reason}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Book Appointment</button>
            </form>
        </div>
    );
};

export default UserAppointment;
