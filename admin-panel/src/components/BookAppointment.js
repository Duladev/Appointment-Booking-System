import React, { useState, useEffect } from "react";
import axios from "axios";

const BookAppointment = () => {
    const [name, setName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [availableSlots, setAvailableSlots] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch available and booked time slots when date changes
    useEffect(() => {
        if (date) {
            setLoading(true);
            setError(""); // Reset error message before making the API call
            axios.get(`http://localhost:5004/available-time-slots?date=${date}`)
                .then(response => {
                    setAvailableSlots(response.data.availableSlots);
                    setBookedSlots(response.data.bookedSlots);
                    setLoading(false);
                })
                .catch(error => {
                    setError("Error fetching time slots. Please try again later.");
                    setLoading(false);
                });
        } else {
            setAvailableSlots([]);
            setBookedSlots([]);
        }
    }, [date]);

    // Filter out booked time slots
    const availableTimeSlots = availableSlots.filter(slot => !bookedSlots.includes(slot));

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !mobileNumber || !description || !selectedTimeSlot || !date) {
            setError("Please fill in all fields.");
            return;
        }

        axios.post("http://localhost:5004/appointments", {
            name,
            mobileNumber,
            description,
            timeSlot: selectedTimeSlot,
            date
        })
            .then(() => {
                alert("Appointment booked successfully!");
                setName("");
                setMobileNumber("");
                setDescription("");
                setDate("");
                setSelectedTimeSlot("");
            })
            .catch(() => alert("Error booking appointment"));
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Book an Appointment</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" value={name}
                    onChange={(e) => setName(e.target.value)} className="block w-full p-2 mb-2 border" />
                <input type="text" placeholder="Mobile Number" value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)} className="block w-full p-2 mb-2 border" />
                <textarea placeholder="Description" value={description}
                    onChange={(e) => setDescription(e.target.value)} className="block w-full p-2 mb-2 border"></textarea>
                <input type="date" value={date}
                    onChange={(e) => setDate(e.target.value)} className="block w-full p-2 mb-2 border" />

                {/* Loading State or Time Slot Selection */}
                {loading ? (
                    <p>Loading time slots...</p>
                ) : (
                    <select value={selectedTimeSlot} onChange={(e) => setSelectedTimeSlot(e.target.value)} className="block w-full p-2 mb-2 border">
                        <option value="">Select a Time Slot</option>
                        {availableTimeSlots.length > 0 ? (
                            availableTimeSlots.map((slot, index) => (
                                <option key={index} value={slot}>{slot}</option>
                            ))
                        ) : (
                            <option value="">No available time slots</option>
                        )}
                    </select>
                )}

                {/* Display Error */}
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Book Now</button>
            </form>
        </div>
    );
};

export default BookAppointment;
