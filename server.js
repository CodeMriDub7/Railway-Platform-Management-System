// server.js
const express = require('express');
const cors = require('cors');
const { calculateStationRequirements } = require('./logic');

const app = express();
const PORT = 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.post('/calculate', (req, res) => {
    try {
        const { trains } = req.body;
        if (!trains) return res.status(400).json({ success: false, error: "No data" });

        const results = calculateStationRequirements(trains);
        res.json({ success: true, results });
    } catch (error) {
        res.status(500).json({ success: false, error: "Calculation Error" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 StationMaster Server running on http://localhost:${PORT}`);
});
