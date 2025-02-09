import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [userContact, setUserContact] = useState(''); // For Email or Mobile number

    useEffect(() => {
        // Fetch appointments on load
        axios.get('http://localhost:5004/appointments')
            .then(response => {
                setAppointments(response.data);
            })
            .catch(error => {
                console.error("Error fetching appointments:", error);
            });
    }, []);

    const handleBookAppointment = (appointment) => {
        setSelectedAppointment(appointment);
    };

    const handleConfirmBooking = () => {
        if (selectedAppointment && userContact) {
            axios.post('http://localhost:5004/appointments/book', {
                appointmentId: selectedAppointment.id,
                contact: userContact
            })
                .then(response => {
                    alert(response.data.message);
                    setSelectedAppointment(null);
                    setUserContact(''); // Clear contact field after booking
                })
                .catch(error => {
                    console.error("Error booking appointment:", error);
                });
        } else {
            alert("Please provide your contact (Email or Mobile number).");
        }
    };

    return (
        <div>
            <h1>User Dashboard</h1>
            <h2>Available Appointments</h2>
            <ul>
                {appointments.map(appointment => (
                    <li key={appointment.id}>
                        {appointment.name} - {appointment.date} at {appointment.time}
                        <button onClick={() => handleBookAppointment(appointment)}>Book Appointment</button>
                    </li>
                ))}
            </ul>

            {selectedAppointment && (
                <div>
                    <h3>Confirm Booking</h3>
                    <p>Appointment: {selectedAppointment.name} - {selectedAppointment.date} at {selectedAppointment.time}</p>

                    <label htmlFor="contact">Email or Mobile Number</label>
                    <input
                        type="text"
                        id="contact"
                        placeholder="Enter your email or mobile number"
                        value={userContact}
                        onChange={(e) => setUserContact(e.target.value)}
                    />
                    <button onClick={handleConfirmBooking}>Confirm Booking</button>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
