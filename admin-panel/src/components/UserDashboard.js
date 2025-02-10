import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserDashboard = () => {
    const [appointments, setAppointments] = useState([]);  // List of appointments

    useEffect(() => {
        axios.get('http://localhost:5004/appointments/user')
            .then(response => {
                console.log("Received time slots:", response.data); // ✅ Check what the API returns
                setAppointments(response.data);
            })
            .catch(error => console.error("Error fetching appointments:", error));
    }, []);

    useEffect(() => {
        // Fetch the user's appointments (pending and completed)
        axios.get('http://localhost:5004/appointments/user')  // Update this API endpoint based on your backend
            .then(response => {
                setAppointments(response.data);
            })
            .catch(error => {
                console.error("Error fetching appointments:", error);
            });
    }, []);

    const handleCancelAppointment = (appointmentId) => {
        axios.post('http://localhost:5004/appointments/cancel', { appointmentId })
            .then(response => {
                alert(response.data.message);
                setAppointments(appointments.filter(appointment => appointment.id !== appointmentId)); // Remove from list
            })
            .catch(error => {
                console.error("Error canceling appointment:", error);
            });
    };

    const handleEditAppointment = (appointmentId) => {
        // Logic to edit appointment
        console.log("Editing appointment with ID:", appointmentId);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">User Dashboard</h1>
            <h2 className="text-xl mb-4">Your Appointments</h2>

            <div className="mb-4">
                <Link to="/book-appointment">
                    <button className="bg-blue-500 text-white p-2 rounded">Book New Appointment</button>
                </Link>
            </div>

            <div className="space-y-4">
                {appointments.length > 0 ? (
                    appointments.map(appointment => (
                        <div key={appointment.id} className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow-md">
                            <div>
                                <p><strong>{appointment.name}</strong></p>
                                <p>{appointment.date} at {appointment.time}</p>
                            </div>

                            <div className="flex space-x-4">
                                {appointment.status === 'pending' && (
                                    <>
                                        <button onClick={() => handleEditAppointment(appointment.id)} className="bg-yellow-500 text-white p-2 rounded">
                                            Edit
                                        </button>
                                        <button onClick={() => handleCancelAppointment(appointment.id)} className="bg-red-500 text-white p-2 rounded">
                                            Cancel
                                        </button>
                                    </>
                                )}
                                {appointment.status === 'completed' && (
                                    <span className="text-green-500">Completed</span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>You have no appointments.</p>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
