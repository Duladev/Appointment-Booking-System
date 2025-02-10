import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [slots, setSlots] = useState([]);
    const [newSlot, setNewSlot] = useState('');
    const [newAppointment, setNewAppointment] = useState({
        name: '',
        email: '',
        time: '',
        description: '',
    });

    // Fetch appointments and slots when the page loads
    useEffect(() => {
        axios.get('http://localhost:5004/appointments')
            .then(response => {
                setAppointments(response.data);
            })
            .catch(error => console.error('Error fetching appointments:', error));

        axios.get('http://localhost:5004/slots')
            .then(response => {
                setSlots(response.data);
            })
            .catch(error => console.error('Error fetching slots:', error));
    }, []);

    // Handle adding a new available slot
    const handleAddSlot = () => {
        if (newSlot) {
            axios.post('http://localhost:5004/slots', { time: newSlot })
                .then(response => {
                    alert('Slot added successfully');
                    setSlots([...slots, { time: newSlot }]);
                    setNewSlot('');
                })
                .catch(error => console.error('Error adding slot:', error));
        } else {
            alert('Please provide a time for the slot.');
        }
    };

    // Handle adding a new appointment
    const handleAddAppointment = () => {
        axios.post('http://localhost:5004/appointments', newAppointment)
            .then(response => {
                alert('Appointment added successfully');
                setAppointments([...appointments, newAppointment]);
                setNewAppointment({
                    name: '',
                    email: '',
                    time: '',
                    description: '',
                });
            })
            .catch(error => console.error('Error adding appointment:', error));
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-semibold text-center text-gray-700 mb-8">Admin Dashboard</h1>

            {/* Available Slots Management */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-600 mb-4">Available Time Slots</h2>

                <div className="mb-4 flex space-x-4">
                    <input
                        type="time"
                        className="p-3 border border-gray-300 rounded-md w-1/4"
                        value={newSlot}
                        onChange={(e) => setNewSlot(e.target.value)}
                    />
                    <button
                        onClick={handleAddSlot}
                        className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none"
                    >
                        Add Slot
                    </button>
                </div>

                <ul className="space-y-2">
                    {slots.map((slot, index) => (
                        <li key={index} className="bg-white p-4 rounded-md shadow-md">
                            <span className="text-lg font-semibold text-gray-700">{slot.time}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Appointments List */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-600 mb-4">Appointments</h2>

                <ul className="space-y-4">
                    {appointments.map((appointment, index) => (
                        <li key={index} className="bg-white p-4 rounded-md shadow-md">
                            <div className="flex justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{appointment.name}</h3>
                                    <p className="text-sm text-gray-500">Time: {appointment.time}</p>
                                    <p className="text-sm text-gray-500">Email: {appointment.email}</p>
                                    <p className="text-sm text-gray-500">Description: {appointment.description}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">
                                        Edit
                                    </button>
                                    <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Add New Appointment */}
            <div className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-600 mb-4">Add New Appointment</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
                        className="w-full p-3 border border-gray-300 rounded-md"
                        value={newAppointment.name}
                        onChange={(e) => setNewAppointment({ ...newAppointment, name: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 border border-gray-300 rounded-md"
                        value={newAppointment.email}
                        onChange={(e) => setNewAppointment({ ...newAppointment, email: e.target.value })}
                    />
                    <select
                        className="w-full p-3 border border-gray-300 rounded-md"
                        value={newAppointment.time}
                        onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                    >
                        <option value="">Select Time Slot</option>
                        {slots.map((slot, index) => (
                            <option key={index} value={slot.time}>{slot.time}</option>
                        ))}
                    </select>
                    <textarea
                        placeholder="Description"
                        className="w-full p-3 border border-gray-300 rounded-md"
                        value={newAppointment.description}
                        onChange={(e) => setNewAppointment({ ...newAppointment, description: e.target.value })}
                    />
                    <button
                        onClick={handleAddAppointment}
                        className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600"
                    >
                        Add Appointment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
