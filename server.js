// server.js
const express = require('express');
const cors = require('cors');
const { calculateStationRequirements } = require('./logic');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/calculate', (req, res) => {
    try {
        const { trains } = req.body;
        if (!trains || !Array.isArray(trains)) {
            return res.status(400).json({ success: false, error: "Invalid Data" });
        }

        const results = calculateStationRequirements(trains);
        res.json({ success: true, results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Server Calculation Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
