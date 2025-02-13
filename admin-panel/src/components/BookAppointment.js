import React, { useState, useEffect } from "react";
import axios from "axios";

const BookAppointment = () => {
    const [name, setName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
    const [error, setError] = useState("");

    // Fetch available time slots on component mount
    useEffect(() => {
        axios.get('http://localhost:5005/api/slots')
            .then((response) => setAvailableSlots(response.data))
            .catch((error) => {
                setError('Error fetching slots. Please try again.');
                console.error('Error fetching slots:', error);
            });
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !mobileNumber || !description || !selectedTimeSlot || !date) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            await axios.post("http://localhost:5005/api/book-appointments", {
                name,
                mobileNumber,
                description,
                slotId: selectedTimeSlot,
                date,
            });

            alert("Appointment booked successfully!");
            setName("");
            setMobileNumber("");
            setDescription("");
            setDate("");
            setSelectedTimeSlot("");
        } catch (err) {
            setError("Error booking appointment. Please try again.");
            console.error('Error booking appointment:', err);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Book an Appointment</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="block w-full p-2 mb-2 border" />
                <input type="text" placeholder="Mobile Number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="block w-full p-2 mb-2 border" />
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="block w-full p-2 mb-2 border"></textarea>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="block w-full p-2 mb-2 border" />
                <select value={selectedTimeSlot} onChange={(e) => setSelectedTimeSlot(e.target.value)} className="block w-full p-2 mb-2 border">
                    <option value="">Select a Time Slot</option>
                    {availableSlots.length > 0 ? (
                        availableSlots.map((slot, index) => (
                            <option key={index} value={slot.id}>{slot.time}</option>
                        ))
                    ) : (
                        <option value="">No available time slots</option>
                    )}
                </select>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Book Now</button>
            </form>
        </div>
    );
};

export default BookAppointment;
