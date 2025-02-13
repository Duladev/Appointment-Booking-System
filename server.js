require("dotenv").config(); // Load environment variables

const mysql = require("mysql2");
const cors = require("cors");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5005;
const SECRET_KEY = process.env.SECRET_KEY; // Ensure this is set in .env

app.use(cors({ origin: "http://localhost:5006" })); // Adjust based on frontend URL
app.use(express.json());

// Establish MySQL connection using pooling
const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Dula2001",
    database: process.env.DB_NAME || "appointment_booking",
    waitForConnections: true,
    connectionLimit: 10, // Adjust as needed
    queueLimit: 0
});

// **User Registration**
app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        db.query(sql, [name, email, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({ message: "Email already exists" });
                }
                return res.status(500).json({ message: "Database error", error: err });
            }
            res.json({ message: "User registered successfully" });
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});

// **User Login**
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    });
});

// **Admin Login**
app.post("/api/admin-login", (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM admins WHERE username = ?";

    db.query(sql, [username], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ message: "Admin not found" });
        }

        const admin = results[0];
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ adminId: admin.id }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ token, admin: { id: admin.id, username: admin.username } });
    });
});
// **Check Slot Availability**
app.get("/api/check-slot-availability/:slotId", (req, res) => {
    const { slotId } = req.params;

    const sql = "SELECT booked FROM slots WHERE id = ?";
    db.query(sql, [slotId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error checking slot availability", error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Slot not found" });
        }

        const isBooked = results[0].booked;
        res.json({ slotId, available: !isBooked });
    });
});

// **Create Appointment**
app.post("/api/book-appointments", (req, res) => {
    const { userId, name, mobileNumber, description, slotId, date } = req.body;
    if (!slotId) {
        return res.status(400).send("slotId is required");
    }

    const sqlInsert = "INSERT INTO appointments (user_id, name, mobilenumber, description, slot_id, date) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sqlInsert, [userId, name, mobileNumber, description, slotId, date], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error booking appointment", error: err });
        }

        // Mark the slot as booked
        const sqlUpdateSlot = "UPDATE slots SET booked = true WHERE id = ?";
        db.query(sqlUpdateSlot, [slotId], (updateErr) => {
            if (updateErr) {
                return res.status(500).json({ message: "Error updating slot status", error: updateErr });
            }
            res.status(201).json({ message: "Appointment booked successfully!" });
        });
    });
});

// **Get User's Appointments**
app.get("/api/book-appointments/:userId", (req, res) => {
    const userId = req.params.userId;
    const sql = "SELECT * FROM appointments WHERE user_id = ?";

    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching appointments", error: err });
        }
        res.json(results);
    });
});

// **Get All Appointments (Admin)**
app.get("/api/admin/appointments", (req, res) => {
    const sql = "SELECT appointments.*, users.name, users.email FROM appointments JOIN users ON appointments.user_id = users.id";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching appointments", error: err });
        }
        res.json(results);
    });
});

// **Update Appointment Status (Admin)**
app.put("/api/admin/appointments/:id", (req, res) => {
    const { status } = req.body;
    const appointmentId = req.params.id;
    const sql = "UPDATE appointments SET status = ? WHERE id = ?";

    db.query(sql, [status, appointmentId], (err) => {
        if (err) {
            return res.status(500).json({ message: "Error updating status", error: err });
        }
        res.json({ message: "Appointment status updated" });
    });
});

// **Manage Time Slots**
app.post("/api/slots", (req, res) => {
    const { time } = req.body;
    const sql = "INSERT INTO slots (time) VALUES (?)";

    db.query(sql, [time], (err) => {
        if (err) {
            return res.status(500).json({ message: "Error adding slot", error: err });
        }
        res.status(201).json({ message: "Slot added successfully" });
    });
});

app.get("/api/slots", (req, res) => {
    const sql = "SELECT * FROM slots";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching slots" });
        }
        res.json(results);
    });
});

// **Delete Slot**
app.delete('/api/slots/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM slots WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            return res.status(500).json({ message: "Error deleting slot", error: err });
        }
        res.status(200).json({ message: 'Slot deleted successfully' });
    });
});

// **Server Listener**
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
