require("dotenv").config(); // Load environment variables
const mysql = require('mysql2/promise'); // Use the promise-compatible version
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

// Test the database connection
db.getConnection()
    .then(() => {
        console.log('✅ Connected to MySQL');
    })
    .catch((err) => {
        console.error('Error connecting to MySQL:', err.stack);
    });

// **User Registration**
app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        const [result] = await db.query(sql, [name, email, hashedPassword]);

        res.json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "Internal server error", error });
    }
});


// **User Login**
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    // Query to find user by email
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = results[0];

        // Compare provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: "1h" } // Token expires in 1 hour
        );

        return res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email } });
    });
});

// **Admin Login**
app.post("/api/admin-login", async (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM admins WHERE username = ?";

    try {
        const [results] = await db.query(sql, [username]);

        if (results.length === 0) {
            return res.status(400).json({ message: "Admin not found" });
        }

        const admin = results[0];
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ adminId: admin.id }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ token, admin: { id: admin.id, username: admin.username } });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});

// **Create Appointment**
app.post("/api/book-appointments", async (req, res) => {
    const { userId, name, mobileNumber, description, slotId, date } = req.body;
    if (!slotId) {
        return res.status(400).send("slotId is required");
    }

    try {
        const sqlInsert = "INSERT INTO appointments (user_id, name, mobilenumber, description, slot_id, date) VALUES (?, ?, ?, ?, ?, ?)";
        const [result] = await db.query(sqlInsert, [userId, name, mobileNumber, description, slotId, date]);

        // Mark the slot as booked
        const sqlUpdateSlot = "UPDATE slots SET booked = true WHERE id = ?";
        await db.query(sqlUpdateSlot, [slotId]);

        res.status(201).json({ message: "Appointment booked successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error booking appointment", error });
    }
});

// **Get User's Appointments**
app.get("/api/book-appointments/:userId", async (req, res) => {
    const userId = req.params.userId;
    const sql = "SELECT * FROM appointments WHERE user_id = ?";

    try {
        const [results] = await db.query(sql, [userId]);
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: "Error fetching appointments", error: err });
    }
});

// **Manage Time Slots**
app.post("/api/slots", async (req, res) => {
    const { time } = req.body;
    const sql = "INSERT INTO slots (time) VALUES (?)";

    try {
        await db.query(sql, [time]);
        res.status(201).json({ message: "Slot added successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error adding slot", error: err });
    }
});

app.get("/api/slots", async (req, res) => {
    const sql = "SELECT * FROM slots";
    try {
        const [results] = await db.query(sql);
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: "Error fetching slots", error: err });
    }
});

// **Delete Slot**
app.delete('/api/slots/:id', async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM slots WHERE id = ?';
    try {
        await db.query(query, [id]);
        res.status(200).json({ message: 'Slot deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: "Error deleting slot", error: err });
    }
});

// **Delete Appointment**
app.delete('/appointments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM appointments WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
        console.error("Error deleting appointment:", error);
        res.status(500).json({ message: "Error deleting appointment", error });
    }
});

// **Fetch All Appointments**
app.get('/appointments', async (req, res) => {
    try {
        const [appointments] = await db.query("SELECT * FROM appointments");
        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error.stack);
        res.status(500).json({ message: "Failed to fetch appointments", error: error.message });
    }
});

// **Update Appointment Status**
app.put('/appointments/:id', async (req, res) => {
    const { id } = req.params;
    const { date, status, description } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE appointments SET date = ?, status = ?, description = ? WHERE id = ?',
            [date, status, description, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.json({ message: "Appointment updated successfully" });
    } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ message: "Error updating appointment", error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
