import axios from 'axios';

const API = axios.create({
    baseURL: "http://localhost:5001", // Your backend URL
    headers: {
        "Content-Type": "application/json",
    },
});

export default API;
