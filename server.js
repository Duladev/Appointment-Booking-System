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

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL");
    }
});

// **User Registration Route**
app.post("/api/register", async (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, hashedPassword], (err, result) => {
        if (err) {
            return res.status(400).json({ message: "Email already exists" });
        }
        res.json({ message: "User registered successfully" });
    });
});

// **User Login Route**
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

// **Admin Login Route**
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
