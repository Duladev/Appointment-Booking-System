require("dotenv").config(); // Load environment variables

const mysql = require("mysql2");
const cors = require("cors");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5005;
const SECRET_KEY = process.env.SECRET_KEY || "92ea081ab0cbed55c7e441f82add8328d51a085fff1a5145c92d1891a7475a26"; // Replace in .env file

app.use(cors());
app.use(express.json());

// Establish MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Dula2001",
    database: process.env.DB_NAME || "appointment_booking",
});

db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err);
    } else {
        console.log("✅ Connected to MySQL");
    }
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
                return res.status(500).json({ message: "Database error" });
            }
            res.json({ message: "User registered successfully" });
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
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

// **Create Appointment**
app.post("/api/appointments", (req, res) => {
    const { userId, name, mobileNumber, description, timeSlot, date } = req.body;
    const sql = "INSERT INTO appointments (user_id, name, mobileNumber, description, timeSlot, date) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(sql, [userId, name, mobileNumber, description, timeSlot, date], (err, result) => {
        if (err) {
            res.status(500).json({ message: "Error booking appointment" });
        } else {
            res.status(201).json({ message: "Appointment booked successfully!" });
        }
    });
});

// **Get User's Appointments**
app.get("/api/appointments/:userId", (req, res) => {
    const userId = req.params.userId;
    const sql = "SELECT * FROM appointments WHERE user_id = ?";

    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching appointments" });
        }
        res.json(results);
    });
});

// **Get All Appointments (Admin)**
app.get("/api/admin/appointments", (req, res) => {
    const sql = "SELECT appointments.*, users.name, users.email FROM appointments JOIN users ON appointments.user_id = users.id";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching appointments" });
        }
        res.json(results);
    });
});

// **Update Appointment Status (Admin)**
app.put("/api/admin/appointments/:id", (req, res) => {
    const { status } = req.body;
    const appointmentId = req.params.id;
    const sql = "UPDATE appointments SET status = ? WHERE id = ?";

    db.query(sql, [status, appointmentId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error updating status" });
        }
        res.json({ message: "Appointment status updated" });
    });
});

// **Get Available and Booked Time Slots**
// **Get Available and Booked Time Slots**
app.get("/api/available-time-slots", (req, res) => {
    const { date } = req.query;  // Retrieve the date query parameter
    console.log("Date received:", date);  // Debugging log to check if the date is correctly passed

    const sql = "SELECT timeSlot FROM appointments WHERE date = ?";

    db.query(sql, [date], (err, results) => {
        if (err) {
            console.error("Error fetching time slots:", err);
            return res.status(500).json({ message: "Error fetching time slots" });
        }

        const bookedSlots = results.map(row => row.timeSlot);

        // Define all possible time slots
        const allTimeSlots = [
            "09:00:00", "10:00:00", "11:00:00", "12:00:00", "13:00:00", "14:00:00", "15:00:00", "16:00:00"
        ];

        // Find the available time slots by excluding the booked slots
        const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));

        // Send the available and booked time slots as the response
        res.json({
            availableSlots,
            bookedSlots
        });
    });
});


// **Server Listener**
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
