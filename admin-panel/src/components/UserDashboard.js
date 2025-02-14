import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserDashboard = () => {
    const [appointments, setAppointments] = useState([]);  // List of appointments

    useEffect(() => {
        axios.get('http://localhost:5005/appointments/user')
            .then(response => {
                console.log("Received time slots:", response.data); // ✅ Check what the API returns
                setAppointments(response.data);
            })
            .catch(error => console.error("Error fetching appointments:", error));
    }, []);

    const handleCancelAppointment = (appointmentId) => {
        axios.post('http://localhost:5005/appointments/cancel', { appointmentId })
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
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">User Dashboard</h1>
            <h2 className="text-2xl font-medium text-gray-700 mb-6 text-center">Your Appointments</h2>

            <div className="mb-6 text-center">
                <Link to="/book-appointment">
                    <button className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300">
                        Book New Appointment
                    </button>
                </Link>
            </div>

            <div className="space-y-6">
                {appointments.length > 0 ? (
                    appointments.map(appointment => (
                        <div key={appointment.id} className="flex items-center justify-between bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div>
                                <p className="text-xl font-semibold text-gray-800">{appointment.name}</p>
                                <p className="text-sm text-gray-600">{appointment.date} at {appointment.time}</p>
                            </div>

                            <div className="flex space-x-6">
                                {appointment.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleEditAppointment(appointment.id)}
                                            className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600 transition-all duration-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleCancelAppointment(appointment.id)}
                                            className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition-all duration-200"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                                {appointment.status === 'completed' && (
                                    <span className="text-green-500 font-semibold">Completed</span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">You have no appointments.</p>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
