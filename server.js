// server.js
const express = require('express');
const cors = require('cors');
const { calculateStationRequirements } = require('./logic');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/calculate', (req, res) => {
    try {
        const results = calculateStationRequirements(req.body.trains);
        res.json({ success: true, results });
    } catch (e) { res.status(500).send(e.message); }
});

app.listen(3000, () => console.log("🚀 Server running on Port 3000"));
