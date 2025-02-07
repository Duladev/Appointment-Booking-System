import React, { useEffect, useState } from "react";
import { getAppointments, deleteAppointment } from "./services/appointmentService";

const AdminDashboard = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        const data = await getAppointments();
        setAppointments(data);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this appointment?")) {
            const success = await deleteAppointment(id);
            if (success) {
                setAppointments(appointments.filter((appt) => appt.id !== id));
            }
        }
    };

    return (
        <div>
            <h2>Admin Dashboard - Manage Appointments</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer Name</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appt) => (
                        <tr key={appt.id}>
                            <td>{appt.id}</td>
                            <td>{appt.customer_name}</td>
                            <td>{appt.date}</td>
                            <td>{appt.time}</td>
                            <td>
                                <button onClick={() => handleDelete(appt.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
