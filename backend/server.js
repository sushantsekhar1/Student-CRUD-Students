const express = require('express');
const mysql2 = require('mysql2');
const cors = require('cors');
const app = express();

// Database connection
const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'cdacacts',
    database: 'studentdb'
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to the database
db.connect(err => {
    if (err) {
        console.log("Database connection failed: " + err.stack);
        return;
    }
    console.log("Database connected");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Create a student
app.post('/students', (req, res) => {
    const { name, email, course, address, mobile, dob } = req.body;
    const sql = 'INSERT INTO students (name, email, course, address, mobile, dob) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(sql, [name, email, course, address, mobile, dob], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error adding student' });
        }
        res.status(201).json({ message: "Student added successfully" });
    });
});

// Get all students
app.get('/students', (req, res) => {
    db.query('SELECT * FROM students', (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error fetching data" });
        }
        res.json(result);
    });
});

// Update a student
app.put('/students/:id', (req, res) => {
    const { name, email, course, address, mobile, dob } = req.body;
    const { id } = req.params;

    const sql = "UPDATE students SET name = ?, email = ?, course = ?, address = ?, mobile = ?, dob = ? WHERE id = ?";
    db.query(sql, [name, email, course, address, mobile, dob, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error updating data" });
        }
        res.json({ message: "Student updated successfully", data: result });
    });
});

// Delete a student
app.delete('/students/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM students WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error deleting student" });
        }
        res.status(200).json({ message: "Student deleted successfully" });
    });
});
