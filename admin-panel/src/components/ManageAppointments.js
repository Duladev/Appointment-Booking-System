import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ManageAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [updatedData, setUpdatedData] = useState({ date: "", status: "" });
    const navigate = useNavigate();

    // Fetch appointments on component mount
    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get("http://localhost:5005/appointments");
            setAppointments(response.data);
        } catch (err) {
            console.error("Error fetching appointments:", err);
            setError("Failed to fetch appointments.");
        } finally {
            setLoading(false);
        }
    };

    // Delete an appointment
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5006/appointments/${id}`);
            setAppointments(appointments.filter((appointment) => appointment.id !== id));
        } catch (error) {
            console.error("Error deleting appointment:", error);
        }
    };

    // Update an appointment
    const handleUpdate = async () => {
        if (!editingAppointment) return;

        try {
            await axios.put(`http://localhost:5006/appointments/${editingAppointment.id}`, updatedData);
            setAppointments(
                appointments.map((appointment) =>
                    appointment.id === editingAppointment.id
                        ? { ...appointment, ...updatedData }
                        : appointment
                )
            );
            setEditingAppointment(null);
            setUpdatedData({ date: "", status: "" });
        } catch (error) {
            console.error("Error updating appointment:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Manage Appointments</h1>

            {loading ? (
                <p className="text-center text-gray-500">Loading appointments...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <ul className="space-y-4">
                    {appointments.length > 0 ? (
                        appointments.map((appointment) => (
                            <li key={appointment.id} className="bg-white p-4 rounded-md shadow-md">
                                <h3 className="text-lg font-semibold text-gray-800">{appointment.name}</h3>
                                <p className="text-sm text-gray-500">Mobile: {appointment.mobilenumber}</p>
                                <p className="text-sm text-gray-500">Slot ID: {appointment.slot_id}</p>
                                <p className="text-sm text-gray-500">Date: {new Date(appointment.date).toDateString()}</p>
                                <p className="text-sm text-gray-500">Status: {appointment.status}</p>
                                <p className="text-sm text-gray-500">Description: {appointment.description}</p>

                                <div className="mt-3 flex gap-3">
                                    <button
                                        onClick={() => handleDelete(appointment.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingAppointment(appointment);
                                            setUpdatedData({
                                                date: appointment.date.split("T")[0],
                                                status: appointment.status
                                            });
                                        }}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No appointments found.</p>
                    )}
                </ul>
            )}

            {/* Edit Appointment Form */}
            {editingAppointment && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Edit Appointment</h2>
                        <label className="block text-gray-600">Date:</label>
                        <input
                            type="date"
                            value={updatedData.date}
                            onChange={(e) => setUpdatedData({ ...updatedData, date: e.target.value })}
                            className="w-full border rounded-md p-2 mb-2"
                        />
                        <label className="block text-gray-600">Status:</label>
                        <select
                            value={updatedData.status}
                            onChange={(e) => setUpdatedData({ ...updatedData, status: e.target.value })}
                            className="w-full border rounded-md p-2 mb-4"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setEditingAppointment(null)}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-6 flex justify-center">
                <button
                    onClick={() => navigate("/")}
                    className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default ManageAppointments;
