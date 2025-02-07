import axios from "axios";

const API_URL = "http://localhost:5001"; // Update this with your backend URL

export const getAppointments = async () => {
    try {
        const response = await axios.get(`${API_URL}/appointments`);
        return response.data;
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return [];
    }
};

export const deleteAppointment = async (id) => {
    try {
        await axios.delete(`${API_URL}/appointments/${id}`);
        return true;
    } catch (error) {
        console.error("Error deleting appointment:", error);
        return false;
    }
};
