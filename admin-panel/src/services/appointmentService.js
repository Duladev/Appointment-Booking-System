import axios from "axios";

const API_URL = "http://localhost:5003"; // Using the API_URL variable here

export const getAppointments = async () => {
    try {
        const response = await axios.get(`${API_URL}/appointments`); // Using axios
        return response.data;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        throw error;
    }
};

export const addAppointment = async (appointment) => {
    try {
        const response = await axios.post(`${API_URL}/appointments`, appointment); // Using axios
        return response.data;
    } catch (error) {
        console.error('Error adding appointment:', error);
        throw error;
    }
};

export const updateAppointment = async (id, appointment) => {
    try {
        const response = await axios.put(`${API_URL}/appointments/${id}`, appointment); // Using axios
        return response.data;
    } catch (error) {
        console.error('Error updating appointment:', error);
        throw error;
    }
};

export const deleteAppointment = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/appointments/${id}`); // Using axios
        return response.data;
    } catch (error) {
        console.error('Error deleting appointment:', error);
        throw error;
    }
};
