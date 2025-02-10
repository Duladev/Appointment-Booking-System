import axios from 'axios';

const API = axios.create({
    baseURL: "http://localhost:5005", // Make sure this matches your backend's URL and port
    headers: {
        "Content-Type": "application/json",
    },
});


const fetchAvailableTimeSlots = async (date) => {
    try {
        const response = await API.get("/api/available-time-slots", {
            params: { date }  // Send date as query parameter
        });

        // Handle the response, which will contain available and booked time slots
        console.log("Available Slots:", response.data.availableSlots);
        console.log("Booked Slots:", response.data.bookedSlots);

        return response.data;  // Return data if needed in further processing
    } catch (error) {
        console.error("Error fetching time slots:", error.response || error.message);
        // You can handle errors here, for example, showing an error message to the user
        throw new Error("Error fetching time slots. Please try again later.");
    }
};

// Example usage: Fetch time slots for a specific date
fetchAvailableTimeSlots("2025-02-10");
