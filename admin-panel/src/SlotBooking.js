import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SlotBooking = () => {
    const [slots, setSlots] = useState([]);

    // Fetch available slots from the backend
    useEffect(() => {
        axios.get("http://localhost:5001/slots")
            .then(response => {
                setSlots(response.data);
            })
            .catch(error => {
                console.error("Error fetching slots:", error);
            });
    }, []);

    // Handle booking a slot
    const handleBooking = (slotId) => {
        // Check if the slot is already booked
        const slot = slots.find(s => s.id === slotId);
        if (slot.is_booked === 1) {
            alert("This slot is already booked. Please choose another.");
            return;
        }

        // Proceed to book the slot (update `is_booked` in the database)
        axios.put(`http://localhost:5001/book-slot/${slotId}`)
            .then(response => {
                alert("Booking successful!");
                setSlots(slots.map(s => s.id === slotId ? { ...s, is_booked: 1 } : s)); // Update local state
            })
            .catch(error => {
                console.error("Error booking slot:", error);
            });
    };

    return (
        <div>
            <h2>Available Slots</h2>
            <ul>
                {slots.map(slot => (
                    <li key={slot.id}>
                        {slot.date} - {slot.time}
                        {slot.is_booked === 0 ? (
                            <button onClick={() => handleBooking(slot.id)}>Book</button>
                        ) : (
                            <span> (Booked)</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SlotBooking;
