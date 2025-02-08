import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [newAppointment, setNewAppointment] = useState({ name: '', date: '', time: '', description: '' });
    const [editAppointment, setEditAppointment] = useState(null);

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

    const handleAddAppointment = () => {
        axios.post('http://localhost:5004/appointments', newAppointment)
            .then(response => {
                alert(response.data.message);
                setAppointments([...appointments, newAppointment]);
                setNewAppointment({ name: '', date: '', time: '', description: '' });
            })
            .catch(error => {
                console.error("Error adding appointment:", error);
            });
    };

    const handleDeleteAppointment = (id) => {
        axios.delete(`http://localhost:5004/appointments/${id}`)
            .then(response => {
                alert(response.data.message);
                setAppointments(appointments.filter(appointment => appointment.id !== id));
            })
            .catch(error => {
                console.error("Error deleting appointment:", error);
            });
    };

    const handleUpdateAppointment = (id) => {
        axios.put(`http://localhost:5004/appointments/${id}`, editAppointment)
            .then(response => {
                alert(response.data.message);
                setAppointments(appointments.map(appointment =>
                    appointment.id === id ? { ...appointment, ...editAppointment } : appointment
                ));
                setEditAppointment(null);
            })
            .catch(error => {
                console.error("Error updating appointment:", error);
            });
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <h2>Appointments</h2>
            <ul>
                {appointments.map(appointment => (
                    <li key={appointment.id}>
                        {appointment.name} - {appointment.date} at {appointment.time}
                        <button onClick={() => setEditAppointment(appointment)}>Edit</button>
                        <button onClick={() => handleDeleteAppointment(appointment.id)}>Delete</button>
                    </li>
                ))}
            </ul>

            <h3>Add New Appointment</h3>
            <form>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        placeholder="Enter name"
                        value={newAppointment.name}
                        onChange={(e) => setNewAppointment({ ...newAppointment, name: e.target.value })}
                    />
                </div>

                <div>
                    <label>Date:</label>
                    <input
                        type="date"
                        value={newAppointment.date}
                        onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    />
                </div>

                <div>
                    <label>Time:</label>
                    <input
                        type="time"
                        value={newAppointment.time}
                        onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                    />
                </div>

                <div>
                    <label>Description:</label>
                    <input
                        type="text"
                        placeholder="Enter description"
                        value={newAppointment.description}
                        onChange={(e) => setNewAppointment({ ...newAppointment, description: e.target.value })}
                    />
                </div>

                <button type="button" onClick={handleAddAppointment}>Add Appointment</button>
            </form>

            {editAppointment && (
                <div>
                    <h3>Edit Appointment</h3>
                    <form>
                        <div>
                            <label>Name:</label>
                            <input
                                type="text"
                                value={editAppointment.name}
                                onChange={(e) => setEditAppointment({ ...editAppointment, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label>Date:</label>
                            <input
                                type="date"
                                value={editAppointment.date}
                                onChange={(e) => setEditAppointment({ ...editAppointment, date: e.target.value })}
                            />
                        </div>

                        <div>
                            <label>Time:</label>
                            <input
                                type="time"
                                value={editAppointment.time}
                                onChange={(e) => setEditAppointment({ ...editAppointment, time: e.target.value })}
                            />
                        </div>

                        <div>
                            <label>Description:</label>
                            <input
                                type="text"
                                value={editAppointment.description}
                                onChange={(e) => setEditAppointment({ ...editAppointment, description: e.target.value })}
                            />
                        </div>

                        <button type="button" onClick={() => handleUpdateAppointment(editAppointment.id)}>Update Appointment</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
