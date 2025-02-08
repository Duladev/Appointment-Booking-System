import React, { useState, useEffect } from 'react';

const Slots = () => {
    const [slots, setSlots] = useState([]);  // State to hold slots data

    // Fetch slots when the component loads
    useEffect(() => {
        fetch("http://localhost:5003/slots")
            .then((response) => response.json())
            .then((data) => setSlots(data))  // Store slots data
            .catch((error) => console.error("Error fetching slots:", error));
    }, []);

    // Function to book a slot
    const bookSlot = (id) => {
        fetch(`http://localhost:5003/book-slot/${id}`, { method: 'PUT' })
            .then(response => response.json())
            .then(data => {
                alert(data.message);  // Show success message
                // Update the UI (mark slot as booked)
                setSlots(slots.map(slot => slot.id === id ? { ...slot, is_booked: 1 } : slot));
            })
            .catch(error => console.error("Error booking slot:", error));
    };

    return (
        <div>
            <h1>Available Appointment Slots</h1>
            <ul>
                {slots.map(slot => (
                    <li key={slot.id}>
                        <p>{slot.time} - {slot.is_booked ? 'Booked' : 'Available'}</p>
                        {!slot.is_booked && (
                            <button onClick={() => bookSlot(slot.id)}>Book Slot</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Slots;
