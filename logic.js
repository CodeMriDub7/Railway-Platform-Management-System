// logic.js
function calculateStationRequirements(trainList) {
    const BUFFER = 10 * 60000; 
    const REVERSAL_BUFFER = 25 * 60000;
    const TERMINATING_STAY = 45 * 60000; // Updated to 45 minutes as requested

    const valid = trainList.filter(t => {
        const a = new Date(t.arrival).getTime();
        return !isNaN(a);
    });

    const processed = valid.map(t => {
        const arr = new Date(t.arrival).getTime();
        // Use 45-min stay for terminating trains, otherwise use departure input
        const dep = t.isLastStop ? (arr + TERMINATING_STAY) : new Date(t.departure).getTime();
        return { ...t, arr, dep };
    }).sort((a, b) => {
        if (a.arr !== b.arr) return a.arr - b.arr;
        return b.priority - a.priority; 
    });

    let platforms = []; 
    let schedule = [];

    processed.forEach(train => {
        const currentBuffer = train.type === 'R' ? REVERSAL_BUFFER : BUFFER;
        let pIdx = platforms.findIndex(freeAt => (freeAt + currentBuffer) <= train.arr);

        if (pIdx === -1) {
            platforms.push(train.dep);
            pIdx = platforms.length - 1;
        } else {
            platforms[pIdx] = train.dep;
        }

        schedule.push({
            ...train,
            platform: pIdx + 1,
            displayDep: train.isLastStop 
                ? `${new Date(train.dep).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} (Yard)` 
                : new Date(train.dep).toLocaleString()
        });
    });

    return { total: platforms.length, schedule: schedule };
}

module.exports = { calculateStationRequirements };
