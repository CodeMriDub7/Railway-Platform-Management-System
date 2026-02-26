// server.js (Keep as is, just verify logic.js is updated)
const express = require('express');
const cors = require('cors');
const { calculateStationRequirements } = require('./logic');

const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(express.json());

app.post('/calculate', (req, res) => {
    try {
        const trains = req.body.trains; 
        // Expecting: { trains: [{ trainNo: "123", arrival: "ISO_STRING", departure: "ISO_STRING", direction: "Up" }] }
        
        if (!trains || !Array.isArray(trains)) {
            return res.status(400).json({ error: "Invalid format." });
        }

        const results = calculateStationRequirements(trains);
        res.json({ success: true, results: results });

    } catch (error) {
        console.error("Logic Error:", error);
        res.status(500).json({ success: false, error: "Calculation Failed" });
    }
});

app.listen(PORT, () => console.log(`Server at http://localhost:${PORT}`));
