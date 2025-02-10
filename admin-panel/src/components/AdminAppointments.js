import React, { useState, useEffect } from "react";

const AdminAppointments = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        const response = await fetch("http://localhost:5000/api/admin/appointments");
        const data = await response.json();
        setAppointments(data);
    };

    const updateStatus = async (id, status) => {
        await fetch(`http://localhost:5000/api/admin/appointments/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });

        fetchAppointments(); // Refresh appointments
    };

    return (
        <div>
            <h2>Admin: Manage Appointments</h2>
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Update</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appt) => (
                        <tr key={appt.id}>
                            <td>{appt.name}</td>
                            <td>{appt.email}</td>
                            <td>{appt.appointment_date}</td>
                            <td>{appt.appointment_time}</td>
                            <td>{appt.reason}</td>
                            <td>{appt.status}</td>
                            <td>
                                <button onClick={() => updateStatus(appt.id, "Confirmed")}>Confirm</button>
                                <button onClick={() => updateStatus(appt.id, "Cancelled")}>Cancel</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminAppointments;
