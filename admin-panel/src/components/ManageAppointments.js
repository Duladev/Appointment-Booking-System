import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ManageAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5007/appointments')
            .then(response => setAppointments(response.data))
            .catch(error => console.error('Error fetching appointments:', error));
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Manage Appointments</h1>
            <ul className="space-y-4">
                {appointments.map((appointment) => (
                    <li key={appointment._id} className="bg-white p-4 rounded-md shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800">{appointment.name}</h3>
                        <p className="text-sm text-gray-500">Time: {appointment.time}</p>
                        <p className="text-sm text-gray-500">Email: {appointment.email}</p>
                        <p className="text-sm text-gray-500">Description: {appointment.description}</p>
                    </li>
                ))}
            </ul>
            <div className="mt-6 flex justify-center">
                <button
                    onClick={() => navigate('/')}
                    className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default ManageAppointments;
