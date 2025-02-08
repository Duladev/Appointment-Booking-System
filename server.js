// server.js

// MySQL Database Connection
const mysql = require('mysql2');
const cors = require("cors");
const express = require("express");

const app = express();
app.use(cors());
app.use(express.json());

// Establish MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Dula2001',
    database: 'appointment_booking'
});

// Test MySQL connection
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Default route
app.get("/", (req, res) => {
    res.send("Appointment Booking System API is running...");
});

// Route to get available slots
app.get("/slots", (req, res) => {
    const query = "SELECT * FROM slots";  // Query to get slots from the database
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching slots:", err);
            return res.status(500).json({ message: "Error fetching slots" });
        }
        res.json(results);  // Send the slots data as JSON response
    });
});

// Route to book a slot (update the `is_booked` field)
app.put("/book-slot/:id", (req, res) => {
    const slotId = req.params.id;
    const query = "UPDATE slots SET is_booked = 1 WHERE id = ?";

    db.query(query, [slotId], (err, results) => {
        if (err) {
            console.error("Error booking slot:", err);
            return res.status(500).json({ message: "Error booking slot" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Slot not found" });
        }

        res.json({ message: "Slot booked successfully" });
    });
});

// Route to get all appointments (admin access)
app.get("/appointments", (req, res) => {
    const query = "SELECT * FROM appointments";  // Query to get appointments from the database
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching appointments:", err);
            return res.status(500).json({ message: "Error fetching appointments" });
        }
        res.json(results);  // Send the appointments data as JSON response
    });
});

// Route to add a new appointment (admin access)
app.post("/appointments", (req, res) => {
    const { name, date, time, description } = req.body; // Fields for the appointment
    const query = "INSERT INTO appointments (name, date, time, description) VALUES (?, ?, ?, ?)";

    db.query(query, [name, date, time, description], (err, results) => {
        if (err) {
            console.error("Error adding appointment:", err);
            return res.status(500).json({ message: "Error adding appointment" });
        }
        res.status(201).json({ message: "Appointment added successfully" });
    });
});

// Route to update an appointment (admin access)
app.put("/appointments/:id", (req, res) => {
    const appointmentId = req.params.id;
    const { name, date, time, description } = req.body;  // Fields to update
    const query = "UPDATE appointments SET name = ?, date = ?, time = ?, description = ? WHERE id = ?";

    db.query(query, [name, date, time, description, appointmentId], (err, results) => {
        if (err) {
            console.error("Error updating appointment:", err);
            return res.status(500).json({ message: "Error updating appointment" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.json({ message: "Appointment updated successfully" });
    });
});

// Route to delete an appointment (admin access)
app.delete("/appointments/:id", (req, res) => {
    const appointmentId = req.params.id;
    const query = "DELETE FROM appointments WHERE id = ?";

    db.query(query, [appointmentId], (err, results) => {
        if (err) {
            console.error("Error deleting appointment:", err);
            return res.status(500).json({ message: "Error deleting appointment" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.json({ message: "Appointment deleted successfully" });
    });
});

// Set the port for the server to listen on
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
