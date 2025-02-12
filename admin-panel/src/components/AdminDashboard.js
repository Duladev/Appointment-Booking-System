import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            <h1 className="text-3xl font-semibold text-gray-700 mb-8">Admin Dashboard</h1>
            <div className="space-y-4">
                <button
                    onClick={() => navigate('/add-time-slots')}
                    className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 w-64"
                >
                    Add Time Slots
                </button>
                <button
                    onClick={() => navigate('/manage-appointments')}
                    className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 w-64"
                >
                    Manage Appointments
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
