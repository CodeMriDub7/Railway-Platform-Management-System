// server.js
const express = require('express');
const cors = require('cors'); // Allows the HTML file to talk to this server
const { calculateStationRequirements } = require('./logic');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); 
app.use(express.json());

// API Endpoint
app.post('/calculate', (req, res) => {
    try {
        const trains = req.body.trains;
        
        // Basic Validation
        if (!trains || !Array.isArray(trains)) {
            return res.status(400).json({ error: "Invalid data format. Expected an array." });
        }

        console.log("Received data for:", trains.length, "trains");
        
        // Run Logic
        const results = calculateStationRequirements(trains);
        
        // Send Response
        res.json({ success: true, results: results });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, error: "Server Error" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});