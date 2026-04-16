// server.js
const express = require('express');
const cors = require('cors');
const { calculateStationRequirements } = require('./logic');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Route
app.post('/calculate', (req, res) => {
    try {
        const { trains } = req.body;

        // Security / Validation Guardrail
        if (!trains || !Array.isArray(trains)) {
            console.warn("⚠️ Received invalid data format.");
            return res.status(400).json({ 
                success: false, 
                error: "Invalid payload. 'trains' array is required." 
            });
        }

        console.log(`🚂 Processing schedule for ${trains.length} train(s)...`);

        // Execute the logic
        const results = calculateStationRequirements(trains);
        
        // Return successful payload
        res.status(200).json({ 
            success: true, 
            results: results 
        });

    } catch (error) {
        console.error("❌ Server Error during calculation:", error);
        res.status(500).json({ 
            success: false, 
            error: "Internal Server Error during platform calculation." 
        });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`\n=========================================`);
    console.log(`🚀 StationMaster API running on Port ${PORT}`);
    console.log(`=========================================\n`);
});