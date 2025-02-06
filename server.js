// MySQL Database Connection
const mysql = require('mysql2');

// Establish MySQL connection
const db = mysql.createConnection({
    host: 'localhost',  // Database host (usually 'localhost' if running MySQL locally)
    user: 'root',       // MySQL username
    password: 'Dula2001', // MySQL password
    database: 'appointment_booking'  // Database name
});

// Test MySQL connection
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Loading environment variables from .env (optional)
require("dotenv").config();

// Express setup
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Default route
app.get("/", (req, res) => {
    res.send("Appointment Booking System API is running...");
});

// Route to get available slots from the database (instead of static data)
app.get("/slots", (req, res) => {
    const query = "SELECT * FROM slots";  // Assuming your table name is "slots"

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching slots:", err);  // Log the error to the console
            return res.status(500).json({ message: "Error fetching slots" });
        }
        res.json(results);  // Return the fetched slots data
    });
});


// Setting the port (from environment or default 5001)
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
