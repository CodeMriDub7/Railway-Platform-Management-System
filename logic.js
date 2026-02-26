// logic.js

function calculateStationRequirements(trainList) {
    const BUFFER = 10 * 60000; // 10 mins standard
    const REVERSAL_BUFFER = 25 * 60000; // 25 mins for Point 6
    const MAX_STAY = 60 * 60000; // 1 hour for Point 5

    // 1. Point 3: Filter out trains where Arrival == Departure
    const valid = trainList.filter(t => {
        const a = new Date(t.arrival).getTime();
        const d = new Date(t.departure).getTime();
        return a !== d;
    });

    // 2. Pre-process and Sort by Arrival & Priority
    const processed = valid.map(t => ({
        ...t,
        arr: new Date(t.arrival).getTime(),
        dep: new Date(t.departure).getTime(),
        // Priority Logic: Vande Bharat gets higher rank
        priority: t.name.toLowerCase().includes("vande bharat") ? 10 : 1
    })).sort((a, b) => {
        if (a.arr !== b.arr) return a.arr - b.arr;
        return b.priority - a.priority; // Higher priority first if times are same
    });

    let platforms = []; // Stores the "Free at" timestamp for each platform
    let schedule = [];

    processed.forEach(train => {
        // Point 6: Apply Reversal Buffer if type is 'R'
        const currentBuffer = train.type === 'R' ? REVERSAL_BUFFER : BUFFER;
        
        // Point 5: If stay is very long, move to yard after 1 hour to free platform
        const platformRelease = (train.dep - train.arr) > MAX_STAY ? (train.arr + MAX_STAY) : train.dep;

        // Point 4: Find first available platform (Sharing logic)
        let pIdx = platforms.findIndex(freeAt => (freeAt + currentBuffer) <= train.arr);

        if (pIdx === -1) {
            platforms.push(platformRelease);
            pIdx = platforms.length - 1;
        } else {
            platforms[pIdx] = platformRelease;
        }

        schedule.push({
            name: train.name,
            platform: pIdx + 1,
            arrival: train.arrival,
            departure: train.departure,
            type: train.type,
            priority: train.priority,
            status: (train.dep - train.arr) > MAX_STAY ? "Moved to Yard (Long Stay)" : "Normal"
        });
    });

    return {
        total: platforms.length,
        schedule: schedule
    };
}

module.exports = { calculateStationRequirements };
