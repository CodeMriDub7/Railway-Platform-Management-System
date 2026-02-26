app.post('/calculate', (req, res) => {
    try {
        const trains = req.body.trains;
        if (!trains) return res.status(400).json({ success: false, error: "No data" });

        const results = calculateStationRequirements(trains);
        
        // This matches the frontend 'data.results' call
        res.json({ success: true, results: results }); 
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
