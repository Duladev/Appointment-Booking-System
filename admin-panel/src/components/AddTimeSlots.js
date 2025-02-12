import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddTimeSlots = () => {
    const [newSlot, setNewSlot] = useState('');
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);  // Loading state for fetching slots
    const [error, setError] = useState(null);  // Error state
    const navigate = useNavigate();

    // Fetch slots when the component is mounted
    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:5005/api/slots')
            .then((response) => {
                setSlots(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError('Error fetching slots. Please try again.');
                setLoading(false);
                console.error('Error fetching slots:', error);
            });
    }, []);

    const handleAddSlot = () => {
        if (!newSlot) {
            alert('Please provide a time for the slot.');
            return;
        }

        setLoading(true);
        setError(null); // Reset error before making the request

        axios.post('http://localhost:5005/api/slots', { time: newSlot })
            .then((response) => {
                alert(response.data.message);
                setNewSlot('');
                // Fetch updated slots after adding the new one
                axios.get('http://localhost:5005/api/slots')
                    .then((response) => {
                        setSlots(response.data);
                        setLoading(false);
                    })
                    .catch((error) => {
                        setError('Error fetching slots after adding. Please try again.');
                        setLoading(false);
                        console.error('Error fetching slots after adding:', error);
                    });
            })
            .catch((error) => {
                setError('Error adding slot. Please try again.');
                setLoading(false);
                console.error('Error adding slot:', error);
            });
    };

    // Handle deleting a slot
    const handleDeleteSlot = (slotId) => {
        setLoading(true);
        setError(null); // Reset error before making the request

        axios.delete(`http://localhost:5005/api/slots/${slotId}`)
            .then((response) => {
                alert(response.data.message);
                // Fetch updated slots after deleting the slot
                axios.get('http://localhost:5005/api/slots')
                    .then((response) => {
                        setSlots(response.data);
                        setLoading(false);
                    })
                    .catch((error) => {
                        setError('Error fetching slots after deleting. Please try again.');
                        setLoading(false);
                        console.error('Error fetching slots after deleting:', error);
                    });
            })
            .catch((error) => {
                setError('Error deleting slot. Please try again.');
                setLoading(false);
                console.error('Error deleting slot:', error);
            });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            <h1 className="text-2xl font-semibold text-gray-700 mb-6">Add Time Slots</h1>

            {loading && <div className="text-blue-500 mb-4">Loading...</div>} {/* Loading state */}

            <input
                type="time"
                className="p-3 border border-gray-300 rounded-md w-64 mb-4"
                value={newSlot}
                onChange={(e) => setNewSlot(e.target.value)}
                disabled={loading}  // Disable input while loading
            />

            <button
                onClick={handleAddSlot}
                className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 w-64 mb-4"
                disabled={loading}  // Disable button while loading
            >
                Add Slot
            </button>

            <button
                onClick={() => navigate('/')}
                className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 w-64"
            >
                Back to Dashboard
            </button>

            {/* Display errors if any */}
            {error && <div className="text-red-500 mt-4">{error}</div>}

            <div className="mt-6">
                <h2 className="text-xl font-semibold">Existing Time Slots:</h2>
                {slots.length > 0 ? (
                    <ul>
                        {slots.map((slot, index) => (
                            <li key={index} className="mt-2 flex items-center justify-between">
                                <span>{slot.time}</span>
                                <button
                                    onClick={() => handleDeleteSlot(slot.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                    disabled={loading}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="mt-4 text-gray-500">No time slots available yet.</div>
                )}
            </div>
        </div>
    );
};

export default AddTimeSlots;
