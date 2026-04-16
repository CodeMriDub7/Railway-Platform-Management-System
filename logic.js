// logic.js

function calculateStationRequirements(trainList) {
    const BUFFER = 8 * 60000; 
    const REVERSAL_BUFFER = 25 * 60000;
    const TERMINATING_STAY = 40 * 60000; // Updated to 45 minutes as requested

    const valid = trainList.filter(t => {
        const a = new Date(t.arrival).getTime();
        return !isNaN(a);
    });

    // 2. Process times and resolve priorities
    const processed = valid.map(t => {
        const arr = new Date(t.arrival).getTime();
        let dep = new Date(t.departure).getTime();

        // Overwrite departure time if it is a Terminating train
        if (t.isLastStop) {
            dep = arr + TERMINATING_STAY;
        } else if (dep < arr) {
            // Failsafe: If user accidentally inputs departure BEFORE arrival, push it 1 day forward
            dep += (24 * 60 * 60 * 1000); 
        }

        return { ...t, arr, dep };
    }).sort((a, b) => {
        // Sort chronologically by arrival. If tied, sort by priority (High = 10, Med = 5, Std = 1)
        if (a.arr !== b.arr) return a.arr - b.arr;
        return b.priority - a.priority; 
    });

    let platforms = []; // Tracks the exact timestamp a platform becomes free
    let schedule = [];

    // 3. Platform Assignment Logic
    processed.forEach(train => {
        const currentBuffer = train.type === 'R' ? REVERSAL_BUFFER : BUFFER;
        
        // Find the first platform that is free before this train arrives (accounting for buffer)
        let pIdx = platforms.findIndex(freeAt => (freeAt + currentBuffer) <= train.arr);

        if (pIdx === -1) {
            // No free platform found, create a new one
            platforms.push(train.dep);
            pIdx = platforms.length - 1;
        } else {
            // Platform found, update its new "free at" time
            platforms[pIdx] = train.dep;
        }

        // Format dates beautifully to match the Minimalist UI
        const depDateObj = new Date(train.dep);
        const dateStr = depDateObj.toLocaleDateString();
        const timeStr = depDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        schedule.push({
            ...train,
            platform: pIdx + 1,
            displayDep: train.isLastStop 
                ? `${dateStr} &middot; ${timeStr} (Yard)` 
                : `${dateStr} &middot; ${timeStr}`
        });
    });

    return { 
        total: platforms.length, 
        schedule: schedule 
    };
}

module.exports = { calculateStationRequirements };