import axios from 'axios';

const API = axios.create({
    baseURL: "http://localhost:5005", // Backend's URL and port
    headers: {
        "Content-Type": "application/json",
    },
});

export const addTimeSlot = async (slotData) => {
    try {
        // Use axios for the POST request
        const response = await API.post("/api/slots", slotData);

        if (response.status !== 200) {
            throw new Error("Failed to add time slot");
        }

        return response.data; // Return the response data from the server
    } catch (error) {
        console.error("Error adding time slot:", error);
    }
};
export const addappointments = async (slotData) => {
    try {
        // Use axios for the POST request
        const response = await API.post("/api/book-appointments", slotData);

        if (response.status !== 200) {
            throw new Error("Failed to add time slot");
        }

        return response.data; // Return the response data from the server
    } catch (error) {
        console.error("Error adding time slot:", error);
    }
};
